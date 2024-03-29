import { getTags } from "lib/requests/api.request";
import { CompleteTagUser } from "schemas";
import { create } from "zustand";

interface State {
  tags: CompleteTagUser[];
  isLoading: boolean;
  error: unknown;
}

interface Actions {
  fetchDataTags: (userId: string) => Promise<void>;
}

const INITIAL_STATE: State = {
  tags: [],
  isLoading: true,
  error: null,
};

export const useTagsStore = create<State & Actions>((set, get) => ({
  tags: INITIAL_STATE.tags,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,

  fetchDataTags: async (userId): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      const tags = await getTags(userId);
      const { data } = tags as { data: {tags:CompleteTagUser[]} };
     
      set({
        tags: data?.tags as CompleteTagUser[],
        isLoading: false,
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
}));
