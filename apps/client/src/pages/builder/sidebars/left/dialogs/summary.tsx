/* eslint-disable lingui/no-unlocalized-strings */
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { defaultSummary, summarySchema } from "@reactive-resume/schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RichInput,
} from "@reactive-resume/ui";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { AiActions } from "@/client/components/ai-actions";
import { getSectionNameFromId } from "@/client/utils/section-names";

import { SectionDialog } from "../sections/shared/section-dialog";

const formSchema = summarySchema;
type FormValues = z.infer<typeof formSchema>;

export const SummaryDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultSummary,
    resolver: zodResolver(formSchema),
  });

  const sectionTypeId = "summary";

  return (
    <SectionDialog<FormValues> id={sectionTypeId} form={form} defaultValues={defaultSummary}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <header className="flex items-center justify-between sm:col-span-2">
          <div className="flex items-center gap-x-4">
            <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
              {getSectionNameFromId(sectionTypeId)}
            </h2>
          </div>
        </header>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Name`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Description`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Summary`}</FormLabel>
              <FormControl>
                <RichInput
                  {...field}
                  content={field.value}
                  footer={(editor) => (
                    <AiActions
                      value={editor.getText()}
                      onChange={(value) => {
                        editor.commands.setContent(value, true);
                        field.onChange(value);
                      }}
                    />
                  )}
                  onChange={(value) => {
                    field.onChange(value);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionDialog>
  );
};
