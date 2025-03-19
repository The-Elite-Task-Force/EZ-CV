/* eslint-disable lingui/no-unlocalized-strings */
import { Trash, UploadSimple } from "@phosphor-icons/react";
import {
  Avatar,
  AvatarImage,
  // buttonVariants,
  Input,
  Label,
  // Popover,
  // PopoverContent,
  // PopoverTrigger,
} from "@reactive-resume/ui";
// import { cn } from "@reactive-resume/utils";
// import { motion } from "framer-motion";
import { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

// import { PictureOptions } from "./options";

type Props = {
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  clickImage: () => void;
};

export const ImageSection = ({ onSelectImage, clickImage }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { setValue, watch } = useFormContext();
  const picture = watch("picture");

  const isValidUrl = useMemo(() => z.string().url().safeParse(picture).success, [picture]);

  const onAvatarClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex items-center gap-x-4">
      <div className="group relative cursor-pointer" onClick={onAvatarClick}>
        <Avatar className="size-14 bg-secondary">
          <AvatarImage src={picture} />
        </Avatar>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-full bg-background/30 opacity-0 transition-opacity group-hover:opacity-100">
          <UploadSimple size={16} weight="bold" />
        </div>
      </div>

      <div className="flex w-full flex-col gap-y-1.5">
        <div className="flex gap-x-2">
          <Label htmlFor="picture">Picture</Label>
          {isValidUrl && (
            <div
              onClick={() => {
                clickImage();
                setValue("picture", "");
              }}
            >
              <Trash size={16} weight="bold" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-x-2">
          <input ref={inputRef} hidden type="file" onChange={onSelectImage} />

          <Input
            id="picture"
            placeholder="https://..."
            value={picture}
            onChange={(event) => {
              setValue("picture", event.target.value);
            }}
          />

          {/* This allows for images to be edited by the user. It currently doesn't work, but should be fixed instead of removed */}

          {/* {isValidUrl && (
            <Popover>
              <PopoverTrigger asChild>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
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
          )} */}
        </div>
      </div>
    </div>
  );
};
