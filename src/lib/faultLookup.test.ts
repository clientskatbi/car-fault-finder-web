import { describe, expect, it } from "vitest";
import { findFaultRecord } from "./faultLookup";

describe("findFaultRecord", () => {
  it("returns a Porsche P029900 record when brand, model, engine, and code match", () => {
    const result = findFaultRecord({
      brandId: "porsche",
      modelId: "cayenne",
      engineId: "4.0t-v8",
      faultCode: "P029900",
    });

    expect(result).not.toBeNull();
    expect(result?.title).toContain("Underboost");
    expect(result?.part.name).toContain("Turbo");
  });

  it("normalizes fault code formatting before lookup", () => {
    const result = findFaultRecord({
      brandId: "porsche",
      modelId: "cayenne",
      engineId: "4.0t-v8",
      faultCode: "p0299 00",
    });

    expect(result?.faultCode).toBe("P029900");
  });

  it("returns null when the engine does not match", () => {
    const result = findFaultRecord({
      brandId: "porsche",
      modelId: "cayenne",
      engineId: "3.0t-v6",
      faultCode: "P029900",
    });

    expect(result).toBeNull();
  });
});
