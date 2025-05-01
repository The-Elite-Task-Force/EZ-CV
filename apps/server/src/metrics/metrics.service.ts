import { Injectable } from "@nestjs/common";
import client from "prom-client";

@Injectable()
export class MetricsService {
  static readonly register: client.Registry<"text/plain; version=0.0.4; charset=utf-8"> =
    new client.Registry();

  async getMetrics() {
    return await MetricsService.register.metrics();
  }
}
