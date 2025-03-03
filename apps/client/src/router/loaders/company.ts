import type { CompanyDto } from "@reactive-resume/dto";
import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "@/client/libs/query-client";
import { fetchCompany } from "@/client/services/company";

export const companyLoader: LoaderFunction<CompanyDto> = async ({ params }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id: string = params.id!;

    return await queryClient.fetchQuery({
      queryKey: ["company", { id }],
      queryFn: () => fetchCompany(id),
    });
  } catch {
    return redirect("/dashboard/companies");
  }
};
