import { describe, expect, it } from "vitest";
import { buildApiUrl } from "./faultApi";

describe("buildApiUrl", () => {
  it("uses local relative /api when an empty base is forced", () => {
    expect(buildApiUrl("/options", "")).toBe("/api/options");
  });

  it("uses configured API base URL when present", () => {
    expect(buildApiUrl("/fault-record", "https://api.example.com")).toBe("https://api.example.com/fault-record");
  });
});
