import type { ImportSectionsSchema } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";

export const importSections = async (data: ImportSectionsSchema) => {
  const response = await axios.post<
    ImportSectionsSchema,
    AxiosResponse<ImportSectionsSchema>,
    ImportSectionsSchema
  >("/sectionItem/import", data);

  return response.data;
};

// IMPORTANT - WHEN IMPORTING, IT NEEDS TO CALL THE SECTION IMPORT FUNCTION THAT DOES A SECTION.SERVER.CREATE FOR EACH THING. Check types, the rigth endpoints are called and consider what happens after.
// GOOD LUCK!

export const useImportSections = () => {
  console.log("Hej");

  const {
    error,
    isPending: loading,
    mutateAsync: importSectionsFn,
  } = useMutation({
    mutationFn: importSections,
    onSuccess: (data) => {
      // queryClient.setQueryData<ImportSectionsSchema>(["sections", { id: data.id }], data);
      queryClient.setQueryData<ImportSectionsSchema>(["sections"], data);

      queryClient.setQueryData<ImportSectionsSchema[]>(["sections"], (cache) => {
        if (!cache) return [data];
        return [...cache, data];
      });
    },
  });

  return { importSections: importSectionsFn, loading, error };
};
