import { c as createLucideIcon } from "./index-yTllSx9S.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]];
const ChevronLeft = createLucideIcon("chevron-left", __iconNode);
async function listChapters(actor, comicId) {
  return actor.listChapters(comicId);
}
async function getChapter(actor, chapterId) {
  return actor.getChapter(chapterId);
}
async function createChapter(actor, args) {
  return actor.createChapter(args);
}
async function updateChapterDraft(actor, chapterId, args) {
  return actor.updateChapterDraft(chapterId, args);
}
async function deleteChapter(actor, chapterId) {
  return actor.deleteChapter(chapterId);
}
export {
  ChevronLeft as C,
  createChapter as c,
  deleteChapter as d,
  getChapter as g,
  listChapters as l,
  updateChapterDraft as u
};
