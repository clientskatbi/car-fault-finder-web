import type { BrandOption, EngineOption, FaultRecord, ModelOption } from "./faultData";

export interface FaultApiOptions {
  brands: BrandOption[];
  models: ModelOption[];
  engines: EngineOption[];
}

export interface FaultLookupInput {
  brandId: string;
  modelId: string;
  engineId: string;
  faultCode: string;
}

const DEFAULT_PUBLIC_API_BASE_URL = "https://annual-tears-sample-admission.trycloudflare.com";

export function buildApiUrl(
  path: string,
  base = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? DEFAULT_PUBLIC_API_BASE_URL,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const apiPath = `/api${normalizedPath}`;
  if (!base) {
    return apiPath;
  }
  return `${base.replace(/\/$/, "")}${apiPath}`;
}

export async function fetchOptions(): Promise<FaultApiOptions> {
  const response = await fetch(buildApiUrl("/options"));
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }
  return response.json() as Promise<FaultApiOptions>;
}

export async function fetchFaultRecord(input: FaultLookupInput): Promise<FaultRecord | null> {
  const url = new URL(buildApiUrl("/fault-record"), window.location.origin);
  url.searchParams.set("brandId", input.brandId);
  url.searchParams.set("modelId", input.modelId);
  url.searchParams.set("engineId", input.engineId);
  url.searchParams.set("faultCode", input.faultCode);

  const response = await fetch(url.toString());
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error("Failed to fetch fault record");
  }
  return response.json() as Promise<FaultRecord>;
}
