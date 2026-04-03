import { SideModels3D } from "./SideModels3D";

export function AnalyzerSection() {
  return (
    <section id="detect" className="mx-auto max-w-[1200px] px-8 py-24">
      <div className="relative">
        <SideModels3D />
        <div className="relative z-10 overflow-hidden rounded-xl bg-surface-container-high p-8 md:p-16">
        <div className="absolute right-0 top-0 p-8">
          <span className="material-symbols-outlined text-9xl text-primary/10">
            search_spark
          </span>
        </div>
        <h2 className="mb-4 font-headline text-4xl font-black md:text-5xl">
          Gogoșometru v2.1
        </h2>
        <p className="mb-12 font-label uppercase tracking-widest text-secondary">
          Analizor de Text în Timp Real
        </p>
        <div className="relative z-10 space-y-8">
          <div className="group">
            <textarea
              className="min-h-[200px] w-full rounded-xl border-none bg-surface-variant p-8 font-body text-xl placeholder:text-white/20 focus:border-b-4 focus:border-secondary focus:ring-0"
              placeholder="Inserează aici snippet-ul de știre suspectă..."
            />
          </div>
          <div className="flex flex-col items-center gap-8 md:flex-row">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-secondary px-12 py-5 font-headline text-xl font-black text-on-secondary transition-all hover:scale-105 active:scale-95 md:w-auto"
            >
              <span className="material-symbols-outlined">security</span>
              Verifică
            </button>
            <div className="w-full flex-grow">
              <div className="mb-4 flex justify-between font-label text-xs uppercase text-white/40">
                <span>Real</span>
                <span className="text-tertiary">Gogoașă Înfuriată</span>
              </div>
              <div className="h-6 w-full overflow-hidden rounded-full bg-surface-container-lowest p-1">
                <div className="donut-gradient group relative h-full w-[75%] rounded-full">
                  <div className="absolute inset-0 animate-pulse bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
