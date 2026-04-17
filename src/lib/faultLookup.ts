import { BRANDS, ENGINES, FAULT_RECORDS, MODELS, type FaultRecord } from "./faultData";

export interface FaultLookupInput {
  brandId: string;
  modelId: string;
  engineId: string;
  faultCode: string;
}

export function normalizeFaultCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

export function findFaultRecord(input: FaultLookupInput): FaultRecord | null {
  const normalizedCode = normalizeFaultCode(input.faultCode);

  return (
    FAULT_RECORDS.find(
      (record) =>
        record.brandId === input.brandId &&
        record.modelId === input.modelId &&
        record.engineId === input.engineId &&
        record.faultCode === normalizedCode,
    ) ?? null
  );
}

export function getModelsForBrand(brandId: string) {
  return MODELS.filter((model) => model.brandId === brandId);
}

export function getEnginesForModel(modelId: string) {
  return ENGINES.filter((engine) => engine.modelId === modelId);
}

export { BRANDS, MODELS, ENGINES };
