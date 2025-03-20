import type { SectionsDto } from "@reactive-resume/dto";
import _set from "lodash.set";
import { temporal } from "zundo";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type SectionsState = {
  sections: SectionsDto;
};

type SectionsActions = {
  setSections: (sections: SectionsDto) => void;

  setValue: (path: string, value: unknown) => void;
};

export const useSectionsStore = create<SectionsState & SectionsActions>()(
  temporal(
    immer((set) => ({
      sections: {} as SectionsDto,
      setSections: (sections) => {
        set({ sections });
      },
      setValue: (path, value) => {
        set((state) => {
          state.sections = _set(state.sections, path, value);
        });
      },
    })),
    {
      limit: 100,
      wrapTemporal: (fn) => devtools(fn),
      partialize: ({ sections }) => ({ sections }),
    },
  ),
);
