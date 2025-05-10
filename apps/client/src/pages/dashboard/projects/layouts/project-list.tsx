/* eslint-disable lingui/no-unlocalized-strings */
import type { ProjectDto } from "@reactive-resume/dto";

import ProjectCard from "./list/components/project-card";

type ProjectListProps = {
  projects: ProjectDto[];
};

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</h2>
      <ul className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
