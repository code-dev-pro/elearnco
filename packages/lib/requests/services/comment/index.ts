import {
  addComment,
  deleteComment,
  deleteThread,
  getComments,
  updateComment} from "../../api.request";

export const CommentService = {
  addComment,
  deleteComment,
  updateComment,
  getComments,
  deleteThread
};
