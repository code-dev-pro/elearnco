import { CourseService, PageService } from "lib";
import {
  CompleteBlock,
  CompleteBlockNode,
  CompleteCourse,
  CompletePage,
  ERoutes,
} from "schemas";
import { create } from "zustand";
import { PageStatus } from "@prisma/client";

interface State {
  course: CompleteCourse;
  pages: CompletePage[];
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  totalPages: number;
  banner: string;
}

interface Actions {
  fetchData: (numPage: number, id: string) => Promise<void>;
  updateBanner: (banner: string) => void;
  addPage: (courseID: string, index: number) => void;
  addCompletionPage: (courseID?: string) => void;
  deletePage: (courseID: string, numPage: number) => void;
  updatePage: (numPage: number, data: Partial<CompletePage>) => void;
  duplicatePage: (numPage: number, index: number) => void;
  reorderPage: (pages: CompletePage[]) => void;
}

const INITIAL_STATE: State = {
  course: {} as CompleteCourse,
  pages: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  banner: "",
};

export const useCourseStore = create<State & Actions>((set, get) => ({
  course: INITIAL_STATE.course,
  pages: INITIAL_STATE.pages,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,
  currentPage: INITIAL_STATE.currentPage,
  totalPages: INITIAL_STATE.totalPages,
  banner: INITIAL_STATE.banner,

  fetchData: async (numPage: number, id: string): Promise<void> => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(
        `/api/${ERoutes.COURSE}/${id}?page=${numPage}`
      );
      const { data } = await response.json();

      set({
        course: data,
        isLoading: false,
        totalPages: data.pages.length,
        pages: data.pages,
        currentPage: numPage,
        banner: data.image,
      });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  updateBanner: async (banner): Promise<void> => {
    const currentIdCourse = get().course.id;
    try {
      await CourseService.updateCourse(currentIdCourse, { image: banner });
      set((state) => ({
        ...state,
        banner,
      }));
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  addPage: async (courseID: string, index: number): Promise<boolean> => {
    const id = courseID ?? get().course.id;
    const totalPage = get().totalPages ?? 1;
    const pageData = {
      course: { connect: { id: id } },
      index: index,
      title: "",
      description: "",
    };

    try {
      const response = await PageService.addPage(pageData);
      const { status, data } = response;
      //const { page } = data as { page: CompletePage };
      const { message } = data as { message: string };
      if (status === "success") {
        // we don't need to update state because we have refetch data by changing url
        //set((state) => ({ ...state, ...{ ...page } }));
        return true;
      } else {
        const error = message;
        return false;
        //set({ error, isLoading: false });
      }
    } catch (error) {
      //set({ error, isLoading: false });
      return false;
    }
  },

  addCompletionPage: async (courseID): Promise<void> => {},

  updatePage: async (
    page: number,
    data: Partial<CompletePage>
  ): Promise<void> => {
    const pages = get().course.pages;
    const pageFinded = pages[page - 1];
    const newData = data;

    try {
      const response = await PageService.updatePage(pageFinded.id, newData);
      const { status, data } = response;
      //const { page } = data as { page: CompletePage[] };
      const newPage = data as CompletePage;

      if (status === "success") {
        set((state) => ({
          pages: state.pages.map((page) =>
            page.id === newPage.id ? { ...newPage } : page
          ),
          course: {
            ...state.course,
            pages: state.pages.map((page) =>
              page.id === newPage.id ? { ...newPage } : page
            ),
          },
        }));
      } else {
        const { message } = data as { message: string };
        const error = message;
        set({ error, isLoading: false });
      }
    } catch (error) {}
  },
  duplicatePage: async (page: number, index: number): Promise<void> => {
    const pages = get().course.pages;
    const courseID = get().course.id;
    const totalPage = get().totalPages ?? 1;
    const pageFinded = pages[page - 1];
    const blocksFinded = pageFinded?.blocks;
    const newdata = {
      course: { connect: { id: courseID } },
      index: totalPage,
      status: PageStatus.DRAFT,
      blocks: {
        create: blocksFinded.map((block: CompleteBlock) => ({
          index: block.index,
          title: block.title,
          type: block.type,
          uuid: block.uuid,
          groupId: block.groupId,
          description: block.description,
          content: {
            create: blocksFinded[0]?.content.map((node: CompleteBlockNode) => ({
              title: node.title,
              description: node.description,
              type: node.type,
              uuid: node.uuid,
              content: node.content,
            })),
          },
        })),
      },
    };

    try {
      const response = await PageService.addPage(newdata);
      const { status, data } = response;
      const { page } = data as { page: CompletePage };
      const { message } = data as { message: string };
      if (status === "success") {
        // we don't need to update state because we have refetch data by changing url
        //set((state) => ({ ...state, ...{ ...page } }));
      } else {
        const error = message;
        set({ error, isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
  deletePage: async (courseID: string, pageIndex: number): Promise<void> => {
    const pages = get().course.pages;
    const index = pageIndex - 1;
    const pageFinded = pages[index];
    const pageFindedId = pageFinded.id;

    try {
      const response = await PageService.deletePage(
        courseID,
        pageFindedId,
        index
      );
      const { status, data } = response;
      //const { page } = data as { page: CompletePage[] };

      if (status === "success") {
        // we don't need to update state because we have refetch data by changing url
        // set((state) => ({ ...state, ...{ page: page } }));
      } else {
        const { message } = data as { message: string };
        const error = message;
        set({ error, isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  reorderPage: async (pages: CompletePage[]): Promise<void> => {
    const newdata = pages;

    try {
      const response = await PageService.reorderPage(newdata);
      const { status, data } = response;
   
      if (status === "success") {
        set((state) => ({ ...state, ...{ ...newdata } }));
      }
    } catch (error) {}
  },
}));
