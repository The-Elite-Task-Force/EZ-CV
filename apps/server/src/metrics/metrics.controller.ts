import { Controller, Get, Header } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MetricsService } from "./metrics.service";

@ApiTags("Metrics")
@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header("Content-Type", "text/plain")
  async getMetrics() {
    return await this.metricsService.getMetrics();
  }
}
