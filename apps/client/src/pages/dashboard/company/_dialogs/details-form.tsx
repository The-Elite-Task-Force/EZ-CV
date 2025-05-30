/* eslint-disable lingui/no-unlocalized-strings */
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanyDto, companySchema, UpdateCompanyDto } from "@reactive-resume/dto";
import { updateCompanySchema } from "@reactive-resume/dto";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RichInput,
} from "@reactive-resume/ui";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { AiActions } from "@/client/components/ai-actions";
import { ImageSection } from "@/client/pages/builder/sidebars/left/sections/picture/image-section";
import { useUpdateCompany } from "@/client/services/company";
import { useUploadImage } from "@/client/services/storage";

type FormValues = z.infer<typeof companySchema>;

type Props = {
  companyState: CompanyDto;
  setCompanyState: (newCompany: CompanyDto) => void;
};

export const DetailsForm = ({ companyState, setCompanyState }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const { updateCompany, loading } = useUpdateCompany();
  const { uploadImage, loading: isUploading } = useUploadImage();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(updateCompanySchema),
    defaultValues: {
      name: "",
      description: "",
      location: "",
      picture: "",
    },
  });

  useEffect(() => {
    onReset();
  }, [companyState]);

  const onReset = () => {
    form.reset({
      id: companyState.id,
      name: companyState.name,
      description: companyState.description,
      location: companyState.location,
      picture: companyState.picture ?? "",
    });
  };

  const onSubmit = async (data: UpdateCompanyDto) => {
    setError(null);

    try {
      const updatedCompany = await updateCompany(data);
      setCompanyState(updatedCompany);
      form.reset(updatedCompany);
    } catch {
      setError("Failed to update company. Please try again.");
    }
  };

  const { setValue } = form;

  const onSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const response = await uploadImage(file);
      const url = response.data;

      setValue("picture", url);

      await updateCompany({
        id: companyState.id,
        picture: url,
      });
    }
  };

  const removeImage = async () => {
    await updateCompany({
      id: companyState.id,
      picture: null,
    });
    setValue("picture", null);
  };

  return (
    <div>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div style={{ marginBottom: "10px" }}>
              <ImageSection clickImage={removeImage} onSelectImage={onSelectImage} />

              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input autoComplete="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              name="location"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input autoComplete="location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Description</FormLabel>
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

            {error && <div className="text-red-500">{error}</div>}

            <AnimatePresence presenceAffectsLayout>
              {form.formState.isDirty && (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center space-x-2 self-center sm:col-start-2"
                >
                  <Button type="submit" disabled={loading}>
                    Save Changes
                  </Button>
                  <Button type="reset" variant="ghost" onClick={onReset}>
                    Discard
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Form>
      </div>
    </div>
  );
};
