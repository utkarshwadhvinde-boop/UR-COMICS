import type {
  ComicView,
  CreateComicArgs,
  UpdateComicArgs,
  backendInterface,
} from "@/backend";

export async function listComics(
  actor: backendInterface,
): Promise<ComicView[]> {
  return actor.listComics();
}

export async function getComic(
  actor: backendInterface,
  id: string,
): Promise<ComicView | null> {
  return actor.getComic(id);
}

export async function createComic(
  actor: backendInterface,
  args: CreateComicArgs,
): Promise<ComicView> {
  return actor.createComic(args);
}

export async function updateComic(
  actor: backendInterface,
  id: string,
  args: UpdateComicArgs,
): Promise<ComicView> {
  return actor.updateComic(id, args);
}

export async function deleteComic(
  actor: backendInterface,
  id: string,
): Promise<void> {
  return actor.deleteComic(id);
}
