import path from "node:path";

import { HttpException, Module } from "@nestjs/common";
import {
  APP_INTERCEPTOR,
  //, APP_PIPE
} from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { RavenInterceptor, RavenModule } from "nest-raven";

//import { ZodValidationPipe } from "nestjs-zod";
import { CompanyModule } from "@/server/company/company.module";

import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "./config/config.module";
import { ContributorsModule } from "./contributors/contributors.module";
import { DatabaseModule } from "./database/database.module";
import { FeatureModule } from "./feature/feature.module";
import { HealthModule } from "./health/health.module";
import { MailModule } from "./mail/mail.module";
import { MetricsModule } from "./metrics/metrics.module";
import { PrinterModule } from "./printer/printer.module";
import { ProjectModule } from "./project/project.module";
import { ProjectMappingModule } from "./projectMapping/project-mapping.module";
import { ResumeModule } from "./resume/resume.module";
import { SearchModule } from "./search/search.module";
import { SectionItemModule } from "./sectionItem/section-item.module";
import { StorageModule } from "./storage/storage.module";
import { TranslationModule } from "./translation/translation.module";
import { UserModule } from "./user/user.module";
import { VariantModule } from "./variant/variant.module";

@Module({
  imports: [
    // Core Modules
    ConfigModule,
    DatabaseModule,
    MailModule,
    RavenModule,
    HealthModule,

    // Feature Modules
    AuthModule.register(),
    UserModule,
    ResumeModule,
    StorageModule,
    PrinterModule,
    FeatureModule,
    TranslationModule,
    ContributorsModule,
    SectionItemModule,
    SearchModule,
    CompanyModule,
    ProjectModule,
    ProjectMappingModule,
    VariantModule,
    MetricsModule,
    VariantModule,
    // Static Assets
    ServeStaticModule.forRoot({
      serveRoot: "/artboard",
      // eslint-disable-next-line unicorn/prefer-module
      rootPath: path.join(__dirname, "..", "artboard"),
    }),
    ServeStaticModule.forRoot({
      renderPath: "/*",
      // eslint-disable-next-line unicorn/prefer-module
      rootPath: path.join(__dirname, "..", "client"),
    }),
  ],
  providers: [
    // TODO - Re-Implement ZodValidationPipe. It broke the publisher and volunteer section creations because it restructed the data while between the back- and frontend.

    // {
    //   provide: APP_PIPE,
    //   useClass: ZodValidationPipe,
    // },
    {
      provide: APP_INTERCEPTOR,
      useValue: new RavenInterceptor({
        filters: [
          // Filter all HttpException with status code <= 500
          {
            type: HttpException,
            filter: (exception: HttpException) => exception.getStatus() < 500,
          },
        ],
      }),
    },
  ],
})
export class AppModule {}
