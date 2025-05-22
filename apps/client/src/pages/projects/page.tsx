/* eslint-disable lingui/no-unlocalized-strings */
// ProjectPage.tsx
import { useNavigate, useOutletContext } from "react-router";

import type { ProjectPageContext } from "./types/project";
import { UserCardList } from "./user-card-list";

export const ProjectPage = () => {
  const { members, membersLoading, membersError, handleRemoveUser, handleResumeDropdown, project } =
    useOutletContext<ProjectPageContext>();

  const navigate = useNavigate();

  const handleManageClick = () => {
    void navigate(`manage`);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between p-12">
        <h2 className="text-4xl font-bold">{project.name}</h2>
        {/* This is just placeholder stuff, to give an idea of the layout */}
        <p className="max-h-[160px] min-h-[160px] min-w-[300px] max-w-[300px] bg-primary/20 p-4 text-lg">
          {project.description ?? "Add description.."}
        </p>
      </div>
      <div className="mb-8 flex justify-between p-4">
        <h2 className="mb-4 text-3xl font-bold">Resume Portfolio</h2>
        <button
          className="rounded-lg bg-primary/20 px-6 py-3 text-base font-medium"
          onClick={handleManageClick}
        >
          Manage Project
        </button>
      </div>
      <div className="overflow-auto rounded-2xl bg-secondary/70 p-6 shadow-md">
        <UserCardList
          users={members}
          usersError={membersError}
          usersLoading={membersLoading}
          handleRemoveUser={handleRemoveUser}
          data={Boolean(members)}
          handleResumeDropdown={handleResumeDropdown}
          resumeDropdown={true}
        />
      </div>
    </div>
  );
};
