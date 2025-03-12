import { t } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import { CopySimple, PencilSimple, Plus } from "@phosphor-icons/react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { getSectionFormat, SECTION_FORMAT } from "@reactive-resume/dto";
import type { SectionItem, SectionWithItem } from "@reactive-resume/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  ScrollArea,
} from "@reactive-resume/ui";
import get from "lodash.get";
import { useEffect } from "react";
import type { UseFormReturn } from "react-hook-form";

import { useDeleteSectionItem, useUpdateSectionItem } from "@/client/services/section";
import { useCreateSectionItem } from "@/client/services/section/create";
import type { DialogName } from "@/client/stores/dialog";
import { useDialog } from "@/client/stores/dialog";
import { useResumeStore } from "@/client/stores/resume";
import { getSectionNameFromId } from "@/client/utils/section-names";

type Props<T extends SectionItem> = {
  id: DialogName;
  form: UseFormReturn<T>;
  defaultValues: T;
  pendingKeyword?: string;
  children: React.ReactNode;
};

export const SectionDialog = <T extends SectionItem>({
  id,
  form,
  defaultValues,
  pendingKeyword,
  children,
}: Props<T>) => {
  const { isOpen, mode, close, payload } = useDialog<T>(id);

  const section = useResumeStore((state) => {
    return get(state.resume.data.sections, id);
  }) as SectionWithItem<T> | null;

  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";
  const isDuplicate = mode === "duplicate";
  const resumeId = useResumeStore((state) => state.resume.id);

  const { createSectionItem } = useCreateSectionItem(resumeId);
  const { deleteSectionItem } = useDeleteSectionItem();
  const { updateSectionItem } = useUpdateSectionItem();

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  const onSubmit = async (values: T) => {
    if (!section) return;

    const sectionId = section.id;

    const sectionFormat = getSectionFormat(sectionId);
    if (!sectionFormat) throw new Error("Invalid section format");

    values.updatedAt = new Date();

    if (isCreate || isDuplicate) {
      const dto = await createSectionItem({
        format: sectionFormat,
        data: values,
        resumeId: resumeId,
      });

      values.id = dto.id;

      if (pendingKeyword && "keywords" in values) {
        values.keywords.push(pendingKeyword);
      }
    }

    if (isUpdate) {
      if (!payload.item?.id) return;

      await updateSectionItem({
        id: values.id,
        data: values,
        format: sectionFormat,
      });

      if (pendingKeyword && "keywords" in values) {
        values.keywords.push(pendingKeyword);
      }
    }

    if (isDelete) {
      if (!payload.item?.id) return;

      await deleteSectionItem({
        data: { id: values.id },
        format: sectionFormat,
      });
    }

    close();
  };

  const onReset = () => {
    if (isCreate) form.reset({ ...defaultValues, id: createId() } as T);
    if (isUpdate) form.reset({ ...defaultValues, ...payload.item });
    if (isDuplicate) form.reset({ ...payload.item, id: createId() } as T);
    if (isDelete) form.reset({ ...defaultValues, ...payload.item });
  };

  const sectionType = getSectionNameFromId(id);

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent className="z-50">
          <Form {...form}>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>{t`Are you sure you want to delete this item?`}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t`This action can be reverted by clicking on the undo button in the floating toolbar.`}
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
                <AlertDialogAction variant="error" onClick={form.handleSubmit(onSubmit)}>
                  {t`Delete`}
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent className="z-50">
        <Form {...form}>
          <ScrollArea>
            <form
              className="max-h-[60vh] space-y-6 lg:max-h-fit"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <DialogHeader>
                <DialogTitle>
                  <div className="flex items-center space-x-2.5">
                    {isCreate && <Plus />}
                    {isUpdate && <PencilSimple />}
                    {isDuplicate && <CopySimple />}
                    <h2>
                      {isCreate && t`Create ${sectionType} item`}
                      {isUpdate && t`Update an existing item`}
                      {isDuplicate && t`Duplicate an existing item`}
                    </h2>
                  </div>
                </DialogTitle>

                <VisuallyHidden>
                  <DialogDescription />
                </VisuallyHidden>
              </DialogHeader>

              {children}

              <DialogFooter>
                <Button type="submit">
                  {isCreate && t`Create`}
                  {isUpdate && t`Save Changes`}
                  {isDuplicate && t`Duplicate`}
                </Button>
              </DialogFooter>
            </form>
          </ScrollArea>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
