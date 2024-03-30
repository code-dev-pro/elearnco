import { useSearchParams } from "next/navigation";

export function useIsCompletion(path: string): boolean {
    const searchParams = useSearchParams();
  const isCompletion = searchParams.get("page") === path;

  return isCompletion;
}
