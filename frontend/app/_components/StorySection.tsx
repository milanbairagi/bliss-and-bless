export function StorySection() {
  return (
    <section className="bg-accent" id="story" aria-labelledby="story-title">
      <div className="grid gap-10 px-5 py-18 mx-auto max-w-300 min-[721px]:grid-cols-[repeat(auto-fit,minmax(300px,1fr))] min-[721px]:px-8 items-center">
        <h2
          className="m-0 font-display text-[44px] leading-[1.1]"
          id="story-title"
        >
          Made by hand, meant to be shared.
        </h2>
        <p className="m-0 text-[19px]">
          We believe the best things carry a little of the maker with them.
          Every piece is chosen, threaded, knitted or woven with care, then sent
          out into the world to become part of your story.
        </p>
      </div>
    </section>
  );
}
