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
      <Trans>
        A project made by{" "}
        <strong>
          <u>The Elite Task Force</u>
        </strong>
      </Trans>
    </span>
    <span className="text-xs">
      <Trans>Based on a project by Amruth Pillai</Trans>
    </span>

    <span className="mt-4">
      {t`EzCV`} {"v" + appVersion}
    </span>
  </div>
);
