/* eslint-disable lingui/no-unlocalized-strings */
import type { ProjectDto } from "@reactive-resume/dto";

type ProjectCardProps = {
  project: ProjectDto;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <li className="flex items-center space-x-4">
      <div className="flex w-full items-center rounded-lg border border-gray-700 bg-white p-4 shadow-md dark:bg-[#09090b]">
        <div className="flex-1">
          <div className="text-lg font-medium text-gray-900 dark:text-gray-100">{project.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{project.description}</div>
        </div>
      </div>
    </li>
  );
};

export default ProjectCard;
