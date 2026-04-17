export interface BrandOption {
  id: string;
  name: string;
}

export interface ModelOption {
  id: string;
  brandId: string;
  name: string;
}

export interface EngineOption {
  id: string;
  modelId: string;
  name: string;
}

export interface FaultRecord {
  brandId: string;
  modelId: string;
  engineId: string;
  faultCode: string;
  title: string;
  summary: string;
  severity: "low" | "medium" | "high";
  part: {
    name: string;
    imageUrl: string;
    description: string;
  };
  location: {
    imageUrl: string;
    description: string;
  };
  likelyCauses: string[];
  firstChecks: string[];
}

export const BRANDS: BrandOption[] = [
  { id: "porsche", name: "Porsche" },
];

export const MODELS: ModelOption[] = [
  { id: "cayenne", brandId: "porsche", name: "Cayenne" },
];

export const ENGINES: EngineOption[] = [
  { id: "4.0t-v8", modelId: "cayenne", name: "4.0T V8" },
  { id: "3.0t-v6", modelId: "cayenne", name: "3.0T V6" },
];

export const FAULT_RECORDS: FaultRecord[] = [
  {
    brandId: "porsche",
    modelId: "cayenne",
    engineId: "4.0t-v8",
    faultCode: "P029900",
    title: "Turbocharger / Supercharger Underboost",
    summary:
      "انخفاض ضغط البوست عن القيمة المتوقعة. في هذا الـ MVP نعرض القطعة المرجحة الأولى ومكانها التقريبي داخل حجرة المحرك.",
    severity: "high",
    part: {
      name: "Turbocharger assembly + wastegate actuator",
      imageUrl: "/demo/turbocharger-assembly.svg",
      description:
        "المنطقة الأكثر احتمالاً للفحص هي مجموعة التيربو مع الأكتيويتر والتمديدات المرتبطة بالضغط والهواء.",
    },
    location: {
      imageUrl: "/demo/cayenne-engine-bay-location.svg",
      description:
        "في Cayenne 4.0T V8 يكون الوصول غالباً من المنطقة الخلفية الجانبية للمحرك قرب مجاري العادم والأنابيب الضاغطة، ويختلف الوصول النهائي حسب التجهيز.",
    },
    likelyCauses: [
      "تسريب في charge pipe أو hose",
      "خلل في wastegate actuator",
      "ضعف قراءة حساس ضغط البوست",
      "تيربو لا يبني ضغطه بشكل صحيح",
    ],
    firstChecks: [
      "فحص live data للـ requested boost مقابل actual boost",
      "تفقد hoses والوصلات لأي تهريب أو تشقق",
      "فحص حركة الـ wastegate actuator",
      "مراجعة أي أكواد داعمة مرتبطة بالـ boost pressure sensor أو air path",
    ],
  },
];
