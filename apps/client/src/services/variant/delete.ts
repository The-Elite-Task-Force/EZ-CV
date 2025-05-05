import type { DeleteDto, ResumeDto, VariantDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const deleteVariant = async (data: DeleteDto) => {
  const response = await axios.delete<DeleteDto, AxiosResponse<DeleteDto>, DeleteDto>(
    `/variant/${data.id}`,
  );

  return response.data;
};
export const useDeleteVariant = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: deleteVariantFn,
  } = useMutation({
    mutationFn: deleteVariant,
    onSuccess: (data) => {
      queryClient.removeQueries({ queryKey: ["resumes", data.id] });

      queryClient.setQueryData<VariantDto[]>(["resumes"], (cache) => {
        if (!cache) return [];
        return cache.filter((variant) => variant.id !== data.id);
      });
    },
  });

  return { deleteVariant: deleteVariantFn, loading, error };
};
