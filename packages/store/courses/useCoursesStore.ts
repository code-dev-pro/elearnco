import { CourseService } from "lib";
import { CompleteCourse, CompleteTagCourse } from "schemas";
import { CourseDate, CourseStatus, CourseTitle } from "schemas/menus/dropdown";
import { create } from "zustand";

interface State {
  courses: CompleteCourse[];
  totalCourses: number;
  isLoading: boolean;
  error: unknown;
  currentPage: number;
  currentStatus: CourseStatus;
  currentOrder: CourseTitle;
  currentFolder: string;
}

interface Actions {
  addCourse: (data: Partial<CompleteCourse>) => void;
  updateCourse: (courseID: string, data: Partial<CompleteCourse>) => void;
  deleteCourse: (courseID: string) => void;
  fetchData: (
    currentPage: number,
    currentStatus: CourseStatus,
    currentOrder: CourseTitle,
    currentFolder: string,
    currentDate: CourseDate
  ) => Promise<void>;
}

const INITIAL_STATE: State = {
  courses: [],
  totalCourses: 0,
  isLoading: true,
  error: null,
  currentPage: 1,
  currentStatus: CourseStatus.DRAFT,
  currentOrder: CourseTitle.AZ,
  currentFolder: "All",
};

export const useCoursesStore = create<State & Actions>((set, get) => ({
  courses: INITIAL_STATE.courses,
  totalCourses: INITIAL_STATE.totalCourses,
  isLoading: INITIAL_STATE.isLoading,
  error: INITIAL_STATE.error,
  currentPage: INITIAL_STATE.currentPage,
  currentStatus: INITIAL_STATE.currentStatus,
  currentOrder: INITIAL_STATE.currentOrder,
  currentFolder: INITIAL_STATE.currentFolder,

  fetchData: async (
    currentPage: number,
    currentStatus: CourseStatus,
    currentOrder: CourseTitle,
    currentFolder: string,
    currentDate: CourseDate
  ): Promise<void> => {
    try {
      set({ isLoading: true, error: null });

      const response = await CourseService.getCourses(
        `?page=${currentPage}&status=${currentStatus}&folder=${currentFolder}&date=${currentDate}&order=${currentOrder}`
      );

      const { status, data } = response as {
        status: string;
        data: [CompleteCourse[], number];
      };

      if (status === "success") {
        set({
          courses: data[0],
          isLoading: false,
          totalCourses: data[1] || data[0].length,
          currentOrder: (currentOrder as CourseTitle) || CourseTitle.AZ,
          currentStatus: (currentStatus as CourseStatus) || CourseStatus.DRAFT,
          currentFolder: currentFolder || "all",
          error: null,
        });
      } else {
        set({ error: "error", isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  addCourse: async (newData: Partial<CompleteCourse>): Promise<void> => {
    try {
      const response = await CourseService.addCourse(newData);
      const { status, data } = response;
      const { course } = data as { course: CompleteCourse };

      if (status === "success") {
        set((state) => ({
          courses: [...state.courses, course],
          totalCourses: state.totalCourses + 1,
        }));
      } else {
        const { message } = data as { message: string };
        const error = message;
        set({ error, isLoading: false });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  updateCourse: async (
    courseID: string,
    Coursedata: Partial<CompleteCourse>
  ): Promise<void> => {
    const courses = get().courses;
    const courseStatus = get().currentStatus;
    const courseFolder = get().currentFolder;

    try {
      const response = await CourseService.updateCourse(courseID, Coursedata);
      const { status, data } = response;

      if (status === "success") {
        const updateCourse = courses.map((course) =>
          course.id === courseID
            ? { ...course, ...(data as CompleteCourse) }
            : course
        );

        let newStore: CompleteCourse[] = [];
        if (courseFolder === "All") {
          newStore = updateCourse.filter(
            (course) => course.status === courseStatus
          );
        } else {
          newStore = updateCourse.filter(
            (course) =>
              course.status === courseStatus &&
              course.folder?.name === courseFolder
          );
        }

        set(() => ({
          error: null,
          courses: newStore,
          totalCourses: newStore.length,
        }));
      } else {
        const { message } = data as { message: string };
        const error = message;
        set({ error });
      }
    } catch (error) {
      set({ error, isLoading: false });
    }
  },

  deleteCourse: async (courseID: string): Promise<void> => {
    try {
      const response = await CourseService.deleteCourse(courseID);
      const { status, data } = response;
      const { message } = data as { message: string };

      if (status === "success") {
        set((state) => ({
          courses: state.courses.filter((item) => item.id !== courseID),
          totalCourses: state.totalCourses - 1,
        }));
      } else {
        //set({ error, isLoading: false });
      }
    } catch (error) {
      const message = error;

      // set({ error, isLoading: false });
    }
  },
}));
