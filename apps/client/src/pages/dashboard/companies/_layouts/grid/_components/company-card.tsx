import { t } from "@lingui/macro";
import { FolderOpen, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import type { CompanyDto } from "@reactive-resume/dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import dayjs from "dayjs";
import { useNavigate } from "react-router";

import { BaseCard } from "@/client/pages/dashboard/resumes/_layouts/grid/_components/base-card";
import { useDialog } from "@/client/stores/dialog";

type Props = {
  company: CompanyDto;
};

export const CompanyCard = ({ company }: Props) => {
  const navigate = useNavigate();
  const { open } = useDialog<CompanyDto>("company");

  const lastUpdated = dayjs().to(company.updatedAt);

  const onOpen = () => {
    void navigate(`/dashboard/company/${company.id}`);
  };

  const onUpdate = () => {
    open("update", { id: "company", item: company });
  };

  const onDelete = () => {
    open("delete", { id: "company", item: company });
  };

  return (
    <div
      style={{ willChange: "transform", display: "flex", flexDirection: "column" }}
      onDoubleClick={onOpen}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="pointer-events-none text-left">
          <BaseCard className="pointer-events-auto cursor-context-menu space-y-0">
            <div>
              <div
                className={cn(
                  "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
                  "bg-gradient-to-t from-background/80 to-transparent",
                )}
              >
                <h4 className="line-clamp-2 font-medium">{company.name}</h4>
                <p className="line-clamp-1 text-xs opacity-75">{t`Last updated ${lastUpdated}`}</p>
              </div>
            </div>
            <img src={company.picture ?? undefined} alt={""} className="rounded-sm opacity-80" />
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
