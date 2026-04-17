import { CarFront, Search, Wrench } from "lucide-react";
import FaultCodePage from "@/pages/FaultCodePage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card shadow-sm">
              <CarFront className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">Car Fault Finder</div>
              <div className="text-sm text-muted-foreground">Visual fault-code lookup for premium vehicles</div>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <Badge variant="outline">Web MVP</Badge>
            <Button variant="outline" size="sm" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}>
              Start lookup
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div className="grid gap-6">
            <Badge variant="outline" className="w-fit">Porsche demo • fault code to part location</Badge>
            <div className="grid gap-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-6xl">
                Enter a fault code and instantly see the likely part and where it sits in the car.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                Built for workshops, diagnostics specialists, and premium-car technicians. The current MVP starts with Porsche and shows a practical example for code P029900.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <FeaturePill icon={Search} text="Fast fault lookup" />
              <FeaturePill icon={CarFront} text="Vehicle-aware selection" />
              <FeaturePill icon={Wrench} text="Part image + location map" />
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_0_0_1px_rgba(0,0,0,0.02),0_18px_60px_-24px_rgba(15,23,42,0.25)]">
            <div className="grid gap-3">
              <div className="text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground">How it works</div>
              <ol className="grid gap-4 text-sm leading-7 text-muted-foreground">
                <li><span className="font-medium text-foreground">1.</span> Select brand, model, and engine.</li>
                <li><span className="font-medium text-foreground">2.</span> Enter the DTC / fault code exactly as read by the diagnostic tool.</li>
                <li><span className="font-medium text-foreground">3.</span> Get the likely part, location image, common causes, and first inspection steps.</li>
              </ol>
              <div className="rounded-2xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
                Next milestone: admin panel + Supabase knowledge base + support for more brands and codes.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
          <FaultCodePage />
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <span>Car Fault Finder MVP</span>
          <span>Porsche demo dataset • visual diagnostics workflow</span>
        </div>
      </footer>
    </div>
  );
}

function FeaturePill({ icon: Icon, text }: { icon: typeof Search; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground shadow-sm">
      <Icon className="h-4 w-4 text-foreground" />
      <span>{text}</span>
    </div>
  );
}
