import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import type { ProjectDto } from "@reactive-resume/dto";
import { KeyboardShortcut } from "@reactive-resume/ui";

import { BaseListItem } from "@/client/pages/dashboard/resumes/_layouts/list/_components/base-item";
import { useDialog } from "@/client/stores/dialog";

export const CreateProjectListItem = () => {
  const { open } = useDialog<ProjectDto>("project");

  return (
    <BaseListItem
      start={<Plus size={18} />}
      title={
        <>
          <span>{"Create a new project"}</span>
          {/* eslint-disable-next-line lingui/no-unlocalized-strings */}
          <KeyboardShortcut className="ml-2">^N</KeyboardShortcut>
        </>
      }
      description={t`Start building from scratch`}
      onClick={() => {
        open("create");
      }}
    />
  );
};
