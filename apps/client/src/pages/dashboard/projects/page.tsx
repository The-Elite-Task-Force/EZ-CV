/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import { List, SquaresFour } from "@phosphor-icons/react";
import type { ProjectDto } from "@reactive-resume/dto";
import {
  Combobox,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router";

import { SearchBar } from "@/client/components/searchbar";
import { projectFilterKeys } from "@/client/constants/search-filter-keys";
import { useCompanies } from "@/client/services/company";
import { useOwnProjectsByCompanyId } from "@/client/services/project/projects";
import { useAuthStore } from "@/client/stores/auth";

import { ProjectsGridView } from "./layouts/grid";
import { ProjectListView } from "./layouts/list";

type Layout = "grid" | "list";

export const ProjectsPage = () => {
  const [layout, setLayout] = useState<Layout>("grid");
  const [company, setCompany] = useState<string | undefined>();
  const [searchParams, setSearchParams] = useSearchParams();

  const { user } = useAuthStore();

  const { companies, loading } = useCompanies();

  const { projects, loading: loadingProjects } = useOwnProjectsByCompanyId(company ?? "");

  const [filteredItems, setFilteredItems] = useState<ProjectDto[]>([]);

  useEffect(() => {
    if (projects) {
      setFilteredItems(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (company) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set("company", company);
        return newParams;
      });
    }
  }, [company, setSearchParams]);

  useEffect(() => {
    const param = searchParams.get("company");
    if (param) {
      setCompany(param);
    } else if (!company && companies && companies.length > 0) {
      setCompany(companies[0].id);
    }
  }, [companies, searchParams]);

  if (!user || loading || loadingProjects) return;

  return (
    <div>
      <Helmet>
        <title>Projects - EzCV</title>
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
            Projects
          </motion.h1>

          <div className="w-full max-w-xs">
            <Combobox
              value={company}
              options={
                companies?.map((c) => ({
                  label: c.name,
                  value: c.id,
                })) ?? []
              }
              onValueChange={setCompany}
            />
          </div>

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

        {projects && (
          <SearchBar<ProjectDto>
            items={projects}
            filterKeys={projectFilterKeys}
            onFilter={setFilteredItems}
          />
        )}

        <ScrollArea
          allowOverflow
          className="h-[calc(100vh-140px)] overflow-visible lg:h-[calc(100vh-88px)]"
        >
          <TabsContent value="grid">
            <ProjectsGridView projects={filteredItems} loading={loadingProjects} />
          </TabsContent>
          <TabsContent value="list">
            <ProjectListView projects={filteredItems} loading={loadingProjects} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
