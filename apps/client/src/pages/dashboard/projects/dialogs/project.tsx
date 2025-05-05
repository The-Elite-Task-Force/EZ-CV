/* eslint-disable lingui/no-unlocalized-strings */
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Plus } from "@phosphor-icons/react";
import type { ProjectDto } from "@reactive-resume/dto";
import { createProjectSchema } from "@reactive-resume/dto";
import { idSchema } from "@reactive-resume/schema";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { z } from "zod";

import { useCreateProject } from "@/client/services/project/create";
import { useDialog } from "@/client/stores/dialog";
import { formatErrorMessage } from "@/client/utils/format-error";

const formSchema = createProjectSchema.extend({ id: idSchema.optional() });

type FormValues = z.infer<typeof formSchema>;

export const ProjectDialog = () => {
  const { isOpen, mode, payload, close } = useDialog<ProjectDto>("project");

  const isCreate = mode === "create";

  const [searchParams, _setSearchParams] = useSearchParams();

  const { createProject, loading: createLoading, error } = useCreateProject();

  const loading = createLoading;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", companyId: "" },
  });

  useEffect(() => {
    if (isOpen) onReset();
  }, [isOpen, payload]);

  useEffect(() => {
    const param = searchParams.get("company");
    if (param && isOpen) {
      form.setValue("companyId", param);
    }
  }, [searchParams, isOpen]);

  const onSubmit = async (values: FormValues): Promise<void> => {
    if (isCreate) {
      await createProject({ name: values.name, companyId: values.companyId });
    }

    close();
  };

  const onReset = () => {
    if (isCreate) form.reset({ name: "", companyId: "" });
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center space-x-2.5">
                  <Plus />
                  <h2>{isCreate && "Create a new project"}</h2>
                </div>
              </DialogTitle>
              <DialogDescription>
                {isCreate && "Start building your project by giving it a name."}
              </DialogDescription>
            </DialogHeader>

            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t`Title`}</FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-between gap-x-2">
                      <Input {...field} className="flex-1" />
                    </div>
                  </FormControl>
                  <FormMessage />
                  {error && (
                    <p className="break-words text-sm text-red-500">
                      {formatErrorMessage(error.message) || t`An unexpected error occurred.`}
                    </p>
                  )}
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
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
