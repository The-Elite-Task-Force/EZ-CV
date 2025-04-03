import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MetricsService } from "./metrics.service";

@ApiTags("Metrics")
@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  async getMetrics() {
    const metrics = await this.metricsService.getMetrics();
    console.log("Metrics endpoint", metrics);
    return metrics;
  }
}
