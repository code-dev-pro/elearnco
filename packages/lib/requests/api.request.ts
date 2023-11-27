import { Course, Page } from "@prisma/client";
import {
  CourseResponse,
  CoursesResponse,
  ErrorResponse,
  FolderResponse,
  FoldersResponse,
  PageResponse,
  PreregisterResponse,
  TPartialFolder,
  UserResponse,
} from "schemas/api";
import { pathApiFolder, pathApiFolders } from "./folder/folder";
import { pathApiCourse, pathApiCourses } from "./course/course";
import { pathApiUser } from "./user/user";
import { SafeUser } from "schemas/auth/Auth";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; 
  if (process.env.APP_URL) return `https://${process.env.APP_URL}`; 
  return `http://localhost:${process.env.PORT ?? 3000}`; 
};
const SERVER_ENDPOINT = getBaseUrl()
 
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message = isJson
      ? data.message || response.statusText
      : response.statusText;
    return message as T;
  }

  return data as T;
}

/** USER */
export async function apiPreregister(data: {
  email: string;
}): Promise<PreregisterResponse> {

  
  const response = await fetch(`${SERVER_ENDPOINT}/api/user/preregister`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  return handleResponse<PreregisterResponse>(response).then((data) => data);
}
export async function apiSignup(data: unknown): Promise<UserResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/user/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  return handleResponse<UserResponse>(response).then((data) => data);
}
export async function apiValidate(data: unknown): Promise<UserResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/user/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  return handleResponse<UserResponse>(response).then((data) => data);
}

export async function apiGetUser(id: string): Promise<UserResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${id}`, {
    method: "GET",
  });

  return handleResponse<UserResponse>(response).then((data) => data);
}

export async function apiUpdateUser(
  data: Partial<SafeUser>
): Promise<UserResponse> {
  const { id, ...rest } = data;
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: rest }),
  });
  return handleResponse<UserResponse>(response).then((data) => data);
}

export async function apiDeleteUser(id: string): Promise<UserResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${id}`, {
    method: "DELETE",
  });

  return handleResponse<UserResponse>(response).then((data) => data);
}

/** FOLDERS */
export async function apiCreateFolder(
  FolderData: TPartialFolder
): Promise<FolderResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiFolders}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...FolderData }),
  });

  return handleResponse<FolderResponse>(response).then((data) => data);
}
export async function apiDeleteFolder(
  folderId: string
): Promise<FolderResponse> {
  const response = await fetch(
    `${SERVER_ENDPOINT}${pathApiFolder}/${folderId}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse<FolderResponse>(response).then((data) => data);
}
export async function apiUpdateFolder(data: {
  id: string;
  name: string;
}): Promise<FolderResponse> {
  const response = await fetch(
    `${SERVER_ENDPOINT}${pathApiFolder}/${data.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: data.name }),
    }
  );
  return handleResponse<FolderResponse>(response).then((data) => data);
}
export async function apiGetFolders(): Promise<FoldersResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiFolders}`, {
    method: "GET",
  });

  return handleResponse<FoldersResponse>(response).then((data) => data);
}

/** COURSES */
export async function apiGetCourses(): Promise<CoursesResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourses}`, {
    method: "GET",
  });

  return handleResponse<CoursesResponse>(response).then((data) => data);
}
export async function apiGetMoreRecentCourse(): Promise<CoursesResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourses}/latest`, {
    method: "GET",
  });

  return handleResponse<CoursesResponse>(response).then((data) => data);
}
export async function apiGetCourse(id: string): Promise<CoursesResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourse}/${id}`, {
    method: "GET",
  });
  return handleResponse<CoursesResponse>(response).then((data) => data);
}
export async function apiCreateCourse(
  courseData: any
): Promise<CourseResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/courses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...courseData }),
  });

  return handleResponse<CourseResponse>(response).then((data) => data);
}
export async function apiUpdateCourse(
  id: string,
  props: Partial<Course>
): Promise<CourseResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourse}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...props }),
  });
  return handleResponse<CourseResponse>(response).then((data) => data);
}
export async function apiDeleteCourse(
  courseId: string
): Promise<CoursesResponse> {
  const response = await fetch(
    `${SERVER_ENDPOINT}${pathApiCourse}/${courseId}`,
    {
      method: "DELETE",
    }
  );
  return handleResponse<CoursesResponse>(response).then((data) => data);
}

/** PAGE */
export async function apiCreatePage(pageData: string): Promise<Page> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/page/:id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: pageData,
  });

  return handleResponse<PageResponse>(response).then((data) => data.data.page);
}
export async function apiDeletePage(pageId: string): Promise<void> {
  const response = await fetch(`${SERVER_ENDPOINT}/api/page/${pageId}`, {
    method: "DELETE",
  });

  if (response.status !== 204) {
    const errorResponse: ErrorResponse = await response.json();
    if (errorResponse) {
      throw new Error(errorResponse.message);
    } else {
      throw new Error(`API error: ${response.status}`);
    }
  }
}
