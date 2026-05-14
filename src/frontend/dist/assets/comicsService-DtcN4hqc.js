async function listComics(actor) {
  return actor.listComics();
}
async function getComic(actor, id) {
  return actor.getComic(id);
}
async function createComic(actor, args) {
  return actor.createComic(args);
}
async function updateComic(actor, id, args) {
  return actor.updateComic(id, args);
}
async function deleteComic(actor, id) {
  return actor.deleteComic(id);
}
async function listGenres(actor) {
  return actor.listGenres();
}
async function getComicsByGenre(actor, genreId) {
  return actor.getComicsByGenre(genreId);
}
async function searchComics(actor, query) {
  return actor.searchComics(query);
}
export {
  getComicsByGenre as a,
  listComics as b,
  createComic as c,
  deleteComic as d,
  getComic as g,
  listGenres as l,
  searchComics as s,
  updateComic as u
};
