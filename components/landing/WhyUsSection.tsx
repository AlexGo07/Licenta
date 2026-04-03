export function WhyUsSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-24">
      <h2 className="mb-16 text-center font-headline text-4xl font-black md:text-5xl">
        De ce să ne alegi?
      </h2>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border-b-8 border-primary bg-surface-container p-12 transition-transform hover:-translate-y-4">
          <span className="material-symbols-outlined mb-8 text-6xl text-primary">
            psychology
          </span>
          <h3 className="mb-4 font-headline text-2xl font-bold">
            Antrenat pe milioane de postări
          </h3>
          <p className="font-body text-on-surface-variant">
            AI-ul nostru a citit tot internetul românesc, de la forumuri obscure
            până la grupurile de mămici. Știe exact cum miroase o gogoașă
            proaspătă.
          </p>
        </div>
        <div className="rounded-lg border-b-8 border-secondary bg-surface-container p-12 transition-transform hover:-translate-y-4">
          <span className="material-symbols-outlined mb-8 text-6xl text-secondary">
            biotech
          </span>
          <h3 className="mb-4 font-headline text-2xl font-bold">
            Depistează manipularea subtilă
          </h3>
          <p className="font-body text-on-surface-variant">
            Nu doar știri false, ci și clickbait-uri obosite sau titluri care
            promit mult și nu spun nimic. Filtrul tău de bun simț digital.
          </p>
        </div>
        <div className="rounded-lg border-b-8 border-tertiary bg-surface-container p-12 transition-transform hover:-translate-y-4">
          <span className="material-symbols-outlined mb-8 text-6xl text-tertiary">
            celebration
          </span>
          <h3 className="mb-4 font-headline text-2xl font-bold">100% Gratis</h3>
          <p className="font-body text-on-surface-variant">
            Adevărul nu ar trebui să coste. Suntem aici ca să facem internetul
            un loc mai puțin ridicol, fără subscripții ascunse.
          </p>
        </div>
      </div>
    </section>
  );
}
