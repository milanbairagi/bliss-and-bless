export function ContactSection() {
  return (
    <section
      className="flex-col gap-8 px-5 py-18 mx-auto max-w-300 justify-between min-[721px]:flex-row min-[721px]:flex-wrap min-[721px]:items-end min-[721px]:px-8 flex items-start"
      aria-labelledby="newsletter-title"
    >
      <div>
        <h2
          className="mb-2 mt-0 font-display text-[34px]"
          id="newsletter-title"
        >
          Hear about new pieces first
        </h2>
        <p className="m-0 text-muted">
          New bracelets, bead drops and seasonal scarves, sent to your inbox.
        </p>
      </div>
      <form className="flex-col gap-1 flex">
        <label className="text-[14px] font-medium" htmlFor="email">
          Email address
        </label>
        <div className="flex-wrap gap-3 flex items-end">
          <input
            className="px-4.5 min-h-12 w-full rounded-full border-2 border-ink bg-white font-body text-base min-[721px]:w-70"
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
          />
          <button
            className="px-7.5 min-h-12 justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
            type="submit"
          >
            Subscribe
          </button>
        </div>
      </form>
    </section>
  );
}
