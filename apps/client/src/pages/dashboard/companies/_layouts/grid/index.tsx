import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useMemo } from "react";

import { CompanyCard } from "@/client/pages/dashboard/companies/_layouts/grid/_components/company-card";
import { CreateCompanyCard } from "@/client/pages/dashboard/companies/_layouts/grid/_components/create-card";
import { BaseCard } from "@/client/pages/dashboard/resumes/_layouts/grid/_components/base-card";
import { useCompanies } from "@/client/services/company/company";

export const CompanyGridView = () => {
  const { companies, loading } = useCompanies();
  const isLoading = loading;

  // If needed, you can sort companies by updatedAt using sortByDate
  const sortedCompanies = useMemo(() => {
    if (!companies) return [];
    return [...companies].sort((a, b) => sortByDate(a, b, "updatedAt"));
  }, [companies]);

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateCompanyCard />
      </motion.div>

      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{
              animationFillMode: "backwards",
              animationDelay: `${i * 300}ms`,
            }}
          >
            <BaseCard />
          </div>
        ))}

      <AnimatePresence>
        {sortedCompanies.map((company, index) => (
          <motion.div
            key={company.id}
            layout
            initial={{ opacity: 0, x: -50 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: (index + 2) * 0.1 },
            }}
            exit={{
              opacity: 0,
              filter: "blur(8px)",
              transition: { duration: 0.5 },
            }}
          >
            <CompanyCard company={company} role={company.role ? company.role.name : undefined} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
