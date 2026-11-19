"use client";

import Link from "next/link";
import { useState } from "react";
import { useBag } from "./BagProvider";

export function Header() {
  const { itemCount } = useBag();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-brand text-ink">
      <div className="mx-auto flex max-w-300 items-center justify-between gap-4 px-5 py-4.5 min-[721px]:flex-row min-[721px]:flex-wrap min-[721px]:items-center min-[721px]:px-8">
        <Link
          className="font-display text-lg md:text-[26px] font-bold"
          href="/"
          aria-label="Bless and Bliss home"
          onClick={() => setIsMenuOpen(false)}
        >
          Bless &amp; Bliss
        </Link>
        <nav
          className={`${isMenuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-4 border-t border-ink/15 bg-brand px-5 py-5 min-[721px]:static min-[721px]:flex min-[721px]:flex-row min-[721px]:flex-wrap min-[721px]:gap-x-7 min-[721px]:gap-y-3.5 min-[721px]:border-0 min-[721px]:bg-transparent min-[721px]:p-0`}
          id="main-navigation"
          aria-label="Main navigation"
        >
          <NavLink href="/products" onClick={() => setIsMenuOpen(false)}>
            Shop All
          </NavLink>
          <NavLink
            href="/products?category=bracelet"
            onClick={() => setIsMenuOpen(false)}
          >
            Bracelets
          </NavLink>
          <NavLink
            href="/products?category=bead"
            onClick={() => setIsMenuOpen(false)}
          >
            Beads
          </NavLink>
          <NavLink
            href="/products?category=scarf"
            onClick={() => setIsMenuOpen(false)}
          >
            Scarves
          </NavLink>
          <NavLink
            href="/products?category=glove"
            onClick={() => setIsMenuOpen(false)}
          >
            Gloves
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5.5 text-[15px] font-bold text-cream"
            href="/bag"
          >
            Bag ({itemCount})
          </Link>
          <button
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink text-ink min-[721px]:hidden"
            type="button"
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              {isMenuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link className="text-[15px] font-medium" href={href} onClick={onClick}>
      {children}
    </Link>
  );
};
