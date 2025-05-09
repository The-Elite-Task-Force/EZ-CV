/* eslint-disable lingui/no-unlocalized-strings */
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { useSearch } from "@/client/services/search/search";

import SearchResultItem from "../dashboard/search/search-result";
import { SearchBar } from "../dashboard/search/searchbar";
import { useResetSearchCache } from "../dashboard/search/use-reset-search-cache";

export const ProjectPage = () => {
  const [query, setQuery] = useState("");
  const [totalResults] = useState(10);
  useResetSearchCache();

  const { data, isLoading, error, refetch } = useSearch(query, totalResults);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    void refetch();
  };

  return (
    <div>
      <Helmet>
        <title>Projects - EzCV</title>
      </Helmet>

      <div className="flex h-screen items-stretch gap-12 p-8">
        <div className="flex h-full w-1/2 flex-col">
          <div className="w-full py-8">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="w-full grow overflow-auto rounded-2xl bg-secondary/70 p-6 shadow-md">
            {isLoading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {!isLoading && data && data.length > 0 ? (
              <ul>
                {data.map((item, index) => (
                  <li key={index}>
                    <SearchResultItem searchResult={item} />
                  </li>
                ))}
              </ul>
            ) : (
              !isLoading && query && <p>No results found</p>
            )}
          </div>
        </div>

        <div className="flex h-full w-1/2 flex-col">
          <div className="flex w-full items-center justify-between p-8">
            <h2 className="text-3xl font-bold">CV Portfolio</h2>
            <p className="pr-8 text-lg">Members count: 0</p>
          </div>
          <div className="w-full grow overflow-auto rounded-2xl bg-secondary/70 p-6 shadow-md"></div>
        </div>
      </div>
    </div>
  );
};
