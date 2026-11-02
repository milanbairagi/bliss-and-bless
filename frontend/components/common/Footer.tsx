export function Footer() {
  return (
    <footer className="bg-brand text-ink">
      <div className="flex-col gap-4 px-5 py-10 mx-auto max-w-300 justify-between text-[15px] min-[721px]:flex-row min-[721px]:flex-wrap min-[721px]:items-center min-[721px]:px-8 flex items-start">
        <span className="font-display text-[22px] font-bold">
          Bless &amp; Bliss
        </span>
        <span>hello@blissandbless.com · [PHONE] · [CITY]</span>
        <nav
          className="flex-wrap gap-x-5 gap-y-3.5 flex"
          aria-label="Footer navigation"
        >
          <a href="#">Shipping</a>
          <a href="#">Care guide</a>
          <a href="#">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
