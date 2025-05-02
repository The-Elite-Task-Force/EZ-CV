/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import { List, SquaresFour } from "@phosphor-icons/react";
import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import { useAuthStore } from "@/client/stores/auth";

import { ProjectsGridView } from "./layouts/grid";

type Layout = "grid" | "list";

export const ProjectsPage = () => {
  const [layout, setLayout] = useState<Layout>("grid");

  const { user } = useAuthStore();

  if (!user) return;

  return (
    <div>
      <Helmet>
        <title>{t`Projects`} - EzCV</title>
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

        <ScrollArea
          allowOverflow
          className="h-[calc(100vh-140px)] overflow-visible lg:h-[calc(100vh-88px)]"
        >
          <TabsContent value="grid">
            <ProjectsGridView />
          </TabsContent>
          <TabsContent value="list">
            {
              // ProjectsListView
            }
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
