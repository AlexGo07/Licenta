export function SwipeGameSection() {
  return (
    <section id="arhiva" className="bg-surface-container-lowest px-8 py-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-headline text-5xl font-black">
            Fake sau Pe Bune?
          </h2>
          <p className="mx-auto max-w-2xl text-on-surface-variant">
            Antrenează-ți instinctul de supraviețuire digitală. Glisează stânga
            pentru minciuni gogonate, dreapta pentru adevăruri incomode.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-24">
          <button
            type="button"
            className="group hidden flex-col items-center md:flex"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-error transition-all group-hover:scale-110 group-hover:bg-error">
              <span className="material-symbols-outlined text-4xl text-error group-hover:text-on-error">
                close
              </span>
            </div>
            <span className="mt-4 font-label text-xs uppercase tracking-widest text-error">
              Fake
            </span>
          </button>

          <div className="relative aspect-[3/4] w-full max-w-[400px]">
            <div className="absolute inset-0 -rotate-3 translate-x-4 translate-y-4 rounded-xl border border-primary/20 bg-primary/10" />
            <div className="absolute inset-0 -rotate-1 translate-x-2 translate-y-2 rounded-xl border border-secondary/20 bg-secondary/10" />
            <div className="absolute inset-0 flex cursor-grab flex-col justify-between rounded-xl border border-outline-variant/30 bg-surface-container-high p-8 shadow-2xl transition-transform hover:scale-[1.02] active:cursor-grabbing">
              <div>
                <div className="mb-8 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-container-highest">
                    <span className="material-symbols-outlined text-primary">
                      news
                    </span>
                  </div>
                  <span className="rounded-full border border-tertiary/20 bg-tertiary/10 px-3 py-1 font-label text-[10px] uppercase tracking-tighter text-tertiary">
                    Viral pe WhatsApp
                  </span>
                </div>
                <h3 className="font-headline text-3xl font-bold leading-tight">
                  Primăria București a mutat orașul în Delta Dunării ca să scape
                  de trafic.
                </h3>
              </div>
              <div className="border-t border-outline-variant/20 pt-8">
                <p className="mb-4 font-body text-sm italic text-white/40">
                  &quot;Suntem primii din lume cu un oraș plutitor, restul e
                  cancan.&quot;
                </p>
                <div className="flex items-center justify-between font-label text-xs uppercase text-white/60">
                  <span>Sursa: Gogoașa.ro</span>
                  <span>Acum 2 ore</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="group hidden flex-col items-center md:flex"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-secondary transition-all group-hover:scale-110 group-hover:bg-secondary">
              <span className="material-symbols-outlined text-4xl text-secondary group-hover:text-on-secondary">
                check
              </span>
            </div>
            <span className="mt-4 font-label text-xs uppercase tracking-widest text-secondary">
              Real
            </span>
          </button>

          <div className="flex gap-8 md:hidden">
            <button type="button" className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-error">
                <span className="material-symbols-outlined text-3xl text-error">
                  close
                </span>
              </div>
            </button>
            <button type="button" className="flex flex-col items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-secondary">
                <span className="material-symbols-outlined text-3xl text-secondary">
                  check
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
