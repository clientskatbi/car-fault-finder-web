import { describe, expect, it } from "vitest";
import { mapFaultRecordRow, normalizeFaultCode } from "./faultService.js";

describe("faultService", () => {
  it("normalizes incoming fault code values", () => {
    expect(normalizeFaultCode("p0299 00")).toBe("P029900");
  });

  it("maps a database row to the frontend shape", () => {
    const mapped = mapFaultRecordRow({
      brand_id: "porsche",
      model_id: "cayenne",
      engine_id: "4.0t-v8",
      fault_code: "P029900",
      title: "Turbocharger / Supercharger Underboost",
      summary: "summary",
      severity: "high",
      part_name: "Turbocharger assembly + wastegate actuator",
      part_image_url: "/demo/turbocharger-assembly.svg",
      part_description: "part description",
      location_image_url: "/demo/cayenne-engine-bay-location.svg",
      location_description: "location description",
      likely_causes: ["cause one"],
      first_checks: ["check one"],
    });

    expect(mapped.faultCode).toBe("P029900");
    expect(mapped.part.name).toBe("Turbocharger assembly + wastegate actuator");
    expect(mapped.location.imageUrl).toBe("/demo/cayenne-engine-bay-location.svg");
  });
});
