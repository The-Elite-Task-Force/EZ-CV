import type { ResumeDto } from "@reactive-resume/dto";
import type { VariantDto } from "@reactive-resume/dto";
import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { BaseCard } from "./_components/base-card";
import { CreateResumeCard } from "./_components/create-card";
import { ImportResumeCard } from "./_components/import-card";
import { ResumeCard } from "./_components/resume-card";
import { VariantCard } from "./_components/variant-card";

function isVariantDto(item: ResumeDto | VariantDto): item is VariantDto {
  return "creatorId" in item && "resumeId" in item;
}

type ResumeGridViewProps = {
  resumes: (ResumeDto | VariantDto)[] | undefined;
  loading: boolean;
};

export const ResumeGridView = ({ resumes, loading }: ResumeGridViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-7">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateResumeCard />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
      >
        <ImportResumeCard />
      </motion.div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="duration-300 animate-in fade-in"
            style={{ animationFillMode: "backwards", animationDelay: `${i * 300}ms` }}
          >
            <BaseCard />
          </div>
        ))}

      {resumes && (
        <AnimatePresence>
          {resumes
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((resume, index) => (
              <motion.div
                key={resume.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                {isVariantDto(resume) ? (
                  <VariantCard key={resume.id} variant={resume} />
                ) : (
                  <ResumeCard key={resume.id} resume={resume} />
                )}
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
