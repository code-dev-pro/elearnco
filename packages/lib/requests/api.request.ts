import { Block, Page } from "@prisma/client";
import {
  CompleteBlock,
  CompleteCourse,
  CompleteFolder,
  CompletePage,
} from "schemas";
import { ErrorResponse, FetchResponse } from "schemas/api";
import { SafeUser } from "schemas/auth/Auth";
const segment = "api";
const pathApiFolders = `/${segment}/folders`;
const pathApiFolder = `/${segment}/folder`;
const pathApiCourses = `/${segment}/courses`;
const pathApiCourse = `/${segment}/course`;
const pathApiBlockNode = `/${segment}/blockNode`;
const pathApiBlock = `/${segment}/block`;
const pathApiPage = `/${segment}/page`;
const pathApiUser = `/${segment}/user`;
const pathApiUserTags = `/${segment}/user/tags`;
const pathApiComments = `/${segment}/comments`;
const pathApiDrawing = `/${segment}/drawing`;
export const getBaseUrl = (): string => {
  if (typeof window !== "undefined") return location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
const SERVER_ENDPOINT = getBaseUrl();
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
function handleFailResponse(response: Response): ErrorResponse {
  return {
    status: "error",
    data: { message: "fail" },
  };
}

/**
 * *******************
 * USER
 * *******************
 */
export async function authPreregister(data: {
  email: string;
}): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/preregister`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authSignup(
  data: Partial<SafeUser>
): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });
  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authValidate(data: unknown): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/validate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data }),
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authForgetPassword(data: {
  email: string;
}): Promise<FetchResponse> {
  const response = await fetch(
    `${SERVER_ENDPOINT}${pathApiUser}/forgot-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }
  );

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authResetPassword(data: {
  password: string;
  token: string;
}): Promise<FetchResponse> {
  const response = await fetch(
    `${SERVER_ENDPOINT}${pathApiUser}/reset-password/${data.token}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data }),
    }
  );

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authGetUser(id: string): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${id}`, {
    method: "GET",
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authUpdateUser(
  data: Partial<SafeUser>
): Promise<FetchResponse> {
  const { id, ...rest } = data;
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${data.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: rest }),
  });
  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function authDeleteUser(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUser}/${id}`, {
    method: "DELETE",
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}

/**
 * *******************
 * FOLDERS
 * *******************
 */
export async function addFolder(
  FolderData: Partial<CompleteFolder>
): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiFolders}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...FolderData }),
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function deleteFolder(id: string): Promise<FetchResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiFolder}/${id}`, {
    method: "DELETE",
  });
  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function updateFolder(data: {
  id: string;
  name: string;
}): Promise<FetchResponse> {
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
  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function getFolders(): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiFolders}`, {
    method: "GET",
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
/**
 * *******************
 * TAGS
 * *******************
 */

export async function getTags(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiUserTags}/${id}`, {
    method: "GET",
  });

  return handleResponse<FetchResponse>(response).then((data) => data);
}
/**
 * *******************
 * COURSES
 * *******************
 */
export async function getCourses(query: string): Promise<
  | {
      status: string;
      data: [CompleteCourse[], number];
    }
  | ErrorResponse
> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourses}/${query}`, {
    method: "GET",
  });

  if (response.status === 201) {
    return handleResponse<
      | {
          status: string;
          data: [CompleteCourse[], number];
        }
      | ErrorResponse
    >(response).then((data) => data);
  } else {
    return handleFailResponse(response);
  }
}
export async function getCourseMoreRecent(): Promise<
  FetchResponse | ErrorResponse
> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourses}/latest`, {
    method: "GET",
  });
  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function getCourse(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourse}/${id}`, {
    method: "GET",
  });
  return handleResponse<FetchResponse>(response).then((data) => data);
}
export async function addCourse(
  courseData: Partial<CompleteCourse>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourses}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...courseData }),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function updateCourse(
  id: string,
  props: Partial<CompleteCourse>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourse}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...props }),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteCourse(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiCourse}/${id}`, {
    method: "DELETE",
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

/**
 * **************************************
 * PAGE
 * **************************************
 */

export async function getPage(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiPage}/${id}`, {
    method: "GET",
  });
  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function addPage(
  pageData: Partial<Page>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiPage}/:id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageData),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

export async function reorderPage(
  pageData: CompletePage[]
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiPage}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageData),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

export async function deletePage(
  courseID: string,
  id: string,
  index: number
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiPage}/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ courseID: courseID, index: index }),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function updatePage(
  id: string,
  props: Partial<Page>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiPage}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...props }),
  });
  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

/**
 * **************************************
 * BLOCK
 * **************************************
 */
export async function addBlock(
  blockData: Partial<Block>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlock}/:id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(blockData),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

export async function updateBlockNode(
  blockData: Partial<Block>
): Promise<FetchResponse | ErrorResponse> {
  if (blockData?.id) {
    const { id, ...rest } = blockData;
    if (id) {
      const response = await fetch(
        `${SERVER_ENDPOINT}${pathApiBlockNode}/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(rest),
        }
      );

      if (response.status === 201) {
        return handleResponse<FetchResponse | ErrorResponse>(response).then(
          (data) => data
        );
      } else {
        return handleFailResponse(response);
      }
    } else {
      return { status: "success", data: { message: "" } };
    }
  } else {
    return { status: "success", data: { message: "" } };
  }
}
export async function updateManyBlock({
  modifiedBlocks,
  deletedBlockIds,
}: {
  modifiedBlocks: Partial<CompleteBlock>[];
  deletedBlockIds: string[];
}): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlock}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      modifiedBlocks,
      deletedBlockIds,
    }),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteBlock(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlock}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

/**
 * **************************************
 * NODE
 * **************************************
 */
export async function getBlockNode(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlockNode}/${id}`, {
    method: "GET",
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function addBlockNode(
  data: Partial<Block>
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlockNode}/:id`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteBlockNode(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlockNode}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}

/**
 * **************************************
 * DRAWING
 * **************************************
 */

export async function saveDrawing(
  id: string | undefined,
  blockNodeId: string,
  data: any
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiDrawing}/${id}`, {
    method: "POST",
    body: JSON.stringify({ content: data, blockNodeId: blockNodeId }),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteDrawing(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiDrawing}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
/**
 * **************************************
 * COMMENTS
 * **************************************
 */
export async function getComments(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiComments}/${id}`, {
    method: "GET",
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function addComment(data: {
  content: string;
  blockNode: { connect: { uuid: string } };
  user: { connect: { id: string } };
}): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiComments}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteComment(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiBlockNode}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function deleteThread(
  id: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiComments}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
export async function updateComment(
  id: string,
  content: string
): Promise<FetchResponse | ErrorResponse> {
  const response = await fetch(`${SERVER_ENDPOINT}${pathApiComments}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(content),
  });

  if (response.status === 201) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
// AI
export async function apiGPT(
  prompt: string
): Promise<FetchResponse | ErrorResponse> {
  if (prompt === "") {
    return {
      status: "failed",
      data: { message: "no prompt" },
    };
  }

  const response = await fetch(`http://localhost:1337/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      messages: [
        {
          content:
            "Tu es un assistant en français et tu dois formuler de manière précise et concise chaque réponse en français sans phrase d'introduction.",
          role: "system",
        },
        {
          content: prompt,
          role: "user",
        },
      ],
      model: "mistral-ins-7b-q4",
      stream: true,
      max_tokens: 2048,
      stop: [],
      frequency_penalty: 0,
      presence_penalty: 0,
      temperature: 0.7,
      top_p: 0.95,
    }),
  });

  if (response.status === 200) {
    return handleResponse<FetchResponse | ErrorResponse>(response).then(
      (data) => data
    );
  } else {
    return handleFailResponse(response);
  }
}
