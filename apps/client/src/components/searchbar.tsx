import { Input } from "@reactive-resume/ui";
import { useState } from "react";

type SearchBarProps<T extends object> = {
  items: T[];
  filterKeys: string[];
  onFilter: (filteredItems: T[]) => void;
};

export const SearchBar = <T extends object>({ items, filterKeys, onFilter }: SearchBarProps<T>) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.toLowerCase();
    setQuery(value);

    const filteredItems = items.filter((item) =>
      filterKeys.some((key) => {
        if (key in item) {
          const valueToCheck = item[key as keyof T];
          return typeof valueToCheck === "string" && valueToCheck.toLowerCase().includes(value);
        }
        return false;
      }),
    );

    onFilter(filteredItems);
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Input type="text" placeholder="Search..." value={query} onChange={handleSearch} />
    </div>
  );
};
