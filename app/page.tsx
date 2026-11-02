"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const iylSectionRef = useRef<HTMLElement>(null);

  const heroTitle = "floriva";
  const heroLetters = heroTitle.split("");

  const spookyQuotes = [
    {
      text: "the grass hides what the earth refuses to bury.",
      className: "quote-1",
    },
    {
      text: "the trees have eyes, and the night has a face.",
      className: "quote-2",
    },
    {
      text: "somewhere in the distance, a figure waits.",
      className: "quote-3",
    },
    {
      text: "you just weren't supposed to notice.",
      className: "quote-4",
    },
  ];

  useEffect(() => {
    // 1. Initialize Lenis smooth scroll
    let lenis: Lenis | null = null;
    let updateLenis: ((time: number) => void) | null = null;

    try {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
      });

      lenis.on("scroll", ScrollTrigger.update);

      updateLenis = (time: number) => {
        lenis?.raf(time * 1000);
      };

      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);
    } catch (e) {
      console.warn("Lenis initialization skipped:", e);
    }

    // 2. GSAP context for safe cleanup in Next.js
    const ctx = gsap.context(() => {
      // Hero image ambient settle
      if (heroImageRef.current) {
        gsap.fromTo(
          heroImageRef.current,
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

      // Hero letters heavy reveal
      const heroChars = containerRef.current?.querySelectorAll<HTMLElement>(".char-inner");
      const heroWrappers = containerRef.current?.querySelectorAll<HTMLElement>(".char-wrapper");

      if (heroChars && heroChars.length > 0) {
        gsap.fromTo(
          heroChars,
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
              heroWrappers?.forEach((el) => {
                el.style.overflow = "visible";
              });
            },
          }
        );
      }

      // Section 2 trigger: starts immediately as user scrolls from hero into Section 2
      if (iylSectionRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: iylSectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        // Step 1: Heavy image arrival with mass and smooth deceleration
        tl.fromTo(
          ".card-ifl-1",
          { y: -180, opacity: 0, scale: 1.08, rotate: 2.5 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "power4.out" },
          0
        )
        .fromTo(
          ".card-ifl-2",
          { y: -180, opacity: 0, scale: 1.08, rotate: -2.5 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "power4.out" },
          0.06
        )
        .fromTo(
          ".card-ifl-3",
          { y: 180, opacity: 0, scale: 1.08, rotate: -2 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "power4.out" },
          0.12
        )
        .fromTo(
          ".card-ifl-4",
          { y: 180, opacity: 0, scale: 1.08, rotate: 2 },
          { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1.4, ease: "power4.out" },
          0.18
        )
        // Step 2: THEN the text comes in smoothly after the images arrive!
        .fromTo(
          ".spooky-quote",
          { opacity: 0, y: 16 },
          { opacity: 0.7, y: 0, duration: 1.0, stagger: 0.08, ease: "power3.out" },
          0.75
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (updateLenis) gsap.ticker.remove(updateLenis);
      lenis?.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#020704]">
      {/* SECTION 1: HERO (100dvh) */}
      <section className="hero-container" aria-label="floriva showcase hero">
        <div className="hero-media-wrapper">
          <Image
            ref={heroImageRef}
            src="/assets/hero.png"
            alt="floriva photographic landscape"
            fill
            priority
            quality={95}
            sizes="100vw"
            className="hero-bg-image"
          />
        </div>

        <div className="hero-heading-wrapper">
          <h1 className="hero-title" aria-label={heroTitle}>
            {heroLetters.map((char, index) => (
              <span
                key={`${char}-${index}`}
                className="char-wrapper"
                aria-hidden="true"
              >
                <span className="char-inner">{char}</span>
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* SECTION 2: IF YOU LISTEN (100dvh - SIMPLE SECTION, ZERO EMPTY SPACE) */}
      <section
        ref={iylSectionRef}
        className="iyl-section"
        aria-label="if you listen gallery"
      >
        {/* Background Plate */}
        <div className="iyl-bg-wrapper">
          <Image
            src="/assets/if-you-listen/if-you-listen.png"
            alt="spooky forest background"
            fill
            quality={95}
            sizes="100vw"
            className="iyl-bg-image"
          />
          <div className="iyl-vignette" />
          <div className="iyl-top-blend" />
        </div>

        {/* Slim Top-Right Heading */}
        <header className="iyl-header">
          <h2 className="iyl-title">if you listen</h2>
        </header>

        {/* Floating Spooky Text Fragments (Meticulously Placed with Zero Overlap) */}
        {spookyQuotes.map((quote, idx) => (
          <p key={idx} className={`spooky-quote ${quote.className}`}>
            {quote.text}
          </p>
        ))}

        {/* Photographic Stage */}
        <div className="iyl-stage">
          {/* Center (Static - Does Not Move): IFL-5 */}
          <div className="photo-card card-ifl-5">
            <Image
              src="/assets/if-you-listen/IFL-5.png"
              alt="winged figure in silent meadow"
              fill
              sizes="(max-width: 768px) 40vw, 240px"
              className="photo-img"
            />
          </div>

          {/* Left Higher: IFL-2 (Glides in from Top) */}
          <div className="photo-card card-ifl-2">
            <Image
              src="/assets/if-you-listen/IFL-2.png"
              alt="picnic figure under tree with eyes"
              fill
              sizes="(max-width: 768px) 30vw, 195px"
              className="photo-img"
            />
          </div>

          {/* Left Lower: IFL-4 (Glides in from Bottom) */}
          <div className="photo-card card-ifl-4">
            <Image
              src="/assets/if-you-listen/IFL-4.png"
              alt="red figure in nocturnal meadow"
              fill
              sizes="(max-width: 768px) 30vw, 180px"
              className="photo-img"
            />
          </div>

          {/* Right Higher: IFL-1 (Glides in from Top) */}
          <div className="photo-card card-ifl-1">
            <Image
              src="/assets/if-you-listen/IFL-1.png"
              alt="tangled forest emerald hands"
              fill
              sizes="(max-width: 768px) 25vw, 165px"
              className="photo-img"
            />
          </div>

          {/* Right Lower: IFL-3 (Glides in from Bottom) */}
          <div className="photo-card card-ifl-3">
            <Image
              src="/assets/if-you-listen/IFL-3.png"
              alt="nocturnal moth on ancient branch"
              fill
              sizes="(max-width: 768px) 25vw, 170px"
              className="photo-img"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
