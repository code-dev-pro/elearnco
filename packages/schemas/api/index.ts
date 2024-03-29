import { SafeUser } from "../auth/Auth";
import { CompleteCourse, CompleteFolder } from "../zod";

type TData = Partial<SafeUser> | CompleteFolder[] | CompleteCourse[] | CompleteCourse| unknown;
export type TStatus = "success" | "failed" | "error";
export type ErrorResponse = {
  status: TStatus;
  data: { message: string };
};
export type FetchResponse = {
  status: TStatus;
  data: TData;
};

export type TPartialFolder = Omit<
  CompleteFolder,
  "id" | "updatedAt" | "createdAt"
>;
