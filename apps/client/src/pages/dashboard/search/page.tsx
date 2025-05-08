/* eslint-disable lingui/no-unlocalized-strings */
import type { SearchResultDto } from "@reactive-resume/dto";
import { useState } from "react";

import { useSearch } from "@/client/services/search/search";

import SearchResultItem from "./search-result";
import { SearchBar } from "./searchbar";

export const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [totalResults] = useState(10);

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    void refetch();
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Search</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-4 w-full max-w-3xl">
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
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
