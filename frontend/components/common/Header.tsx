import Link from "next/link";

export function Header() {
  return (
    <header className="bg-brand text-ink">
      <div className="flex-col gap-4 px-5 py-4.5 mx-auto max-w-300 justify-between min-[721px]:flex-row min-[721px]:flex-wrap min-[721px]:items-center min-[721px]:px-8 flex items-start">
        <Link
          className="font-display text-[26px] font-bold"
          href="/"
          aria-label="Bless and Bliss home"
        >
          Bless &amp; Bliss
        </Link>
        <nav
          className="flex-wrap gap-x-5 gap-y-3.5 min-[721px]:gap-7 flex"
          aria-label="Main navigation"
        >
          <a className="text-[15px] font-medium" href="#">
            Bracelets
          </a>
          <a className="text-[15px] font-medium" href="#">
            Beads
          </a>
          <a className="text-[15px] font-medium" href="#">
            Scarves
          </a>
          <a className="text-[15px] font-medium" href="#">
            Gloves
          </a>
          <a className="text-[15px] font-medium" href="#">
            Our story
          </a>
        </nav>
        <a
          className="px-5.5 min-h-11 justify-center rounded-full bg-ink text-[15px] font-bold text-cream inline-flex items-center"
          href="#"
        >
          Bag (0)
        </a>
      </div>
    </header>
  );
}
