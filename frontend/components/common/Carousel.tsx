"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type CarouselProps = {
  children: ReactNode;
  itemClassName: string;
  ariaLabel: string;
  previousLabel: string;
  nextLabel: string;
};

export function Carousel({
  children,
  itemClassName,
  ariaLabel,
  previousLabel,
  nextLabel,
}: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const childItems = Children.toArray(children);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const updateScrollButtons = () => {
      setCanScrollPrevious(viewport.scrollLeft > 2);
      setCanScrollNext(
        viewport.scrollLeft + viewport.clientWidth < viewport.scrollWidth - 2,
      );
    };

    updateScrollButtons();
    viewport.addEventListener("scroll", updateScrollButtons);
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      viewport.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [childItems.length]);

  const scroll = (direction: "previous" | "next") => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const card = viewport.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = Number.parseFloat(getComputedStyle(viewport).columnGap) || 24;
    const distance = card ? card.offsetWidth + gap : viewport.clientWidth * 0.8;

    viewport.scrollBy({
      left: direction === "next" ? distance : -distance,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="mb-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => scroll("previous")}
          disabled={!canScrollPrevious}
          className="inline-flex size-12 items-center justify-center rounded-full border border-[#d9b9c1] bg-white text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={previousLabel}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-5 fill-none stroke-current stroke-2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll("next")}
          disabled={!canScrollNext}
          className="inline-flex size-12 items-center justify-center rounded-full border border-[#d9b9c1] bg-white text-ink transition disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={nextLabel}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="size-5 fill-none stroke-current stroke-2"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        ref={viewportRef}
        className="flex touch-pan-x gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label={ariaLabel}
      >
        {childItems.map((child, index) => (
          <div
            key={index}
            data-carousel-card
            className={`shrink-0 snap-start ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
