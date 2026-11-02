export function HeroSection() {
  return (
    <section
      className="grid gap-12 px-5 py-12 mx-auto max-w-300 min-[721px]:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] min-[721px]:px-8 min-[721px]:py-18 items-center"
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="flex-col gap-6 flex items-start">
        <p className="m-0 text-[14px] font-bold text-[#8a3b2e] uppercase tracking-[0.12em]">
          Handmade ornaments &amp; warm things
        </p>
        <h1
          className="m-0 max-w-162.5 font-display text-[clamp(52px,6vw,68px)] font-bold leading-[1.1]"
          id="hero-title"
        >
          Little things, made with care.
        </h1>
        <p className="m-0 max-w-120 text-xl text-muted">
          Bracelets, loose beads, scarves and gloves, each piece threaded,
          knitted or woven for you to wear and to give.
        </p>
        <div className="flex-wrap gap-4 flex">
          <a
            className="px-7.5 min-h-12 justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
            href="#shop"
          >
            Shop the collection
          </a>
          <a
            className="px-7.5 min-h-12 justify-center rounded-full border-2 border-ink bg-transparent font-bold text-ink inline-flex items-center"
            href="#story"
          >
            Meet the makers
          </a>
        </div>
      </div>
      <div
        className="min-h-85 overflow-hidden rounded-4xl bg-[#f3ddd6] min-[721px]:min-h-105 relative"
        aria-hidden="true"
      >
        <div className="top-[10%] rounded-full bg-accent absolute left-[12%] size-65" />
        <div className="top-[24%] rounded-full bg-red absolute right-[10%] size-45" />
        <div className="bottom-[12%] rounded-full bg-ink absolute left-[46%] size-30" />
        <div className="bottom-[14%] rounded-full bg-sage absolute left-[14%] size-17.5" />
        <div className="bottom-[20%] rounded-full bg-white absolute right-[22%] size-11" />
        <span className="bottom-5 text-[13px] font-medium text-muted absolute left-6">
          [HERO PHOTO: bracelets &amp; beads]
        </span>
      </div>
    </section>
  );
}
