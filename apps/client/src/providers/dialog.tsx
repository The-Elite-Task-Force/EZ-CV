import { CompanyDialog } from "@/client/pages/dashboard/companies/_dialogs/company";

import { AwardsDialog } from "../pages/builder/sidebars/left/dialogs/awards";
import { BasicDialog } from "../pages/builder/sidebars/left/dialogs/basic";
import { CertificationsDialog } from "../pages/builder/sidebars/left/dialogs/certifications";
import { CustomSectionDialog } from "../pages/builder/sidebars/left/dialogs/custom-section";
import { EducationDialog } from "../pages/builder/sidebars/left/dialogs/education";
import { ExperienceDialog } from "../pages/builder/sidebars/left/dialogs/experience";
import { InterestsDialog } from "../pages/builder/sidebars/left/dialogs/interests";
import { LanguagesDialog } from "../pages/builder/sidebars/left/dialogs/languages";
import { ProfilesDialog } from "../pages/builder/sidebars/left/dialogs/profiles";
import { ProjectsDialog } from "../pages/builder/sidebars/left/dialogs/projects";
import { PublicationsDialog } from "../pages/builder/sidebars/left/dialogs/publications";
import { ReferencesDialog } from "../pages/builder/sidebars/left/dialogs/references";
import { SkillsDialog } from "../pages/builder/sidebars/left/dialogs/skills";
import { SummaryDialog } from "../pages/builder/sidebars/left/dialogs/summary";
import { VolunteerDialog } from "../pages/builder/sidebars/left/dialogs/volunteer";
import { ProjectDialog } from "../pages/dashboard/projects/dialogs/project";
import { ImportDialog } from "../pages/dashboard/resumes/_dialogs/import";
import { LockDialog } from "../pages/dashboard/resumes/_dialogs/lock";
import { ResumeDialog } from "../pages/dashboard/resumes/_dialogs/resume";
import { TwoFactorDialog } from "../pages/dashboard/settings/_dialogs/two-factor";
import { VariantAwardsDialog } from "../pages/variant-builder/sidebars/left/dialogs/awards";
//import { VariantBasicDialog } from "../pages/variant-builder/sidebars/left/dialogs/basic";
import { VariantCertificationsDialog } from "../pages/variant-builder/sidebars/left/dialogs/certifications";
import { VariantEducationDialog } from "../pages/variant-builder/sidebars/left/dialogs/education";
import { VariantExperienceDialog } from "../pages/variant-builder/sidebars/left/dialogs/experience";
import { VariantInterestsDialog } from "../pages/variant-builder/sidebars/left/dialogs/interests";
import { VariantLanguagesDialog } from "../pages/variant-builder/sidebars/left/dialogs/languages";
import { VariantProfilesDialog } from "../pages/variant-builder/sidebars/left/dialogs/profiles";
import { VariantProjectsDialog } from "../pages/variant-builder/sidebars/left/dialogs/projects";
import { VariantPublicationsDialog } from "../pages/variant-builder/sidebars/left/dialogs/publications";
import { VariantReferencesDialog } from "../pages/variant-builder/sidebars/left/dialogs/references";
import { VariantSkillsDialog } from "../pages/variant-builder/sidebars/left/dialogs/skills";
//import { VariantSummaryDialog } from "../pages/variant-builder/sidebars/left/dialogs/summary";
import { VariantVolunteerDialog } from "../pages/variant-builder/sidebars/left/dialogs/volunteer";
import { useResumeStore } from "../stores/resume";
type Props = {
  children: React.ReactNode;
};

export const DialogProvider = ({ children }: Props) => {
  const isResumeLoaded = useResumeStore((state) => Object.keys(state.resume).length > 0);

  return (
    <>
      {children}

      <div id="dialog-root">
        <ResumeDialog />
        <CompanyDialog />
        <LockDialog />
        <ImportDialog />
        <TwoFactorDialog />
        <ProjectDialog />

        {isResumeLoaded && (
          <>
            <BasicDialog />
            <SummaryDialog />
            <ProfilesDialog />
            <ExperienceDialog />
            <EducationDialog />
            <AwardsDialog />
            <CertificationsDialog />
            <InterestsDialog />
            <LanguagesDialog />
            <ProjectsDialog />
            <PublicationsDialog />
            <VolunteerDialog />
            <SkillsDialog />
            <ReferencesDialog />
            <CustomSectionDialog />

            <VariantAwardsDialog />
            {/* <VariantBasicDialog /> */}
            <VariantCertificationsDialog />
            <VariantEducationDialog />
            <VariantExperienceDialog />
            <VariantInterestsDialog />
            <VariantLanguagesDialog />
            <VariantProfilesDialog />
            <VariantProjectsDialog />
            <VariantPublicationsDialog />
            <VariantVolunteerDialog />
            <VariantSkillsDialog />
            {/* <VariantSummaryDialog /> */}
            <VariantReferencesDialog />
          </>
        )}
      </div>
    </>
  );
};
