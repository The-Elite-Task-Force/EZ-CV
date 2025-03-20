import { t, Trans } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import { DotsSixVertical, Envelope, Plus, X } from "@phosphor-icons/react";
import { type CustomField as ICustomField, defaultBasics } from "@reactive-resume/schema";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, Reorder, useDragControls } from "framer-motion";

import { useSectionsStore } from "@/client/stores/section";

type CustomFieldProps = {
  field: ICustomField;
  onChange: (field: ICustomField) => void;
  onRemove: (id: string) => void;
};

export const CustomField = ({ field, onChange, onRemove }: CustomFieldProps) => {
  const controls = useDragControls();

  const handleChange = (key: "icon" | "name" | "value", value: string) => {
    onChange({ ...field, [key]: value });
  };

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
    >
      <div className="flex items-end justify-between">
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0"
          onPointerDown={(event) => {
            controls.start(event);
          }}
        >
          <DotsSixVertical />
        </Button>

        <Popover>
          <Tooltip content={t`Icon`}>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost" className="shrink-0">
                {field.icon ? <i className={cn(`ph ph-${field.icon}`)} /> : <Envelope />}
              </Button>
            </PopoverTrigger>
          </Tooltip>
          <PopoverContent side="bottom" align="start" className="flex flex-col gap-y-1.5 p-1.5">
            <Input
              value={field.icon}
              placeholder={t`Enter Phosphor Icon`}
              onChange={(event) => {
                onChange({ ...field, icon: event.target.value });
              }}
            />

            <p className="text-xs opacity-80">
              <Trans>
                Visit{" "}
                <a
                  href="https://phosphoricons.com/"
                  target="_blank"
                  className="underline"
                  rel="noopener noreferrer nofollow"
                >
                  Phosphor Icons
                </a>{" "}
                for a list of available icons
              </Trans>
            </p>
          </PopoverContent>
        </Popover>

        <Input
          className="mx-2"
          placeholder={t`Name`}
          value={field.name}
          onChange={(event) => {
            handleChange("name", event.target.value);
          }}
        />

        <Input
          className="mx-2"
          placeholder={t`Value`}
          value={field.value}
          onChange={(event) => {
            handleChange("value", event.target.value);
          }}
        />

        <Button
          size="icon"
          variant="ghost"
          className="shrink-0"
          onClick={() => {
            onRemove(field.id);
          }}
        >
          <X />
        </Button>
      </div>
    </Reorder.Item>
  );
};

type Props = {
  className?: string;
  id: string;
};

export const CustomFieldsSection = ({ className, id }: Props) => {
  const setValue = useSectionsStore((state) => state.setValue);
  const basicsItems = useSectionsStore((state) => state.sections.basics);
  const basicsItem = basicsItems.find((item) => item.id === id) ?? defaultBasics;

  const customFields = basicsItem.customFields;

  const onAddCustomField = () => {
    setValue(
      `sections.basics`,
      basicsItems.map((item) =>
        item.id === id
          ? {
              ...item,
              customFields: [
                ...customFields,
                { id: createId(), icon: "envelope", name: "", value: "" },
              ],
            }
          : item,
      ),
    );
  };

  const onChangeCustomField = (field: ICustomField) => {
    setValue(
      `sections.basics`,
      basicsItems.map((item) =>
        item.id === id
          ? {
              ...item,
              customFields: item.customFields.map((f) => (f.id === field.id ? field : f)),
            }
          : item,
      ),
    );
  };

  const onReorderCustomFields = (values: ICustomField[]) => {
    setValue(
      `sections.basics`,
      basicsItems.map((item) => (item.id === id ? { ...item, customFields: values } : item)),
    );
  };

  const onRemoveCustomField = (fieldId: string) => {
    setValue(
      `sections.basics`,
      basicsItems.map((item) =>
        item.id === id
          ? {
              ...item,
              customFields: item.customFields.filter((field) => field.id !== fieldId),
            }
          : item,
      ),
    );
  };

  return (
    <div className={cn("space-y-4", className)}>
      <AnimatePresence>
        <Reorder.Group
          axis="y"
          className="space-y-4"
          values={customFields}
          onReorder={onReorderCustomFields}
        >
          {customFields.map((field) => (
            <CustomField
              key={field.id}
              field={field}
              onChange={onChangeCustomField}
              onRemove={onRemoveCustomField}
            />
          ))}
        </Reorder.Group>
      </AnimatePresence>

      <Button variant="link" onClick={onAddCustomField}>
        <Plus className="mr-2" />
        <span>{t`Add a custom field`}</span>
      </Button>
    </div>
  );
};
