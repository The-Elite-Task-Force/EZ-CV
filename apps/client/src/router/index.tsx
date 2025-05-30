import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router";

import { CompaniesPage } from "@/client/pages/dashboard/companies/page";
import { CompanyPage } from "@/client/pages/dashboard/company/page";
import { ErrorPage } from "@/client/pages/dashboard/publicpage/error";
import { companyLoader } from "@/client/router/loaders/company";

import { BackupOtpPage } from "../pages/auth/backup-otp/page";
import { ForgotPasswordPage } from "../pages/auth/forgot-password/page";
import { AuthLayout } from "../pages/auth/layout";
import { LoginPage } from "../pages/auth/login/page";
import { RegisterPage } from "../pages/auth/register/page";
import { ResetPasswordPage } from "../pages/auth/reset-password/page";
import { VerifyEmailPage } from "../pages/auth/verify-email/page";
import { VerifyOtpPage } from "../pages/auth/verify-otp/page";
import { BuilderLayout } from "../pages/builder/layout";
import { builderLoader, BuilderPage } from "../pages/builder/page";
import { DashboardLayout } from "../pages/dashboard/layout";
import { ProjectsPage } from "../pages/dashboard/projects/page";
import { ResumesPage } from "../pages/dashboard/resumes/page";
import { SearchPage } from "../pages/dashboard/search/page";
import { SettingsPage } from "../pages/dashboard/settings/page";
import { HomeLayout } from "../pages/home/layout";
import { HomePage } from "../pages/home/page";
import { PublicProfilePage } from "../pages/profilepage/page";
import { ProjectPage } from "../pages/projects/page";
import { ProjectPageLayout } from "../pages/projects/project-layout";
import { ProjectManagePage } from "../pages/projects/project-manage";
import { VariantBuilderLayout } from "../pages/variant-builder/layout";
import { variantBuilderLoader, VariantBuilderPage } from "../pages/variant-builder/page";
import { Providers } from "../providers";
import { AuthGuard } from "./guards/auth";
import { GuestGuard } from "./guards/guest";
import { authLoader } from "./loaders/auth";
import { publicProfileLoader } from "./loaders/public";

export const routes = createRoutesFromElements(
  <Route element={<Providers />}>
    <Route errorElement={<ErrorPage />}>
      <Route element={<HomeLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      <Route path="auth">
        <Route element={<AuthLayout />}>
          <Route element={<GuestGuard />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>

          {/* Password Recovery */}
          <Route element={<GuestGuard />}>
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Two-Factor Authentication */}
          <Route element={<GuestGuard />}>
            <Route path="verify-otp" element={<VerifyOtpPage />} />
            <Route path="backup-otp" element={<BackupOtpPage />} />
          </Route>

          {/* Email Verification */}
          <Route element={<AuthGuard />}>
            <Route path="verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* OAuth Callback */}
          <Route path="callback" loader={authLoader} element={<div />} />
        </Route>

        <Route index element={<Navigate replace to="/auth/login" />} />
      </Route>

      <Route path="dashboard">
        <Route element={<AuthGuard />}>
          <Route element={<DashboardLayout />}>
            <Route path="company/:id" loader={companyLoader} element={<CompanyPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="resumes" element={<ResumesPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="search" element={<SearchPage />} /> {/* Add the new search route */}
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="projects/:id" element={<ProjectPageLayout />}>
              <Route index element={<ProjectPage />} />
              <Route path="manage" element={<ProjectManagePage />} />
            </Route>
            <Route index element={<Navigate replace to="/dashboard/resumes" />} />
          </Route>
        </Route>
      </Route>

      <Route path="builder">
        <Route element={<AuthGuard />}>
          <Route element={<BuilderLayout />}>
            <Route path=":id" loader={builderLoader} element={<BuilderPage />} />

            <Route index element={<Navigate replace to="/dashboard/resumes" />} />
          </Route>
        </Route>
      </Route>
      <Route path="variantBuilder">
        <Route element={<AuthGuard />}>
          <Route element={<VariantBuilderLayout />}>
            <Route path=":id" loader={variantBuilderLoader} element={<VariantBuilderPage />} />

            <Route index element={<Navigate replace to="/dashboard/resumes" />} />
          </Route>
        </Route>
      </Route>
      {/* Public Routes */}
      <Route
        path="publicprofile/:username"
        loader={publicProfileLoader}
        element={<PublicProfilePage />}
      />
    </Route>
  </Route>,
);

export const router = createBrowserRouter(routes);
