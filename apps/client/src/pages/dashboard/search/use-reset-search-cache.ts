import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export const useResetSearchCache = () => {
  const queryClient = useQueryClient();
  const hasClearedCache = useRef(false);

  if (!hasClearedCache.current) {
    queryClient.removeQueries({ queryKey: ["search"] });
    hasClearedCache.current = true;
  }
};
