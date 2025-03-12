import { t } from "@lingui/macro";
import type { ResumeDto, SectionMappingDto } from "@reactive-resume/dto";
import type { Sections } from "@reactive-resume/schema";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "@/client/libs/query-client";
import { findResumeById } from "@/client/services/resume";
import { useSections } from "@/client/services/section/sections";
import { useSectionMappings } from "@/client/services/section-mapping";
import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore } from "@/client/stores/resume";
import { useSectionMappingStore } from "@/client/stores/section-mapping";

export const mapSections = (sections: Sections, mapping: SectionMappingDto) => {
  const result = JSON.parse(JSON.stringify(sections));

  for (const [key, section] of Object.entries(sections)) {
    if (key === "custom" && typeof section === "object") {
      result.custom = Object.fromEntries(
        Object.entries(section).map(([customKey, customSection]) => [
          customKey,
          {
            ...customSection,
            items: Array.isArray(customSection.items)
              ? customSection.items.filter((s: { id: string }) => mapping.custom.includes(s.id))
              : [],
          },
        ]),
      );
    } else if (Array.isArray(section.items)) {
      result[key].items = section.items.filter((s: { id: string }) =>
        mapping[key as keyof SectionMappingDto].includes(s.id),
      );
    }
  }

  return result;
};

export const BuilderPage = () => {
  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);

  const resume = useResumeStore((state) => state.resume);
  const title = useResumeStore((state) => state.resume.title);
  const mappings = useSectionMappingStore((state) => state.mappings);
  const setMappings = useSectionMappingStore((state) => state.setMappings);

  useSectionMappings(resume.id);
  useSections();

  const defaultBasics = {
    id: "",
    userId: "",
    updatedAt: "",
    name: "",
    headline: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    url: {
      label: "",
      href: "",
    },
    customFields: [],
    birthdate: "",
    picture: {
      url: "",
      size: 64,
      aspectRatio: 1,
      borderRadius: 0,
      effects: {
        hidden: false,
        border: false,
        grayscale: false,
      },
    },
  };

  const syncResumeToArtboard = useCallback(() => {
    const latestMappings = useSectionMappingStore.getState().mappings;
    if (Object.values(latestMappings).length === 0) {
      return;
    }
    //It seems useCallback stores the state value of resume when its created and doesnt update it when the value changes, so we get the latest value of resume here
    const latestResume = useResumeStore.getState().resume;

    setImmediate(() => {
      if (!frameRef?.contentWindow) return;
      const message = {
        type: "SET_RESUME",
        payload: {
          basics:
            latestResume.data.sections.basics.items.length > 0
              ? latestResume.data.sections.basics.items[0]
              : defaultBasics,
          sections: mapSections(latestResume.data.sections, latestMappings),
          metadata: latestResume.data.metadata,
        },
      };
      frameRef.contentWindow.postMessage(message, "*");
    });
  }, [frameRef?.contentWindow, resume.data, mappings, setMappings]);

  // Send resume data to iframe on initial load
  useEffect(() => {
    if (!frameRef) return;

    frameRef.addEventListener("load", syncResumeToArtboard);

    return () => {
      frameRef.removeEventListener("load", syncResumeToArtboard);
    };
  }, [frameRef, mappings, setMappings]);

  // Persistently check if iframe has loaded using setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      if (frameRef?.contentWindow?.document.readyState === "complete") {
        syncResumeToArtboard();
        clearInterval(interval);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [frameRef, mappings, setMappings]);

  // Send resume data to iframe on change of resume data
  useEffect(syncResumeToArtboard, [resume.data, mappings, setMappings]);

  return (
    <>
      <Helmet>
        <title>
          {title} - {t`Reactive Resume`}
        </title>
      </Helmet>

      <iframe
        ref={setFrameRef}
        title={resume.id}
        src="/artboard/builder"
        className="mt-16 w-screen"
        style={{ height: `calc(100vh - 64px)` }}
      />
    </>
  );
};

export const builderLoader: LoaderFunction<ResumeDto> = async ({ params }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id = params.id!;

    const resume = await queryClient.fetchQuery({
      queryKey: ["resume", { id }],
      queryFn: () => findResumeById({ id }),
    });

    useResumeStore.setState({ resume });
    useResumeStore.temporal.getState().clear();

    return resume;
  } catch {
    return redirect("/dashboard");
  }
};
