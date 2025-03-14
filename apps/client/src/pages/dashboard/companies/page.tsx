/* eslint-disable lingui/no-unlocalized-strings */
import { t } from "@lingui/macro";
import { List, SquaresFour } from "@phosphor-icons/react";
import type { activeInvitationsDTO } from "@reactive-resume/dto";
import { ScrollArea, Tabs, TabsContent, TabsList, TabsTrigger } from "@reactive-resume/ui";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { CompanyGridView } from "@/client/pages/dashboard/companies/_layouts/grid";
import { CompanyListView } from "@/client/pages/dashboard/companies/_layouts/list";
import { getActiveInvitations } from "@/client/services/company";
import { useAuthStore } from "@/client/stores/auth";

import Invitation from "../_components/invitation";

type Layout = "grid" | "list";

export const CompaniesPage = () => {
  const [layout, setLayout] = useState<Layout>("grid");
  const [invitations, setInvitations] = useState<activeInvitationsDTO[]>();
  const { user } = useAuthStore();

  const fetchInvitations = async () => {
    if (user) {
      const data = await getActiveInvitations(user.id);
      setInvitations(data);
    }
  };

  useEffect(() => {
    void fetchInvitations();
  }, [user]);

  if (!user) return;

  return (
    <div>
      <Helmet>
        <title>
          {t`Companies`} - {t`EzCV`}
        </title>
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
            {t`Companies`}
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

        {invitations && invitations.length > 0 && (
          <div className="fixed right-0 top-0 z-50 h-full w-80 overflow-y-auto border-l border-gray-800 p-6">
            <h1 className="mb-6 text-3xl font-bold text-white">Active Invitations</h1>
            <div className="max-w-lg">
              {invitations.map((invite: activeInvitationsDTO) => (
                <Invitation
                  key={invite.id}
                  companyMappingId={invite.id}
                  invitedAt={invite.invitedAt}
                  companyName={invite.company.name}
                  refreshInvitations={fetchInvitations}
                />
              ))}
            </div>
          </div>
        )}

        <ScrollArea
          allowOverflow
          className="h-[calc(100vh-140px)] overflow-visible lg:h-[calc(100vh-88px)]"
        >
          <TabsContent value="grid">
            <CompanyGridView />
          </TabsContent>
          <TabsContent value="list">
            <CompanyListView />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
