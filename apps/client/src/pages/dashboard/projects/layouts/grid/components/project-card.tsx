/* eslint-disable lingui/no-unlocalized-strings */
// eslint-disable-next-line @nx/enforce-module-boundaries
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { t } from "@lingui/macro";
import { CopySimple, FolderOpen, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import type { ProjectDto } from "@reactive-resume/dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import dayjs from "dayjs";

import { BaseCard } from "@/client/pages/dashboard/resumes/_layouts/grid/_components/base-card";
import { useDialog } from "@/client/stores/dialog";

type Props = {
  project: ProjectDto;
  onOpenProject: (projectId: string) => void;
};

export const ProjectCard = ({ project, onOpenProject }: Props) => {
  const { open } = useDialog<ProjectDto>("project");

  const lastUpdated = dayjs().to(project.updatedAt);

  const onOpen = () => {
    onOpenProject(project.id);
  };

  const onUpdate = () => {
    open("update", { id: "resume", item: project });
  };

  const onDuplicate = () => {
    open("duplicate", { id: "resume", item: project });
  };

  const onDelete = () => {
    open("delete", { id: "resume", item: project });
  };

  return (
    <div
      style={{ willChange: "transform", display: "flex", flexDirection: "column" }}
      onDoubleClick={onOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="pointer-events-none text-left">
          <BaseCard className="pointer-events-auto cursor-context-menu space-y-0">
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
                "bg-gradient-to-t from-background/80 to-transparent",
              )}
            >
              <h4 className="line-clamp-2 font-medium">{project.name}</h4>
              <p className="line-clamp-1 text-xs opacity-75">{t`Last updated ${lastUpdated}`}</p>
            </div>
          </BaseCard>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="pointer-events-auto">
          <DropdownMenuItem onClick={onOpen}>
            <FolderOpen size={14} className="mr-2" />
            {t`Open`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate}>
            <PencilSimple size={14} className="mr-2" />
            {t`Rename`}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <CopySimple size={14} className="mr-2" />
            {t`Duplicate`}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-error" onClick={onDelete}>
            <TrashSimple size={14} className="mr-2" />
            {t`Delete`}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
