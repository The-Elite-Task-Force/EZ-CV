/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import type { SearchResultDto } from "@reactive-resume/dto";
import { Button, Input } from "@reactive-resume/ui";
import { useState } from "react";

import { useSearch } from "@/client/services/search/search";

import SearchResultItem from "./search-result";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [totalResults, setTotalResults] = useState(10); // Default number of search results

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);

  const handleSearch = () => {
    void refetch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      <div className="flex w-full max-w-3xl">
        <Input
          type="text"
          value={query}
          placeholder={"Enter your search query"}
          className="mr-2 grow"
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          onKeyUp={handleKeyPress}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="mt-4 w-full max-w-3xl">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: ${error.message}</p>}
        {!isLoading && data && data.length > 0 ? (
          <ul>
            {data.map((item: SearchResultDto, index: number) => (
              <li key={index}>
                <SearchResultItem searchResult={item} />
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && <p>No results found</p>
        )}
      </div>
    </div>
  );
};
