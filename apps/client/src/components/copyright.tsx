/* eslint-disable lingui/no-unlocalized-strings */
import { t, Trans } from "@lingui/macro";
import { cn } from "@reactive-resume/utils";

type Props = {
  className?: string;
};

export const Copyright = ({ className }: Props) => (
  <div
    className={cn(
      "prose prose-sm prose-zinc flex max-w-none flex-col gap-y-1 text-xs opacity-40 dark:prose-invert",
      className,
    )}
  >
    <span>
      <Trans>
        Licensed under{" "}
        <a
          target="_blank"
          rel="noopener noreferrer nofollow"
          href="https://github.com/AmruthPillai/Reactive-Resume/blob/main/LICENSE.md"
        >
          MIT
        </a>
      </Trans>
    </span>
    <span>
      A project made by{" "}
      <strong>
        <u>The Elite Task Force</u>
      </strong>
    </span>
    <span className="text-xs">Based on a project by Amruth Pillai</span>

    <span className="mt-4">EzCV {appVersion}</span>
  </div>
);
