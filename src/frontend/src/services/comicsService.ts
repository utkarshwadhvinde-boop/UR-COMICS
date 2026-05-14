import type {
  ComicView,
  CreateComicArgs,
  Genre,
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
export async function listGenres(actor: backendInterface): Promise<Genre[]> {
  return actor.listGenres();
}

export async function getComicsByGenre(
  actor: backendInterface,
  genreId: string,
): Promise<ComicView[]> {
  return actor.getComicsByGenre(genreId);
}

export async function searchComics(
  actor: backendInterface,
  query: string,
): Promise<ComicView[]> {
  return actor.searchComics(query);
}
