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
export {
  createComic as c,
  deleteComic as d,
  getComic as g,
  listComics as l,
  updateComic as u
};
