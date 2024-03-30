import { CommentService } from "lib";
import { CompleteComment } from "schemas";
import { create } from "zustand";

interface BlockState {
  comments: CompleteComment[];
  isLoading: boolean;
  error: unknown;
}

interface BlockActions {
  addComment: (content: string, uuid: string, userID: string) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  deleteThread: () => void;
  fetchData: (uuid: string) => Promise<void>;
}

const createBlockStore = (id: string) =>
  create<BlockState & BlockActions>((set, get) => ({
    comments: [],
    isLoading: false,
    error: "",

    fetchData: async (uuid): Promise<void> => {
      try {
        set({ isLoading: true, error: null });
        const response = await CommentService.getComments(uuid);
        const { status, data } = response as {
          status: string;
          data: CompleteComment[];
        };

        if (status === "success") {
          set({ comments: data, isLoading: false, error: null });
        } else {
          set({ error: "error", isLoading: false });
        }
      } catch (error) {
        set({ error, isLoading: false });
      }
    },

    addComment: async (
      content: string,
      uuid: string,
      userId: string
    ): Promise<void> => {
      try {
        const response = await CommentService.addComment({
          content: content,
          blockNode: { connect: { uuid: uuid } },
          user: { connect: { id: userId } },
        });
        const { status, data } = response;

        if (status === "success") {
          set((state) => ({
            comments: [...state.comments, data as CompleteComment],
          }));
        } else {
          const { message } = data as { message: string };
          set({ error: message, isLoading: false });
        }
      } catch (error) {
        set({ error, isLoading: false });
      }
    },

    updateComment: async (commentId, updatedComment) => {
      set((state) => ({
        comments: state.comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, ...{ content: updatedComment } }
            : comment
        ),
      }));

      try {
        const response = await CommentService.updateComment(
          commentId,
          updatedComment
        );
        const { status, data } = response;
        if (status !== "success") {
          const { message } = data as { message: string };
          set({ error: message, isLoading: false });
        }
      } catch (error) {
        set({ error, isLoading: false });
      }
    },

    deleteThread: async () => {
      try {
        const response = await CommentService.deleteThread(id);
        const { status, data } = response;
        if (status !== "success") {
          const { message } = data as { message: string };
          set({ error: message, isLoading: false });
        } else {
          set({ comments: [], isLoading: false });
        }
      } catch (error) {
        set({ error, isLoading: false });
      }
    },

    deleteComment: async (commentId) => {
      set((state) => ({
        comments: state.comments.filter((comment) => comment.id !== commentId),
      }));
      try {
        const response = await CommentService.deleteComment(commentId);
        const { status, data } = response;
        if (status !== "success") {
          const { message } = data as { message: string };
          set({ error: message, isLoading: false });
        } else {
          set({ comments: [], isLoading: false });
        }
      } catch (error) {
        set({ error, isLoading: false });
      }
    },
  }));

const blockStores: Record<string, ReturnType<typeof createBlockStore>> = {};

const getBlockStore = (id: string) => {
  if (!blockStores[id]) {
    blockStores[id] = createBlockStore(id);
  }
  return blockStores[id];
};

export const useCommentsStore = (id: string) => getBlockStore(id);
