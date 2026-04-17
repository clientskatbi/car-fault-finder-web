import { Pool } from "pg";
import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 9119);
const pool = new Pool({
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME ?? "car_fault_finder",
  user: process.env.DB_USER ?? "carfault",
  password: process.env.DB_PASSWORD ?? "",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

const app = createApp({
  pool,
  corsOrigin: process.env.CORS_ORIGIN?.split(",").map((value) => value.trim()).filter(Boolean) ?? true,
});

app.listen(port, () => {
  console.log(`car-fault-finder-api listening on ${port}`);
});
