import cors from "cors";
import express from "express";
import { getFaultRecord, listOptions } from "./faultService.js";

export function createApp({ pool, corsOrigin = true }) {
  const app = express();

  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get("/api/health", async (_req, res) => {
    await pool.query("select 1");
    res.json({ ok: true });
  });

  app.get("/api/options", async (_req, res) => {
    const options = await listOptions(pool);
    res.json(options);
  });

  app.get("/api/fault-record", async (req, res) => {
    const brandId = String(req.query.brandId ?? "");
    const modelId = String(req.query.modelId ?? "");
    const engineId = String(req.query.engineId ?? "");
    const faultCode = String(req.query.faultCode ?? "");

    if (!brandId || !modelId || !engineId || !faultCode) {
      return res.status(400).json({ error: "brandId, modelId, engineId, and faultCode are required" });
    }

    const record = await getFaultRecord(pool, { brandId, modelId, engineId, faultCode });
    if (!record) {
      return res.status(404).json({ error: "not_found" });
    }

    return res.json(record);
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ error: "internal_error" });
  });

  return app;
}
