import { t } from "@lingui/macro";
import type { ResumeDto } from "@reactive-resume/dto";
import type { ResumeData, Sections } from "@reactive-resume/schema";
import { useCallback, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import type { LoaderFunction } from "react-router";
import { redirect } from "react-router";

import { queryClient } from "@/client/libs/query-client";
import { findVariantById } from "@/client/services/resume";
import { useBuilderStore } from "@/client/stores/builder";
import { useResumeStore } from "@/client/stores/resume";

const filterVisibleSections = (sections: Sections) => {
  const result = JSON.parse(JSON.stringify(sections));
  for (const sectionKey of Object.keys(result)) {
    const section = result[sectionKey];

    // Ensure items exist and are an array
    if (Array.isArray(section.items)) {
      // Use a type guard to filter items based on the `visible` property
      section.items = section.items.filter(
        (item: { visible?: boolean }): item is { visible?: boolean } => {
          return item.visible === undefined || item.visible;
        },
      );
    }
  }
  return result;
};

export const VariantBuilderPage = () => {
  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setFrameRef = useBuilderStore((state) => state.frame.setRef);

  const resume = useResumeStore((state) => state.resume);
  const title = useResumeStore((state) => state.resume.title);

  const syncResumeToArtboard = useCallback(() => {
    const latestResume = useResumeStore.getState().resume;

    setImmediate(() => {
      if (!frameRef?.contentWindow) return;
      const message = {
        type: "SET_RESUME",
        payload: {
          basics: latestResume.data.basics,
          sections: filterVisibleSections(latestResume.data.sections),
          metadata: latestResume.data.metadata,
        },
      };
      frameRef.contentWindow.postMessage(message, "*");
    });
  }, [frameRef?.contentWindow, resume.data]);

  // Send resume data to iframe on initial load
  useEffect(() => {
    if (!frameRef) return;

    frameRef.addEventListener("load", syncResumeToArtboard);

    return () => {
      frameRef.removeEventListener("load", syncResumeToArtboard);
    };
  }, [frameRef]);

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
  }, [frameRef]);

  // Send resume data to iframe on change of resume data
  useEffect(syncResumeToArtboard, [resume.data]);

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

export const variantBuilderLoader: LoaderFunction<ResumeDto> = async ({ params }) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const id = params.id!;
    const resume = await queryClient.fetchQuery({
      queryKey: ["resume", { id }],
      queryFn: () => findVariantById({ id }),
    });

    useResumeStore.setState({ resume });
    useResumeStore.temporal.getState().clear();

    return resume;
  } catch {
    return redirect("/dashboard");
  }
};
