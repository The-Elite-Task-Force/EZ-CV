import { defaultBasics } from "@reactive-resume/schema";
import { useEffect } from "react";

import { useResumeStore } from "../stores/resume";
import { useSectionsStore } from "../stores/section";

export const useMapSectionsToResume = () => {
  const sections = useSectionsStore((state) => state.sections);
  const setValue = useResumeStore((state) => state.setValue);
  const basicsItemId = useResumeStore((state) => state.resume.basicsItemId);

  useEffect(() => {
    for (const [key, section] of Object.entries(sections)) {
      setValue(`sections.${key}.items`, section);

      if (key === "basics" && Array.isArray(section)) {
        const matchingItem = section.find((item) => item.id === basicsItemId);
        if (matchingItem) {
          setValue("basics", matchingItem);
        } else {
          setValue("basics", defaultBasics);
        }
      }
    }
  }, [sections, setValue, basicsItemId]);

  return { sections, setValue };
};
