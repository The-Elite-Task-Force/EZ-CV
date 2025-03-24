/* eslint-disable lingui/no-unlocalized-strings */

import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { defaultEducation, educationSchema } from "@reactive-resume/schema";
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
import { URLInput } from "../sections/shared/url-input";

const formSchema = educationSchema;

type FormValues = z.infer<typeof formSchema>;

export const EducationDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultEducation,
    resolver: zodResolver(formSchema),
  });

  const sectionTypeId = "education";

  return (
    <SectionDialog<FormValues> id={sectionTypeId} form={form} defaultValues={defaultEducation}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <header className="flex items-center justify-between sm:col-span-2">
          <div className="flex items-center gap-x-4">
            <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">
              {getSectionNameFromId(sectionTypeId)}
            </h2>
          </div>
        </header>
        <FormField
          name="institution"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t`Institution`}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="studyType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({
                  message: "Type of Study",
                  comment: "For example, Bachelor's Degree or Master's Degree",
                })}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="area"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({
                  message: "Area of Study",
                  comment: "For example, Computer Science or Business Administration",
                })}
              </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="score"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t({
                  message: "Score",
                  comment: "Score or honors for the degree, for example, CGPA or magna cum laude",
                })}
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="9.2 GPA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Date or Date Range`}</FormLabel>
              <FormControl>
                <Input {...field} placeholder={t`March 2023 - Present`} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="url"
          control={form.control}
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t`Website`}</FormLabel>
              <FormControl>
                <URLInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="summary"
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
