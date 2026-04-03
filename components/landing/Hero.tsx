export function Hero() {
  return (
    <section className="relative mx-auto flex min-h-[921px] max-w-[1440px] items-center px-8 py-24">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="z-10">
          <h1 className="mb-8 font-headline text-6xl font-black leading-none tracking-tighter md:text-8xl">
            NU MAI <span className="italic text-secondary">ÎNGHIȚI</span>
            <br />
            GOGOȘI!
          </h1>
          <p className="mb-12 max-w-xl font-body text-xl text-on-surface-variant md:text-2xl">
            Extensia de browser care depistează știrile false mai repede decât
            bunicul pe Facebook. Oprim zahărul din presă înainte să faci diabet
            mediatic.
          </p>
          <div className="flex flex-wrap gap-6">
            <button
              type="button"
              className="flex items-center gap-4 rounded-xl bg-primary px-10 py-5 font-headline text-xl font-black text-on-primary shadow-[0_0_30px_rgba(202,152,255,0.3)] transition-transform hover:scale-105"
            >
              <span className="material-symbols-outlined">extension</span>
              Descarcă Extensia
            </button>
            <div className="flex items-center gap-3 font-label uppercase tracking-tighter text-secondary">
              <span className="material-symbols-outlined">check_circle</span>
              100% Acid Sarcastic
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block" aria-hidden="true">
          <div className="absolute -inset-4 rounded-full bg-primary/15 blur-[120px]" />
        </div>
      </div>
    </section>
  );
}
