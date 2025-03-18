import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { basicsSchema, defaultBasics } from "@reactive-resume/schema";
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

import { CustomFieldsSection } from "../sections/custom/section";
import { PictureSection } from "../sections/picture/section";
import { SectionDialog } from "../sections/shared/section-dialog";
import { SectionIcon } from "../sections/shared/section-icon";
import { URLInput } from "../sections/shared/url-input";

const formSchema = basicsSchema;
type FormValues = z.infer<typeof formSchema>;

export const BasicDialog = () => {
  const form = useForm<FormValues>({
    defaultValues: defaultBasics,
    resolver: zodResolver(formSchema),
  });

  const id = form.watch("id");

  return (
    <SectionDialog<FormValues> id="basics" form={form} defaultValues={defaultBasics}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <header className="flex items-center justify-between sm:col-span-2">
          <div className="flex items-center gap-x-4">
            <SectionIcon id="basics" size={18} />
            <h2 className="line-clamp-1 text-2xl font-bold lg:text-3xl">{t`Basics`}</h2>
          </div>
        </header>

        <main className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <PictureSection />
          </div>

          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-4 sm:col-span-2">
                <FormLabel>{t`Full Name`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="headline"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5 sm:col-span-2">
                <FormLabel>{t`Headline`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.headline" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>{t`Email`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.email" placeholder="john.doe@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="url"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>{t`Website`}</FormLabel>
                <FormControl>
                  <URLInput {...field} id="basics.url" placeholder="https://example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="phone"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>{t`Phone`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.phone" placeholder="+1 (123) 4567 7890" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="location"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>{t`Location`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="birthdate"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel>{t`Birthdate`}</FormLabel>
                <FormControl>
                  <Input {...field} id="basics.birthdate" type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="summary"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-4 sm:col-span-2">
                <FormLabel>{t`Summary`}</FormLabel>
                <FormControl>
                  <RichInput
                    {...field}
                    content={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </main>

        <CustomFieldsSection id={id} className="sm:col-span-2" />
      </div>
    </SectionDialog>
  );
};
