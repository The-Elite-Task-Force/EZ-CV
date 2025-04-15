/* eslint-disable lingui/no-unlocalized-strings */
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { createId } from "@paralleldrive/cuid2";
import { CaretDown, Flask, MagicWand, Plus } from "@phosphor-icons/react";
import type { ResumeDto } from "@reactive-resume/dto";
import { createResumeSchema } from "@reactive-resume/dto";
import { idSchema, sampleResume } from "@reactive-resume/schema";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Tooltip,
} from "@reactive-resume/ui";
import { cn, generateRandomName, languages } from "@reactive-resume/utils";
import slugify from "@sindresorhus/slugify";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/client/hooks/use-toast";
import { useCreateResume, useDeleteResume, useUpdateResume } from "@/client/services/resume";
import { useImportResume } from "@/client/services/resume/import";
import { useTranslateResume } from "@/client/services/resume/translate";
import { useDialog } from "@/client/stores/dialog";

const formSchema = createResumeSchema.extend({
  id: idSchema.optional(),
  slug: z.string(),
  language: z.string().optional(), // Add language field
});

type FormValues = z.infer<typeof formSchema>;

export const ResumeDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ResumeDto>("resume");
  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isDelete = mode === "delete";
  const isDuplicate = mode === "duplicate";
  const isTranslate = mode === "translate";

  const { createResume, loading: createLoading } = useCreateResume();
  const { updateResume, loading: updateLoading } = useUpdateResume();
  const { deleteResume, loading: deleteLoading } = useDeleteResume();
  const { importResume: duplicateResume, loading: duplicateLoading } = useImportResume();
  const { translateResume, loading: translateLoading } = useTranslateResume();
  const loading =
    createLoading || updateLoading || deleteLoading || duplicateLoading || translateLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", slug: "", language: "en-US" }, // Default language
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  useEffect(() => {
    const slug = slugify(form.watch("title"));
    form.setValue("slug", slug);
  }, [form.watch("title")]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isCreate) {
        await createResume({
          slug: values.slug,
          title: values.title,
          visibility: "private",
          language: values.language ?? "en-US",
        });
      }

      if (isUpdate) {
        if (!payload.item?.id) return;

        await updateResume({
          id: payload.item.id,
          title: values.title,
          slug: values.slug,
        });
      }

      if (isDuplicate) {
        if (!payload.item?.id) return;
        //Check if basics.id exist to get around validation
        const {
          data: { basics },
        } = payload.item;
        if (!basics.id) {
          basics.id = createId();
        }
        await duplicateResume({
          title: values.title,
          slug: values.slug,
          data: payload.item.data,
          language: values.language,
        });
      }

      if (isTranslate) {
        if (!payload.item?.id) return;

        await translateResume({
          title: values.title,
          slug: values.slug,
          data: payload.item.data,
          language: values.language,
        });
      }

      if (isDelete) {
        if (!payload.item?.id) return;

        await deleteResume({ id: payload.item.id });
      }

      close();
    } catch (error) {
      toast({
        variant: "error",
        title: "An error occurred",
        description:
          error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    }
  };

  const onReset = () => {
    if (isCreate) form.reset({ title: "", slug: "", language: "en-US" });
    if (isUpdate)
      form.reset({
        id: payload.item?.id,
        title: payload.item?.title,
        slug: payload.item?.slug,
        language: payload.item?.language,
      });
    if (isDuplicate)
      form.reset({
        title: `${payload.item?.title} (Copy)`,
        slug: `${payload.item?.slug}-copy`,
        language: payload.item?.language,
      });
    if (isTranslate)
      form.reset({
        id: payload.item?.id,
        title: payload.item?.title,
        slug: payload.item?.slug,
        language: payload.item?.language,
      });
    if (isDelete)
      form.reset({
        id: payload.item?.id,
        title: payload.item?.title,
        slug: payload.item?.slug,
      });
  };

  const onGenerateRandomName = () => {
    const name = generateRandomName();
    form.setValue("title", name);
    form.setValue("slug", slugify(name));
  };

  const onCreateSample = async () => {
    const randomName = generateRandomName();

    await duplicateResume({
      title: randomName,
      slug: slugify(randomName),
      data: sampleResume,
      language: "en-US",
    });

    close();
  };

  if (isDelete) {
    return (
      <AlertDialog open={isOpen} onOpenChange={close}>
        <AlertDialogContent>
          <Form {...form}>
            <form>
              <AlertDialogHeader>
                <AlertDialogTitle>{t`Are you sure you want to delete your resume?`}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t`This action cannot be undone. This will permanently delete your resume and cannot be recovered.`}
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
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>
                    {isCreate && t`Create a new resume`}
                    {isUpdate && t`Update an existing resume`}
                    {isDuplicate && t`Duplicate an existing resume`}
                    {isTranslate && t`Translate resume`} {/* Add translate title */}
                  </h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isCreate && t`Start building your resume by giving it a name.`}
                {isUpdate && t`Changed your mind about the name? Give it a new one.`}
                {isDuplicate && t`Give your old resume a new name.`}
                {isTranslate && t`Select a language to translate your resume.`}{" "}
                {/* Add description */}
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Title`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />

                      {(isCreate || isDuplicate) && (
                        <Tooltip content={t`Generate a random title for your resume`}>
                          <Button
                            size="icon"
                            type="button"
                            variant="outline"
                            onClick={onGenerateRandomName}
                          >
                            <MagicWand />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </FormControl>
                  <FormDescription>
                    {t`Tip: You can name the resume referring to the position you are applying for.`}
                    <p>{isDuplicate && "Note: Selected resume language is not duplicated."}</p>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="language"
              control={form.control}
              render={
                ({ field }) =>
                  isTranslate ? ( // Only render the dropdown if in Translate mode
                    <FormItem>
                      <FormLabel>{t`Language`}</FormLabel>
                      <FormControl>
                        <select {...field} className="form-select">
                          {languages.map((lang) => (
                            <option key={lang.locale} value={lang.locale}>
                              {lang.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  ) : (
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <></>
                  ) // Return an empty fragment instead of null
              }
            />

            <FormField
              disabled
              name="slug"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume alias</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The alias is a simple and unique identifier for your resume!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <div className="flex items-center">
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(isCreate && "rounded-r-none")}
                >
                  {isCreate && t`Create`}
                  {isUpdate && t`Save Changes`}
                  {isDuplicate && t`Duplicate`}
                  {isTranslate && t`Translate`}
                </Button>

                {isCreate && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button type="button" size="icon" className="rounded-l-none border-l">
                        <CaretDown />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="center">
                      <DropdownMenuItem onClick={onCreateSample}>
                        <Flask className="mr-2" />
                        {t`Create Sample Resume`}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
