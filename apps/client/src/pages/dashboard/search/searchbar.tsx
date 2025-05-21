/* eslint-disable lingui/no-unlocalized-strings */
import { Input } from "@reactive-resume/ui";
import type { KeyboardEvent } from "react";
import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex w-full max-w-3xl bg-secondary/50 shadow-md">
      <Input
        type="text"
        value={query}
        placeholder="Enter your search query"
        className="grow"
        onChange={(e) => {
          setQuery(e.target.value);
        }}
        onKeyUp={handleKeyPress}
      />
    </div>
  );
};
