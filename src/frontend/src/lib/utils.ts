import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── Input Sanitization ───────────────────────────────────────────────────────

// Strip HTML tags and trim whitespace
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}

// Validate and sanitize a display name
export function sanitizeDisplayName(input: string): string | null {
  const cleaned = sanitizeText(input);
  if (cleaned.length === 0) return null;
  if (cleaned.length > 100) return null;
  return cleaned;
}

// Validate and sanitize bio
export function sanitizeBio(input: string): string | null {
  const cleaned = sanitizeText(input);
  if (cleaned.length > 300) return null;
  return cleaned;
}

// Validate and sanitize comic title
export function sanitizeTitle(input: string): string | null {
  const cleaned = sanitizeText(input);
  if (cleaned.length === 0) return null;
  if (cleaned.length > 150) return null;
  return cleaned;
}

// Validate and sanitize comic description
export function sanitizeDescription(input: string): string | null {
  const cleaned = sanitizeText(input);
  if (cleaned.length > 1000) return null;
  return cleaned;
}

// Validate and sanitize search query
export function sanitizeSearch(input: string): string {
  return sanitizeText(input).slice(0, 100);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// Validate image file type
export function isValidImageFile(file: File): boolean {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  return allowed.includes(file.type) && file.size <= 10 * 1024 * 1024; // max 10MB
}
