import type { DragEndEvent } from "@dnd-kit/core";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import type { SectionMappingDto, SectionMappingItemDto } from "@reactive-resume/dto";
import type { SectionItem, SectionKey, SectionWithItem } from "@reactive-resume/schema";
import { Button } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import get from "lodash.get";

import {
  useCreateSectionMapping,
  useDeleteSectionMapping,
} from "@/client/services/section-mapping";
import { useDialog } from "@/client/stores/dialog";
import { useResumeStore } from "@/client/stores/resume";
import { useSectionMappingStore } from "@/client/stores/section-mapping";

import { SectionIcon } from "./section-icon";
import { SectionListItem } from "./section-list-item";
import { SectionOptions } from "./section-options";

type Props<T extends SectionItem> = {
  id: SectionKey;
  title: (item: T) => string;
  description?: (item: T) => string | undefined;
};

const removeFromMapSections = (mapping: SectionMappingDto, format: string, id: string) => {
  const result = JSON.parse(JSON.stringify(mapping));

  result[format] = result[format].filter((s: string) => s !== id);

  return result;
};

const addToMapSections = (
  mapping: SectionMappingDto,
  format: string,
  item: SectionMappingItemDto,
) => {
  const result = JSON.parse(JSON.stringify(mapping));

  result[format].push(item.itemId);

  return result;
};

export const SectionBase = <T extends SectionItem>({ id, title, description }: Props<T>) => {
  const { open } = useDialog(id);

  const mappingData = useSectionMappingStore((state) => state.mappings);

  const setMappings = useSectionMappingStore((state) => state.setMappings);

  const setValue = useResumeStore((state) => state.setValue);
  const section = useResumeStore((state) =>
    get(state.resume.data.sections, id),
  ) as SectionWithItem<T>;

  const resumeId = useResumeStore((state) => state.resume.id);

  const { createSectionMapping } = useCreateSectionMapping(resumeId);
  const { deleteSectionMapping } = useDeleteSectionMapping(resumeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  //Should be fixed though, this means we don't actually know what our data is and have typed it incorrectly
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!section) return null;

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = section.items.findIndex((item) => item.id === active.id);
      const newIndex = section.items.findIndex((item) => item.id === over.id);

      const sortedList = arrayMove(section.items as T[], oldIndex, newIndex);
      setValue(`sections.${id}.items`, sortedList);
    }
  };

  const onCreate = () => {
    open("create", { id });
  };

  const onUpdate = (item: T) => {
    open("update", { id, item });
  };

  const onDuplicate = (item: T) => {
    open("duplicate", { id, item });
  };

  const onDelete = (item: T) => {
    open("delete", { id, item });
  };

  const onToggleVisibility = async (item: T, index: number) => {
    if (mappingData[id as keyof SectionMappingDto].includes(item.id)) {
      await deleteSectionMapping({ resumeId: resumeId, id: item.id, format: id });
      setMappings(removeFromMapSections(mappingData, id, item.id));
      setValue(`sections.${id}.items[${index}].visible`, false);
    } else {
      const data = await createSectionMapping({ resumeId: resumeId, itemId: item.id, format: id });
      setMappings(addToMapSections(mappingData, id, data));
      setValue(`sections.${id}.items[${index}].visible`, true);
    }
  };

  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="grid gap-y-6"
    >
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <SectionIcon id={id} size={18} />
          <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">{section.name}</h2>
        </div>

        <div className="flex items-center gap-x-2">
          <SectionOptions id={id} />
        </div>
      </header>

      <main className={cn("grid transition-opacity")}>
        {section.items.length === 0 && (
          <Button
            variant="outline"
            className="gap-x-2 border-dashed py-6 leading-relaxed hover:bg-secondary-accent"
            onClick={onCreate}
          >
            <Plus size={14} />
            <span className="font-medium">
              {t({
                message: "Add a new item",
                context: "For example, add a new work experience, or add a new profile.",
              })}
            </span>
          </Button>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToParentElement]}
          onDragEnd={onDragEnd}
        >
          <SortableContext items={section.items} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {section.items.map((item, index) => (
                <SectionListItem
                  key={item.id}
                  id={item.id}
                  title={title(item as T)}
                  description={description?.(item as T)}
                  visible={mappingData[id as keyof SectionMappingDto].includes(item.id)}
                  onUpdate={() => {
                    onUpdate(item as T);
                  }}
                  onDelete={() => {
                    onDelete(item as T);
                  }}
                  onDuplicate={() => {
                    onDuplicate(item as T);
                  }}
                  onToggleVisibility={() => {
                    void onToggleVisibility(item as T, index);
                  }}
                />
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </main>

      {section.items.length > 0 && (
        <footer className="flex items-center justify-end">
          <Button
            variant="outline"
            className="ml-auto gap-x-2 text-xs lg:text-sm"
            onClick={onCreate}
          >
            <Plus />
            <span>
              {t({
                message: "Add a new item",
                context: "For example, add a new work experience, or add a new profile.",
              })}
            </span>
          </Button>
        </footer>
      )}
    </motion.section>
  );
};
