/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import { List, SquaresFour } from "@phosphor-icons/react";
import type { ResumeDto } from "@reactive-resume/dto";
import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { SearchBar } from "@/client/components/searchbar";
import { resumeFilterKeys } from "@/client/constants/search-filter-keys";
import { useResumes } from "@/client/services/resume";
import { useSections } from "@/client/services/section/sections";

import { ResumeGridView } from "./_layouts/grid";
import { ResumeListView } from "./_layouts/list";

type Layout = "grid" | "list";

export const ResumesPage = () => {
  const [layout, setLayout] = useState<Layout>("grid");

  const { resumes, loading } = useResumes();

  useSections();

  const [filteredItems, setFilteredItems] = useState<ResumeDto[]>([]);

  useEffect(() => {
    if (resumes) {
      setFilteredItems(resumes);
    }
  }, [resumes]);

  return (
    <>
      <Helmet>
        <title>{t`Resumes`} - EzCV</title>
      </Helmet>

      <Tabs
        value={layout}
        className="space-y-4"
        onValueChange={(value) => {
          setLayout(value as Layout);
        }}
      >
        <div className="flex items-center justify-between">
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold tracking-tight"
          >
            {t`Resumes`}
          </motion.h1>

          <TabsList>
            <TabsTrigger value="grid" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <SquaresFour />
              <span className="ml-2 hidden sm:block">{t`Grid`}</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="size-8 p-0 sm:h-8 sm:w-auto sm:px-4">
              <List />
              <span className="ml-2 hidden sm:block">{t`List`}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        {resumes && (
          <SearchBar<ResumeDto>
            items={resumes}
            filterKeys={resumeFilterKeys}
            onFilter={setFilteredItems}
          />
        )}

        <ScrollArea
          allowOverflow
          className="h-[calc(100vh-140px)] overflow-visible lg:h-[calc(100vh-88px)]"
        >
          <TabsContent value="grid">
            <ResumeGridView resumes={filteredItems} loading={loading} />
          </TabsContent>
          <TabsContent value="list">
            <ResumeListView resumes={filteredItems} loading={loading} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </>
  );
};
