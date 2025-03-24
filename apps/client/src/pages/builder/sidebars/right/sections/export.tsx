import { t } from "@lingui/macro";
import { CircleNotch, FileJs, FilePdf } from "@phosphor-icons/react";
import { buttonVariants, Card, CardContent, CardDescription, CardTitle } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { saveAs } from "file-saver";

import { usePrintResume } from "@/client/services/resume/print";
import { useResumeStore } from "@/client/stores/resume";
import { useSectionMappingStore } from "@/client/stores/section-mapping";

import { SectionIcon } from "../shared/section-icon";

const onJsonExport = () => {
  const { resume } = useResumeStore.getState();
  const { mappings } = useSectionMappingStore.getState();

  // THis is definetly not the cleanest way to do this, but I have tried with so many different ways and the simplest one is this and it works
  // Generate a new object for export without mutating the original state
  const exportData = {
    ...resume.data,
    sections: {
      ...resume.data.sections,
      awards: {
        ...resume.data.sections.awards,
        items: resume.data.sections.awards.items.filter((item: { id: string }) =>
          mappings.awards.includes(item.id),
        ),
      },
      education: {
        ...resume.data.sections.education,
        items: resume.data.sections.education.items.filter((item: { id: string }) =>
          mappings.education.includes(item.id),
        ),
      },
      experience: {
        ...resume.data.sections.experience,
        items: resume.data.sections.experience.items.filter((item: { id: string }) =>
          mappings.experience.includes(item.id),
        ),
      },
      languages: {
        ...resume.data.sections.languages,
        items: resume.data.sections.languages.items.filter((item: { id: string }) =>
          mappings.languages.includes(item.id),
        ),
      },
      profiles: {
        ...resume.data.sections.profiles,
        items: resume.data.sections.profiles.items.filter((item: { id: string }) =>
          mappings.profiles.includes(item.id),
        ),
      },
      projects: {
        ...resume.data.sections.projects,
        items: resume.data.sections.projects.items.filter((item: { id: string }) =>
          mappings.projects.includes(item.id),
        ),
      },
      publications: {
        ...resume.data.sections.publications,
        items: resume.data.sections.publications.items.filter((item: { id: string }) =>
          mappings.publications.includes(item.id),
        ),
      },
      references: {
        ...resume.data.sections.references,
        items: resume.data.sections.references.items.filter((item: { id: string }) =>
          mappings.references.includes(item.id),
        ),
      },
      skills: {
        ...resume.data.sections.skills,
        items: resume.data.sections.skills.items.filter((item: { id: string }) =>
          mappings.skills.includes(item.id),
        ),
      },
      certifications: {
        ...resume.data.sections.certifications,
        items: resume.data.sections.certifications.items.filter((item: { id: string }) =>
          mappings.certifications.includes(item.id),
        ),
      },
      interests: {
        ...resume.data.sections.interests,
        items: resume.data.sections.interests.items.filter((item: { id: string }) =>
          mappings.interests.includes(item.id),
        ),
      },
      volunteer: {
        ...resume.data.sections.volunteer,
        items: resume.data.sections.volunteer.items.filter((item: { id: string }) =>
          mappings.volunteer.includes(item.id),
        ),
      },
      summary: {
        ...resume.data.sections.summary,
        items: resume.data.sections.summary.items.filter((item: { id: string }) =>
          mappings.summary.includes(item.id),
        ),
      },
    },
  };

  const filename = `ezcv-${resume.title}.json`;
  const resumeJSON = JSON.stringify(exportData, null, 2);

  saveAs(new Blob([resumeJSON], { type: "application/json" }), filename);
};

const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const ExportSection = () => {
  const { printResume, loading } = usePrintResume();

  const onPdfExport = async () => {
    const { resume } = useResumeStore.getState();
    const { url } = await printResume({ id: resume.id });

    openInNewTab(url);
  };

  return (
    <section id="export" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SectionIcon id="export" size={18} name={t`Export`} />
          <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">{t`Export`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4">
        <Card
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-auto cursor-pointer flex-row items-center gap-x-5 px-4 pb-3 pt-1",
          )}
          onClick={onJsonExport}
        >
          <FileJs size={22} />
          <CardContent className="flex-1">
            <CardTitle className="text-sm">{t`JSON`}</CardTitle>
            <CardDescription className="font-normal">
              {t`Download a JSON snapshot of your resume. This file can be used to import your resume in the future, or can even be shared with others to collaborate.`}
            </CardDescription>
          </CardContent>
        </Card>

        <Card
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "h-auto cursor-pointer flex-row items-center gap-x-5 px-4 pb-3 pt-1",
            loading && "pointer-events-none cursor-progress opacity-75",
          )}
          onClick={onPdfExport}
        >
          {loading ? <CircleNotch size={22} className="animate-spin" /> : <FilePdf size={22} />}

          <CardContent className="flex-1">
            <CardTitle className="text-sm">{t`PDF`}</CardTitle>
            <CardDescription className="font-normal">
              {t`Download a PDF of your resume. This file can be used to print your resume, send it to recruiters, or upload on job portals.`}
            </CardDescription>
          </CardContent>
        </Card>
      </main>
    </section>
  );
};
