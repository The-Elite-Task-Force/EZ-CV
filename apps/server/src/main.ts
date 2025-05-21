import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import type { NextFunction, Request, Response } from "express";
import session from "express-session";
import helmet from "helmet";
import { patchNestJsSwagger } from "nestjs-zod";
import client from "prom-client";

// eslint-disable-next-line @nx/enforce-module-boundaries
import { seedDatabase } from "../../../tools/prisma/seed"; // adjust relative path as needed
import { AppModule } from "./app.module";
import type { Config } from "./config/schema";
import { MetricsService } from "./metrics/metrics.service";

patchNestJsSwagger();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === "development" ? ["debug"] : ["error", "warn", "log"],
  });

  const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "code"],
    registers: [MetricsService.register],
  });

  const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const end = httpRequestDuration.startTimer();
    res.on("finish", () => {
      end({
        method: req.method,
        route: req.route?.path || req.path,
        code: res.statusCode.toString(),
      });
    });
    next();
  };

  MetricsService.register.registerMetric(httpRequestDuration);
  client.collectDefaultMetrics({ register: MetricsService.register });

  app.use(metricsMiddleware);

  const configService = app.get(ConfigService<Config>);

  const accessTokenSecret = configService.getOrThrow("ACCESS_TOKEN_SECRET");
  const publicUrl = configService.getOrThrow("PUBLIC_URL");
  const isHTTPS = publicUrl.startsWith("https://") ?? false;

  // Cookie Parser
  app.use(cookieParser());

  // Session
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: accessTokenSecret,
      cookie: { httpOnly: true, secure: isHTTPS },
    }),
  );

  // CORS
  app.enableCors({ credentials: true, origin: isHTTPS });

  // Helmet - enabled only in production
  if (isHTTPS) app.use(helmet({ contentSecurityPolicy: false }));

  // Global Prefix
  const globalPrefix = "api";
  app.setGlobalPrefix(globalPrefix);

  // Enable Shutdown Hooks
  app.enableShutdownHooks();

  // Swagger (OpenAPI Docs)
  // This can be accessed by visiting {SERVER_URL}/api/docs
  const config = new DocumentBuilder()
    .setTitle("EZ CV")
    .setDescription(
      "Ez CV is a free and open source resume builder that's built to make the mundane tasks of creating, updating and sharing your resume as easy as 1, 2, 3.",
    )
    .addCookieAuth("Authentication", { type: "http", in: "cookie", scheme: "Bearer" })
    .setVersion("4.0.0")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document);

  // Running seeds on startup, adds the roles to the database on startup
  try {
    Logger.log("Seeding database on startup...");
    await seedDatabase();
    Logger.log("Database seeding completed.");
  } catch (error) {
    Logger.error("Database seeding failed:", error);
  }

  // Port
  const port = configService.get<number>("PORT") ?? 3000;

  await app.listen(port);

  Logger.log(`🚀 Server is up and running on port ${port}`, "Bootstrap");
}

// eslint-disable-next-line unicorn/prefer-top-level-await
void bootstrap();
