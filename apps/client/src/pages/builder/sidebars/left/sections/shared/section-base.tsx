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
import { CaretDown, CaretRight, Plus } from "@phosphor-icons/react";
import type { SectionMappingDto, SectionMappingItemDto } from "@reactive-resume/dto";
import type { SectionItem, SectionKey, SectionWithItem } from "@reactive-resume/schema";
import { Button } from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import get from "lodash.get";
import { useEffect, useState } from "react";

import { SearchBar } from "@/client/components/searchbar";
import { sectionItemFilterKeys } from "@/client/constants/search-filter-keys";
import {
  useCreateSectionMapping,
  useDeleteSectionMapping,
} from "@/client/services/section-mapping";
import { useDialog } from "@/client/stores/dialog";
import { useResumeStore } from "@/client/stores/resume";
import { useSectionMappingStore } from "@/client/stores/section-mapping";

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
  const [isExpanded, setIsExpanded] = useState(false);

  const mappingData = useSectionMappingStore((state) => state.mappings);

  const setMappings = useSectionMappingStore((state) => state.setMappings);

  const setValue = useResumeStore((state) => state.setValue);
  const section = useResumeStore((state) =>
    get(state.resume.data.sections, id),
  ) as SectionWithItem<T>;

  // Same issue as below obviously
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const [filteredItems, setFilteredItems] = useState<SectionItem[]>([]);

  const resume = useResumeStore((state) => state.resume);
  const { id: resumeId } = resume;

  const { createSectionMapping } = useCreateSectionMapping(resumeId);
  const { deleteSectionMapping } = useDeleteSectionMapping(resumeId);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (section) {
      setFilteredItems(section.items);
    }
  }, [section]);

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
    if (id === "basics") {
      await (item.id === resume.data.basics.id
        ? deleteSectionMapping({ resumeId: resumeId, id: item.id, format: id })
        : createSectionMapping({ resumeId: resumeId, itemId: item.id, format: id }));
    } else if (mappingData[id as keyof SectionMappingDto].includes(item.id)) {
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
      className="grid gap-y-4"
    >
      <button
        className="ml-2"
        onClick={() => {
          setIsExpanded(!isExpanded);
        }}
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-x-4">
            {isExpanded ? <CaretDown size={18} /> : <CaretRight size={18} />}
            <h2 className="line-clamp-1 text-lg font-bold lg:text-xl">{section.name}</h2>
          </div>
          <div className="flex items-center gap-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onCreate();
              }}
            >
              <Plus size={14} />
            </Button>
            <SectionOptions id={id} />
          </div>
        </header>
      </button>

      {isExpanded && (
        <main className={cn("grid transition-opacity")}>
          <span className="pb-2">
            <SearchBar<SectionItem>
              items={section.items}
              filterKeys={sectionItemFilterKeys}
              onFilter={setFilteredItems}
            />
          </span>
          {section.items.length === 0 && (
            <Button
              variant="outline"
              className="gap-x-2 border-dashed py-2 leading-relaxed hover:bg-secondary-accent"
              onClick={onCreate}
            >
              <Plus size={12} />
              <span className="font-medium lg:text-xs">
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
                {filteredItems.map((item, index) => (
                  <SectionListItem
                    key={item.id}
                    id={item.id}
                    title={title(item as T)}
                    description={description?.(item as T)}
                    visible={
                      id === "basics"
                        ? item.id === resume.data.basics.id
                        : mappingData[id as keyof SectionMappingDto].includes(item.id)
                    }
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
      )}

      {section.items.length > 0 && isExpanded && (
        <footer className="flex items-center justify-end">
          <Button variant="outline" className="ml-auto gap-x-1 px-2 lg:text-xs" onClick={onCreate}>
            <Plus size={12} />
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
