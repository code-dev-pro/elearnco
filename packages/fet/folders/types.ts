import { CompleteFolder } from "schemas/zod";
import { ErrorResponse } from "schemas/api";

export type TOnFetch = (result: CompleteFolder[]) => void;
export type TOnError = (error: ErrorResponse | undefined) => void;