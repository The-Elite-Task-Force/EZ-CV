/* eslint-disable lingui/no-unlocalized-strings */
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "@lingui/macro";
import { Aperture, Trash, UploadSimple } from "@phosphor-icons/react";
import type { CompanyDto, companySchema, UpdateCompanyDto } from "@reactive-resume/dto";
import { updateCompanySchema } from "@reactive-resume/dto";
import {
  Avatar,
  AvatarImage,
  Button,
  buttonVariants,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Label,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RichInput,
} from "@reactive-resume/ui";
import { cn } from "@reactive-resume/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AiActions } from "@/client/components/ai-actions";
import { PictureOptions } from "@/client/pages/builder/sidebars/left/sections/picture/options";
import { CompanyLogo } from "@/client/pages/dashboard/company/company-logo";
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

  const onAvatarClick = async () => {
    if (isValidUrl) {
      await updateCompany({
        id: companyState.id,
        picture: null,
      });
      form.setValue("picture", "");
    } else {
      inputRef.current?.click();
    }
  };

  const pictureUrl = form.watch("picture");
  const isValidUrl = useMemo(() => z.string().url().safeParse(pictureUrl).success, [pictureUrl]);

  const onSelectImage = async (event?: React.ChangeEvent<HTMLInputElement>) => {
    if (!event?.target.files?.length) return;

    const file = event.target.files[0];
    const response = await uploadImage(file);
    const url = response.data;

    await updateCompany({
      id: companyState.id,
      picture: url,
    });

    // Update form state
    form.setValue("picture", url);
  };

  return (
    <div>
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div style={{ marginBottom: "10px" }}>
              <FormField
                name="picture"
                control={form.control}
                render={({ field, fieldState: { error } }) => (
                  <div
                    className={cn("flex items-end gap-x-4 sm:col-span-2", error && "items-center")}
                  >
                    {" "}
                    <div className="group relative cursor-pointer" onClick={onAvatarClick}>
                      <Avatar className="size-14 bg-secondary">
                        <AvatarImage src={pictureUrl ?? undefined} />
                      </Avatar>

                      {isValidUrl ? (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <Trash size={16} weight="bold" />
                        </div>
                      ) : (
                        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
                          <UploadSimple size={16} weight="bold" />
                        </div>
                      )}
                      <CompanyLogo company={companyState} />
                      <FormItem className="flex-1">
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>

                      <input ref={inputRef} hidden type="file" onChange={onSelectImage} />

                      <motion.button
                        disabled={isUploading}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
                        onClick={() => inputRef.current?.click()}
                      >
                        <UploadSimple />
                      </motion.button>
                    </div>
                    <div className="flex w-full flex-col gap-y-1.5">
                      <Label htmlFor="picture.url">{t`Picture`}</Label>
                      <div className="flex items-center gap-x-2">
                        <input ref={inputRef} hidden type="file" onChange={onSelectImage} />

                        <Input placeholder="https://..." {...field} value={field.value ?? ""} />

                        {isValidUrl && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <motion.button
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                disabled={isUploading}
                                exit={{ opacity: 0 }}
                                className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}
                              >
                                <Aperture />
                              </motion.button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[360px]">
                              <PictureOptions />
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              />

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
                  <FormLabel>{t`Location`}</FormLabel>
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
                  <FormLabel>{t`Description`}</FormLabel>
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
                    {t`Save Changes`}
                  </Button>
                  <Button type="reset" variant="ghost" onClick={onReset}>
                    {t`Discard`}
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
