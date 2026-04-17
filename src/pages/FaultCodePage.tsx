import { Search, Sparkles, TriangleAlert } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { fetchFaultRecord, fetchOptions } from "@/lib/faultApi";
import { type BrandOption, type EngineOption, type FaultRecord, type ModelOption } from "@/lib/faultData";

function normalizeFaultCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function severityVariant(severity: FaultRecord["severity"]) {
  switch (severity) {
    case "high":
      return "destructive" as const;
    case "medium":
      return "warning" as const;
    default:
      return "success" as const;
  }
}

function severityLabel(severity: FaultRecord["severity"]) {
  switch (severity) {
    case "high":
      return "High attention";
    case "medium":
      return "Inspect soon";
    default:
      return "Routine";
  }
}

export default function FaultCodePage() {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [engines, setEngines] = useState<EngineOption[]>([]);
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [engineId, setEngineId] = useState("");
  const [faultCode, setFaultCode] = useState("P029900");
  const [result, setResult] = useState<FaultRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingResult, setLoadingResult] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchOptions()
      .then((data) => {
        if (!active) return;
        setBrands(data.brands);
        setModels(data.models);
        setEngines(data.engines);
        const firstBrand = data.brands[0]?.id ?? "";
        const firstModel = data.models.find((model) => model.brandId === firstBrand)?.id ?? data.models[0]?.id ?? "";
        const firstEngine = data.engines.find((engine) => engine.modelId === firstModel)?.id ?? data.engines[0]?.id ?? "";
        setBrandId(firstBrand);
        setModelId(firstModel);
        setEngineId(firstEngine);
      })
      .catch(() => {
        if (!active) return;
        setError("تعذر تحميل بيانات السيارة من قاعدة البيانات.");
      })
      .finally(() => {
        if (active) setLoadingOptions(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const availableModels = useMemo(() => models.filter((model) => model.brandId === brandId), [models, brandId]);
  const safeModelId = availableModels.some((model) => model.id === modelId) ? modelId : (availableModels[0]?.id ?? "");
  const availableEngines = useMemo(() => engines.filter((engine) => engine.modelId === safeModelId), [engines, safeModelId]);
  const safeEngineId = availableEngines.some((engine) => engine.id === engineId) ? engineId : (availableEngines[0]?.id ?? "");

  function handleBrandChange(nextBrandId: string) {
    const nextModelId = models.find((model) => model.brandId === nextBrandId)?.id ?? "";
    const nextEngineId = engines.find((engine) => engine.modelId === nextModelId)?.id ?? "";
    setBrandId(nextBrandId);
    setModelId(nextModelId);
    setEngineId(nextEngineId);
  }

  function handleModelChange(nextModelId: string) {
    const nextEngineId = engines.find((engine) => engine.modelId === nextModelId)?.id ?? "";
    setModelId(nextModelId);
    setEngineId(nextEngineId);
  }

  async function handleLookup() {
    setSearched(true);
    setError(null);
    setLoadingResult(true);
    try {
      const fetchedResult = await fetchFaultRecord({
        brandId,
        modelId: safeModelId,
        engineId: safeEngineId,
        faultCode,
      });
      setResult(fetchedResult);
    } catch {
      setResult(null);
      setError("تعذر جلب نتيجة الكود من قاعدة البيانات.");
    } finally {
      setLoadingResult(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Fault code visual locator</CardTitle>
          </div>
          <CardDescription>
            أدخل كود العطل، واختر السيارة، ليظهر لك شرح سريع وصورة القطعة وموقعها داخل السيارة من قاعدة بيانات حقيقية.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-4">
          <Field label="Brand">
            <Select value={brandId} onChange={(e) => handleBrandChange(e.target.value)} disabled={loadingOptions || brands.length === 0}>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </Select>
          </Field>

          <Field label="Model">
            <Select value={safeModelId} onChange={(e) => handleModelChange(e.target.value)} disabled={loadingOptions || availableModels.length === 0}>
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </Select>
          </Field>

          <Field label="Engine">
            <Select value={safeEngineId} onChange={(e) => setEngineId(e.target.value)} disabled={loadingOptions || availableEngines.length === 0}>
              {availableEngines.map((engine) => (
                <option key={engine.id} value={engine.id}>{engine.name}</option>
              ))}
            </Select>
          </Field>

          <Field label="Fault code">
            <div className="flex gap-2">
              <Input
                value={faultCode}
                onChange={(e) => setFaultCode(e.target.value)}
                placeholder="P029900"
                className="uppercase"
              />
              <Button onClick={() => void handleLookup()} disabled={loadingOptions || loadingResult || !brandId || !safeModelId || !safeEngineId}>
                {loadingResult ? "Searching..." : "Find"}
              </Button>
            </div>
          </Field>

          <div className="lg:col-span-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Real PostgreSQL dataset</Badge>
            <Badge variant="outline">API-driven lookup</Badge>
            <Badge variant="outline">Next step: admin panel + richer code library</Badge>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card>
          <CardContent className="flex items-start gap-3 p-6">
            <TriangleAlert className="mt-0.5 h-5 w-5 text-warning" />
            <div className="text-sm text-muted-foreground">{error}</div>
          </CardContent>
        </Card>
      ) : null}

      {result ? <FaultResultCard result={result} /> : null}

      {searched && !loadingResult && !result && !error ? (
        <Card>
          <CardContent className="flex items-start gap-3 p-6">
            <TriangleAlert className="mt-0.5 h-5 w-5 text-warning" />
            <div className="grid gap-2">
              <div className="font-medium">No matching record yet</div>
              <div className="text-sm text-muted-foreground">
                ما لقينا نتيجة للكود {normalizeFaultCode(faultCode)} ضمن قاعدة البيانات الحالية لنفس السيارة والمحرك.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function FaultResultCard({ result }: { result: FaultRecord }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <CardTitle>{result.faultCode}</CardTitle>
            <Badge variant={severityVariant(result.severity)}>{severityLabel(result.severity)}</Badge>
            <Badge variant="outline">{result.part.name}</Badge>
          </div>
          <CardDescription>{result.title}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <p className="text-sm leading-6 text-muted-foreground">{result.summary}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <ImagePanel title="Part image" description={result.part.description} imageUrl={result.part.imageUrl} />
            <ImagePanel title="Location inside vehicle" description={result.location.description} imageUrl={result.location.imageUrl} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Initial diagnostic guidance</CardTitle>
          </div>
          <CardDescription>هذا القسم يعطي الفني نقطة بداية سريعة قبل فتح مخططات أعمق أو PIWIS / ODIS / Xentry.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <BulletSection title="Likely causes" items={result.likelyCauses} />
          <BulletSection title="First checks" items={result.firstChecks} />
        </CardContent>
      </Card>
    </div>
  );
}

function ImagePanel({ title, description, imageUrl }: { title: string; description: string; imageUrl: string }) {
  return (
    <div className="grid gap-3">
      <div className="overflow-hidden border border-border bg-background/40">
        <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
      </div>
      <div className="grid gap-1">
        <div className="font-medium text-sm">{title}</div>
        <div className="text-sm text-muted-foreground leading-6">{description}</div>
      </div>
    </div>
  );
}

function BulletSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="grid gap-2">
      <div className="font-medium text-sm uppercase tracking-[0.12em] text-muted-foreground">{title}</div>
      <ul className="grid gap-2 text-sm leading-6 text-muted-foreground">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[0.55rem] h-1.5 w-1.5 rounded-full bg-foreground/50" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
