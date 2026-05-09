/**
 * Object-storage upload utility.
 *
 * Instead of importing @caffeineai/object-storage directly (a transitive dep
 * not declared in package.json), we piggyback on createActorWithConfig which
 * already sets up a StorageClient internally. We pass a thin createActor
 * factory that captures the uploadFile / downloadFile closures for our use.
 */
import { ExternalBlob, createActor as baseCreateActor } from "@/backend";
import {
  type createActorFunction,
  createActorWithConfig,
} from "@caffeineai/core-infrastructure";
/** Hard-timeout wrapper — rejects with a readable message if promise takes too long. */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(
        () => reject(new Error(`${label} timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
}

const MOTOKO_SENTINEL = "!caf!";

/** Allowed MIME types — Android gallery sometimes strips type; we detect from extension */
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
};

/**
 * Validate a file before upload.
 * - Rejects zero-byte files
 * - Detects MIME type from extension when browser strips it (Android gallery)
 * - Rejects unsupported types
 * Returns a (possibly re-typed) File, or throws with a human-readable reason.
 */
export function validateAndCoerceImageFile(file: File): File {
  if (file.size === 0) {
    throw new Error(
      `File "${file.name}" is empty (0 bytes). Please re-select it from your gallery.`,
    );
  }

  let mimeType = file.type;

  // Android gallery sometimes provides no MIME type — detect from extension
  if (!mimeType || mimeType === "application/octet-stream") {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const detected = EXT_TO_MIME[ext];
    if (detected) {
      mimeType = detected;
      console.info(
        `[storageUpload] MIME inferred from extension .${ext} → ${mimeType} for "${file.name}"`,
      );
      // Re-wrap so the File has the correct type
      return new File([file], file.name, {
        type: mimeType,
        lastModified: file.lastModified,
      });
    }
  }

  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new Error(
      `File "${file.name}" has unsupported type "${mimeType || "(none)"}".\ Only JPEG, PNG, WebP, and GIF are allowed.`,
    );
  }

  return file;
}

type UploadFn = (file: ExternalBlob) => Promise<Uint8Array>;
type DownloadFn = (bytes: Uint8Array) => Promise<ExternalBlob>;

interface StorageFns {
  uploadFile: UploadFn;
  downloadFile: DownloadFn;
}

let _fns: StorageFns | null = null;

async function getStorageFns(): Promise<StorageFns> {
  // Always re-initialize to ensure a fresh auth token — never return a stale cached actor
  _fns = null;

  console.log("[Storage] Init started");

  const initPromise = new Promise<StorageFns>((resolve, reject) => {
    const capturingFactory: createActorFunction<
      ReturnType<typeof baseCreateActor>
    > = (canisterId, uploadFile, downloadFile, options) => {
      if (!_fns) {
        _fns = { uploadFile, downloadFile };
        resolve(_fns);
      }
      return baseCreateActor(canisterId, uploadFile, downloadFile, options);
    };

    createActorWithConfig(capturingFactory).catch((err) => {
      console.warn("storageUpload: actor init error", err);
      reject(err);
    });
  });

  try {
    const fns = await withTimeout(initPromise, 15000, "Storage initialization");
    console.log("[Storage] Init success");
    return fns;
  } catch (err) {
    console.error("[Storage] Init failed:", err);
    throw err;
  }
}

/** Upload a single file with exponential-backoff retry (up to 3 attempts). */
async function uploadWithRetry(
  uploadFile: UploadFn,
  downloadFile: DownloadFn,
  file: File,
  label: string,
): Promise<string> {
  const MAX_RETRIES = 3;
  // True exponential backoff: 500ms, 1500ms, 4000ms
  const DELAYS = [500, 1500, 4000];

  let lastErr: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(
        `[Upload] Attempt ${attempt} of ${MAX_RETRIES} for "${label}"`,
      );

      const bytes = new Uint8Array(await file.arrayBuffer());

      // Validate non-zero byte array — zero-byte files fail silently on some platforms
      if (bytes.length === 0) {
        throw new Error(
          `Zero-byte file detected for "${label}" — skipping upload`,
        );
      }

      console.info(
        `[storageUpload] Uploading "${label}" — ${bytes.length} bytes, MIME: ${file.type || "(unknown)"}`,
      );

      const hashEncoded = await withTimeout(
        uploadFile(ExternalBlob.fromBytes(bytes)),
        10000,
        `Upload attempt ${attempt} for "${label}"`,
      );

      // Validate that the returned hash decodes to a non-empty string
      const hashWithPrefix = new TextDecoder().decode(hashEncoded);
      if (!hashWithPrefix || hashWithPrefix.trim().length === 0) {
        throw new Error(
          `Upload of "${label}" returned an empty hash — treating as failure`,
        );
      }

      const hash = hashWithPrefix.startsWith(MOTOKO_SENTINEL)
        ? hashWithPrefix.slice(MOTOKO_SENTINEL.length)
        : hashWithPrefix;
      const blob = await downloadFile(
        new TextEncoder().encode(MOTOKO_SENTINEL + hash),
      );

      console.log(`[Upload] Completed: "${label}"`);
      return blob.getDirectURL();
    } catch (err) {
      lastErr = err;
      const rawMsg = err instanceof Error ? err.message : String(err);

      // Detect per-attempt timeout and log distinctly
      if (/timed out after/i.test(rawMsg)) {
        console.log(`[Upload] Timeout on attempt ${attempt}, retrying...`);
      }

      // Classify the error for better diagnostics
      let reason = rawMsg;
      if (/403|forbidden/i.test(rawMsg)) {
        reason = `Permission denied (403 Forbidden): ${rawMsg}`;
        console.error(
          `[storageUpload] 403 FORBIDDEN — path: "${label}", size: ${file.size} bytes, MIME: "${file.type || "(unknown)"}". This usually means the storage path is invalid (e.g. contains 'new' instead of a real chapter ID) or the auth token has expired.`,
          err,
        );
      } else if (/401|unauthorized/i.test(rawMsg))
        reason = `Auth expired (401): ${rawMsg}`;
      else if (/timeout|timed out/i.test(rawMsg)) reason = `Timeout: ${rawMsg}`;
      else if (/cors/i.test(rawMsg)) reason = `CORS error: ${rawMsg}`;
      else if (/mime|content.type/i.test(rawMsg))
        reason = `Invalid MIME type: ${rawMsg}`;

      console.error(
        `[storageUpload] Upload attempt ${attempt}/${MAX_RETRIES} FAILED for "${label}" (${file.type || "unknown MIME"}, ${file.size} bytes): ${reason}`,
        err,
      );

      if (attempt < MAX_RETRIES) {
        await new Promise((res) => setTimeout(res, DELAYS[attempt - 1]));
      }
    }
  }

  const finalReason =
    lastErr instanceof Error ? lastErr.message : String(lastErr);
  throw new Error(
    `Upload failed after ${MAX_RETRIES} attempts for "${label}": ${finalReason}`,
  );
}

/**
 * Upload a File/Blob to object-storage and return a permanent public URL.
 * Validates the file first. Retries up to 3 times with exponential backoff.
 * Throws with a human-readable error if all attempts fail.
 */
export async function uploadFileToStorage(file: File | Blob): Promise<string> {
  // Determine a meaningful label for logging
  const fileLabel = file instanceof File ? file.name : "upload.jpg";

  console.log(`[Upload] Started: "${fileLabel}"`);

  // Re-initialize storage fns on every call to ensure fresh auth token
  const { uploadFile, downloadFile } = await getStorageFns();

  // Validate File instances; Blobs skip validation (they come from canvas/stitcher)
  let validatedFile: File;
  if (file instanceof File) {
    try {
      validatedFile = validateAndCoerceImageFile(file);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.error(`[storageUpload] Validation FAILED: ${reason}`, err);
      throw err;
    }
  } else {
    // Blob — convert to a named File so retry label is meaningful
    validatedFile = new File([file], "upload.jpg", {
      type: file.type || "image/jpeg",
    });
  }

  try {
    const url = await withTimeout(
      uploadWithRetry(
        uploadFile,
        downloadFile,
        validatedFile,
        validatedFile.name,
      ),
      30000,
      `Full upload for "${validatedFile.name}"`,
    );
    console.log(`[Upload] Success: ${url}`);
    return url;
  } catch (err) {
    console.error("[Upload] Failed:", err);
    throw err;
  }
}

/**
 * Safe single-entry-point for all image uploads.
 * (1) Validates + coerces the file  (2) Re-inits storage fns for a fresh token
 * (3) Converts to Uint8Array and validates non-zero  (4) Calls uploadWithRetry
 * Returns a permanent public URL string.
 */
export async function uploadFileSafe(
  file: File,
  label: string,
): Promise<string> {
  // Step 1: validate + coerce
  const validatedFile = validateAndCoerceImageFile(file);

  // Step 2: re-init storage fns (fresh auth token)
  const { uploadFile, downloadFile } = await getStorageFns();

  // Step 3-4: handled inside uploadWithRetry (zero-byte check + retry)
  try {
    return await uploadWithRetry(
      uploadFile,
      downloadFile,
      validatedFile,
      label,
    );
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[uploadFileSafe] FAILED for "${label}": ${reason}`, err);
    throw new Error(`${label} upload failed: ${reason}`);
  }
}
