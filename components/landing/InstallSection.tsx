import Image from "next/image";

const INSTALL_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuHxOtU16KjfZpX7SRQq7NvWZLHgFhLAEIlp-0oBvOt_HwwNFUa9Isv-GyaGqY0CRVwNmL4MSe38UMmJmcKyRSsQRmIX_w82WNb6MBXs9gVHQQICwtECk4SFbZtOMcgOgibZgNuTAfDzHR8caiSsKXEMz7jh9jj8vft8nypNemvfJUSV_EdmD9X_EzgrC0wAzF6BhlkX2NtR1rVOSreZj4P2Ta35c1nEtpQDPQkIdfNQtXVWzzfD_LTrpxg3V9PN--KCD3icSYK4JD";

export function InstallSection() {
  return (
    <section
      id="cum-functioneaza"
      className="mx-auto max-w-[1200px] px-8 py-24"
    >
      <div className="grid items-center gap-16 md:grid-cols-2">
        <div>
          <h2 className="mb-12 font-headline text-5xl font-black leading-tight">
            Cum te protejezi în 3 pași simpli
          </h2>
          <div className="space-y-12">
            <div className="group flex gap-8">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary font-headline text-xl font-black text-on-primary transition-transform group-hover:scale-110">
                1
              </div>
              <div>
                <h4 className="mb-2 font-headline text-xl font-bold uppercase">
                  Instalează
                </h4>
                <p className="text-white/60">
                  Descarcă extensia din Chrome Web Store sau Firefox Add-ons.
                </p>
              </div>
            </div>
            <div className="group flex gap-8">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-secondary font-headline text-xl font-black text-on-secondary transition-transform group-hover:scale-110">
                2
              </div>
              <div>
                <h4 className="mb-2 font-headline text-xl font-bold uppercase">
                  Navighează
                </h4>
                <p className="text-white/60">
                  Gogoșometru scanează automat paginile pe care le vizitezi.
                </p>
              </div>
            </div>
            <div className="group flex gap-8">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-tertiary font-headline text-xl font-black text-on-tertiary transition-transform group-hover:scale-110">
                3
              </div>
              <div>
                <h4 className="mb-2 font-headline text-xl font-bold uppercase">
                  Fii Deștept
                </h4>
                <p className="text-white/60">
                  Primești alerte instantanee când o știre pare prea
                  &quot;dulce&quot; ca să fie adevărată.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="flex aspect-square w-full items-center justify-center rounded-[3rem] border-2 border-dashed border-outline-variant bg-surface-container-high p-12">
            <Image
              src={INSTALL_IMAGE}
              alt="Instalare facilă — lupă futuristă deasupra unei tastaturi digitale"
              width={600}
              height={600}
              className="rounded-xl shadow-2xl grayscale transition-all duration-1000 hover:grayscale-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
