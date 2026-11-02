"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import Lenis from "lenis";

export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const title = "floriva";
  const letters = title.split("");

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll
    let lenis: Lenis | null = null;
    let updateLenis: ((time: number) => void) | null = null;

    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      updateLenis = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn("Lenis initialization skipped:", e);
    }

    // 2. Query DOM directly within containerRef — completely immune to React StrictMode ref dropping!
    const ctx = gsap.context(() => {
      // Atmospheric ambient settle for the photographic background plate
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 1.05,
            filter: "brightness(0.92)",
          },
          {
            scale: 1,
            filter: "brightness(1)",
            duration: 2.2,
            ease: "power3.out",
          }
        );
      }

      // Smooth & heavy letter emergence from down to up
      const chars = containerRef.current?.querySelectorAll<HTMLElement>(".char-inner");
      const wrappers = containerRef.current?.querySelectorAll<HTMLElement>(".char-wrapper");

      if (chars && chars.length > 0) {
        gsap.fromTo(
          chars,
          {
            yPercent: 125,
            opacity: 0,
            scaleY: 1.15,
          },
          {
            yPercent: 0,
            opacity: 1,
            scaleY: 1,
            duration: 1.45,
            stagger: 0.065,
            ease: "power4.out",
            delay: 0.15,
            onComplete: () => {
              // Ensure zero clipping once the reveal locks into place
              wrappers?.forEach((el) => {
                el.style.overflow = "visible";
              });
            },
          }
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      if (updateLenis) gsap.ticker.remove(updateLenis);
      lenis?.destroy();
    };
  }, []);

  return (
    <main
      ref={containerRef}
      className="hero-container"
      aria-label="floriva showcase hero"
    >
      {/* Photographic Hero Background Plate */}
      <div className="hero-media-wrapper">
        <Image
          ref={imageRef}
          src="/assets/hero.png"
          alt="floriva photographic landscape"
          fill
          priority
          quality={95}
          sizes="100vw"
          className="hero-bg-image"
        />
      </div>

      {/* Hero Heading Layer */}
      <div className="hero-heading-wrapper">
        <h1 className="hero-title" aria-label={title}>
          {letters.map((char, index) => (
            <span
              key={`${char}-${index}`}
              className="char-wrapper"
              aria-hidden="true"
            >
              <span className="char-inner">
                {char}
              </span>
            </span>
          ))}
        </h1>
      </div>
    </main>
  );
}
