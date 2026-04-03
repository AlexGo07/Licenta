export function TopNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-outline-variant/15 bg-black/70 shadow-[0_0_40px_rgba(202,152,255,0.1)] backdrop-blur-xl">
      <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between px-8">
        <div className="font-headline text-3xl font-black italic tracking-tighter text-primary">
          Gogoșometru
        </div>
        <div className="hidden items-center gap-12 font-label text-sm uppercase tracking-widest md:flex">
          <a
            className="border-b-4 border-secondary pb-1 text-secondary"
            href="#detect"
          >
            Detectează
          </a>
          <a
            className="text-white/70 transition-colors hover:scale-105 hover:text-secondary"
            href="#cum-functioneaza"
          >
            Cum Funcționează
          </a>
          <a
            className="text-white/70 transition-colors hover:scale-105 hover:text-secondary"
            href="#arhiva"
          >
            Arhivă
          </a>
        </div>
        <button
          type="button"
          className="rounded-xl bg-primary px-8 py-3 font-headline font-bold text-on-primary transition-all hover:scale-105 active:scale-95"
        >
          Descarcă
        </button>
      </div>
    </nav>
  );
}
