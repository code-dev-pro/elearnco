import { ErrorResponse } from "schemas/api";
import { CompleteCourse } from "schemas/zod/course";

export type TOnFetch = (result: CompleteCourse[]) => void;
export type TOnError = (error: ErrorResponse | undefined) => void;