import { Controller, Get, Header } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { MetricsService } from "./metrics.service";

@ApiTags("Metrics")
@Controller("metrics")
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain') 
  async getMetrics() {
    const metrics = await this.metricsService.getMetrics();
    return metrics;
  }
}
