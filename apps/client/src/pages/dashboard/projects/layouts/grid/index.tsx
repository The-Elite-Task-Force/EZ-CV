import type { ProjectDto } from "@reactive-resume/dto";
import { sortByDate } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";

import { BaseCard } from "../../../resumes/_layouts/grid/_components/base-card";
import { CreateProjectCard } from "./components/create-card";
import { ProjectCard } from "./components/project-card";

type ProjectGridViewProps = {
  projects: ProjectDto[] | undefined;
  loading: boolean;
  onOpenProject: (projectId: string) => void;
};

export const ProjectsGridView = ({ projects, loading, onOpenProject }: ProjectGridViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
        <CreateProjectCard />
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
      {projects && (
        <AnimatePresence>
          {projects
            .sort((a, b) => sortByDate(a, b, "updatedAt"))
            .map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0, transition: { delay: (index + 2) * 0.1 } }}
                exit={{ opacity: 0, filter: "blur(8px)", transition: { duration: 0.5 } }}
              >
                <ProjectCard project={project} onOpenProject={onOpenProject} />
              </motion.div>
            ))}
        </AnimatePresence>
      )}
    </div>
  );
};
