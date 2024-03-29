import { usePathname } from "next/navigation";

export function useIsCollaboration(path: string): boolean {
  const pathname = usePathname();
  const isCollaboration = pathname?.startsWith(`/${path}`)|| pathname?.includes(`${path}`);

  return isCollaboration;
}
