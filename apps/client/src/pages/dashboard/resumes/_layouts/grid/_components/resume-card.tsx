/* eslint-disable lingui/no-unlocalized-strings */
// eslint-disable-next-line @nx/enforce-module-boundaries
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { t } from "@lingui/macro";
import { Translate } from "@phosphor-icons/react";
import {
  CopySimple,
  FolderOpen,
  Lock,
  LockOpen,
  PencilSimple,
  TrashSimple,
} from "@phosphor-icons/react";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import type { ResumeDto } from "@reactive-resume/dto";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@reactive-resume/ui";
import type { LANGUAGE } from "@reactive-resume/utils";
import { cn } from "@reactive-resume/utils";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { LocaleComboboxPopover } from "@/client/components/locale-combobox";
import { setDefault } from "@/client/services/resume";
import { updateResume } from "@/client/services/resume";
import { useAuthStore } from "@/client/stores/auth";
import { useDialog } from "@/client/stores/dialog";

import { BaseCard } from "./base-card";

type Props = {
  resume: ResumeDto;
};

export const ResumeCard = ({ resume }: Props) => {
  const navigate = useNavigate();
  const { open } = useDialog<ResumeDto>("resume");
  const { open: lockOpen } = useDialog<ResumeDto>("lock");
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [resumeLanguage, setResumeLanguage] = useState<LANGUAGE>(resume.language);

  useEffect(() => {
    const update = async () => {
      // eslint-disable-next-line @typescript-eslint/no-misused-spread
      await updateResume({ ...resume, language: resumeLanguage });
    };

    void update();
  }, [resumeLanguage]);

  const template = resume.data.metadata.template;
  const lastUpdated = dayjs().to(resume.updatedAt);

  const onOpen = () => {
    void navigate(`/builder/${resume.id}`);
  };

  const onUpdate = () => {
    open("update", { id: "resume", item: resume });
  };

  const onSetDefault = async (setDefaultProfile: boolean) => {
    if (!user) return;
    await (setDefaultProfile
      ? setDefault({ resumeId: resume.id, userId: user.id, setDefaultProfile: true })
      : setDefault({ resumeId: resume.id, userId: user.id, setDefaultProfile: false }));
    await queryClient.invalidateQueries({ queryKey: ["user"] });
  };

  const onDuplicate = () => {
    open("duplicate", { id: "resume", item: resume });
  };

  const onTranslate = (locale: LANGUAGE) => {
    open("translate", { id: "resume", item: resume });
  };

  const onLockChange = () => {
    lockOpen(resume.locked ? "update" : "create", { id: "lock", item: resume });
  };

  const onDelete = () => {
    open("delete", { id: "resume", item: resume });
  };

  return (
    <div className="relative" onDoubleClick={onOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger className="pointer-events-none text-left">
          <BaseCard className="pointer-events-auto cursor-context-menu space-y-0">
            <AnimatePresence>
              {resume.locked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-background/75 backdrop-blur-sm"
                >
                  <Lock size={42} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className={cn("absolute right-2 top-2 z-10")}>
              {/* eslint-disable-next-line tailwindcss/no-custom-classname */}
              <span
                // eslint-disable-next-line tailwindcss/no-custom-classname
                className={cn("fi", `fi-${resume.language.slice(-2).toLowerCase()}`, "text-xl")}
              ></span>
            </div>
            <div
              className={cn(
                "absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end space-y-0.5 p-4 pt-12",
                "bg-gradient-to-t from-background/80 to-transparent",
              )}
            >
              {resume.id === user?.profileResumeId && (
                <div className="absolute right-1 top-12 rounded border border-gray-700 bg-black px-2 py-1 text-xs font-bold text-white shadow-md">
                  ★ Profile
                </div>
              )}

              <h4 className="line-clamp-2 font-medium">{resume.title}</h4>
              <p className="line-clamp-1 text-xs opacity-75">{t`Last updated ${lastUpdated}`}</p>
            </div>

            <img
              src={`/templates/jpg/${template}.jpg`}
              alt={template}
              className="rounded-sm opacity-80"
            />
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
          {resume.id === user?.profileResumeId ? (
            <DropdownMenuItem onClick={() => onSetDefault(false)}>
              <FolderOpen size={14} className="mr-2" />
              Remove as profile
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onSetDefault(true)}>
              <FolderOpen size={14} className="mr-2" />
              Set as profile
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              onTranslate(resumeLanguage);
            }}
          >
            <Translate size={14} className="mr-2" />
            {t`Translate`}
          </DropdownMenuItem>
          {resume.locked ? (
            <DropdownMenuItem onClick={onLockChange}>
              <LockOpen size={14} className="mr-2" />
              {t`Unlock`}
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={onLockChange}>
              <Lock size={14} className="mr-2" />
              {t`Lock`}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm hover:bg-[#27272a]">
              <Translate size={14} className="mr-2" />
              Set language
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-56 p-2">
              <LocaleComboboxPopover
                value={resumeLanguage}
                onValueChange={(locale) => {
                  setResumeLanguage(locale);
                }}
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>

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
