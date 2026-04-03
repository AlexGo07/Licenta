export function SiteFooter() {
  return (
    <footer className="mt-24 w-full rounded-t-[3rem] bg-surface-container-high px-8 py-12">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center justify-between gap-8 md:flex-row">
        <div className="flex flex-col gap-2">
          <div className="font-headline text-2xl font-bold uppercase italic tracking-tighter text-primary">
            Gogoșometru
          </div>
          <p className="font-label text-sm uppercase tracking-widest text-white/40">
            © 2024 Detector de Gogoși. Creat cu mult zahăr și cinism.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8 font-label text-sm uppercase tracking-widest">
          <a
            className="text-white/40 transition-colors hover:text-white"
            href="#"
          >
            Termeni de Utilizare
          </a>
          <a
            className="text-white/40 transition-colors hover:text-white"
            href="#"
          >
            Politica de Confidențialitate
          </a>
          <a className="text-secondary underline" href="#">
            Contact Nutriționist
          </a>
        </div>
        <div className="flex gap-6">
          <span className="material-symbols-outlined cursor-pointer text-primary transition-all hover:scale-125">
            public
          </span>
          <span className="material-symbols-outlined cursor-pointer text-primary transition-all hover:scale-125">
            share
          </span>
          <span className="material-symbols-outlined cursor-pointer text-primary transition-all hover:scale-125">
            alternate_email
          </span>
        </div>
      </div>
    </footer>
  );
}
