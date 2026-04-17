import { describe, expect, it } from "vitest";
import { buildApiUrl } from "./faultApi";

describe("buildApiUrl", () => {
  it("uses local relative /api by default", () => {
    expect(buildApiUrl("/options")).toBe("/api/options");
  });

  it("uses configured VITE_API_BASE_URL when present", () => {
    expect(buildApiUrl("/fault-record", "https://api.example.com")).toBe("https://api.example.com/fault-record");
  });
});
