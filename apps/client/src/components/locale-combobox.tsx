// eslint-disable-next-line @nx/enforce-module-boundaries
import "/node_modules/flag-icons/css/flag-icons.min.css";

import { t } from "@lingui/macro";
import { CaretDown, Check } from "@phosphor-icons/react";
import {
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@reactive-resume/ui";
import type { LANGUAGE } from "@reactive-resume/utils";
import { cn } from "@reactive-resume/utils";
import { useMemo, useState } from "react";

import { useLanguages } from "../services/resume/translation";

type Props = {
  value: string | LANGUAGE;
  onValueChange: (locale: string | LANGUAGE) => void;
};

export const LocaleComboboxPopover = ({ value, onValueChange }: Props) => {
  const { languages } = useLanguages();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredLanguages = useMemo(() => {
    return languages.filter(({ name, locale }) =>
      `${name} ${locale}`.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, languages]);

  const selected = useMemo(() => {
    return languages.find((lang) => lang.locale === value);
  }, [value, languages]);

  return (
    <Popover open={open} modal={false} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between hover:bg-secondary/20 active:scale-100"
        >
          <span className="flex w-full items-center justify-between">
            <span className="flex gap-2">
              <span className={cn("fi", `fi-${selected?.countryCode}`, "text-xl")}></span>
              <span className="line-clamp-1 text-left font-normal">
                {selected?.name}{" "}
                <span className="ml-1 text-xs opacity-50">({selected?.locale})</span>
              </span>
            </span>
          </span>
          <CaretDown
            className={cn(
              "ml-2 size-4 shrink-0 rotate-0 opacity-50 transition-transform",
              open && "rotate-180",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <div className="p-2">
          <Input
            value={search}
            placeholder={t`Search for a language`}
            className="mb-2 w-full"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          <ScrollArea orientation="vertical" className="max-h-60 overflow-auto">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.locale}
                className="flex cursor-pointer items-center justify-between p-2 hover:bg-gray-600"
                onClick={() => {
                  onValueChange(lang.locale);
                  setOpen(false);
                }}
              >
                <span className="flex gap-2">
                  <span className={cn("fi", `fi-${lang.countryCode}`, "text-xl")}></span>
                  {lang.name} <span className="text-xs opacity-50">({lang.locale})</span>
                </span>
                {value === lang.locale && <Check className="size-4 text-green-500" />}
              </div>
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
};
