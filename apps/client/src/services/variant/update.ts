import type { UpdateVariantDto, VariantDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import debounce from "lodash.debounce";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const updateVariant = async (data: UpdateVariantDto) => {
  const response = await axios.patch<VariantDto, AxiosResponse<VariantDto>, UpdateVariantDto>(
    `/variant/${data.id}`,
    data,
  );

  queryClient.setQueryData<VariantDto>(["resumes", { id: response.data.id }], response.data);

  queryClient.setQueryData<VariantDto[]>(["resumes"], (cache) => {
    if (!cache) return [response.data];
    return cache.map((resume) => {
      if (resume.id === response.data.id) return response.data;
      return resume;
    });
  });

  return response.data;
};

export const debouncedUpdateResume = debounce(updateVariant, 500);

export const useUpdateVariant = () => {
  const {
    error,
    isPending: loading,
    mutateAsync: updateVarantFn,
  } = useMutation({
    mutationFn: updateVariant,
  });

  return { updateVariant: updateVarantFn, loading, error };
};
