import { asset } from "@/lib/utils";
import { useEffect, useRef } from "react";
import gsap from "gsap";

type LogoIntroProps = {
  onDone: () => void;
};

function strokeOf(el: SVGElement) {
  if (el.classList.contains("st0")) return "#C35E5E";
  if (el.classList.contains("st1")) return "#F4E4E4";
  return "#FFFFFF";
}

function fillOf(el: SVGElement) {
  if (el.classList.contains("st0")) return "#C35E5E";
  if (el.classList.contains("st1")) return "#F7F4F1";
  return "#FFFFFF";
}

export function LogoIntro({ onDone }: LogoIntroProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const mark = markRef.current;
    const headerLogo = document.getElementById("header-logo");
    const hero = document.getElementById("hero-copy");
    if (!overlay || !mark || !headerLogo || !hero) {
      onDone();
      return;
    }

    gsap.set(headerLogo, { opacity: 0 });

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let cancelled = false;
    let timeline: gsap.core.Timeline | null = null;

    fetch(asset("midias/marca/logo_marini-01.svg"))
      .then((response) => response.text())
      .then((svg) => {
        if (cancelled) return;
        mark.innerHTML = svg;
        const root = mark.querySelector("svg");
        if (!root) {
          onDone();
          return;
        }
        root.setAttribute("width", "100%");
        root.setAttribute("height", "100%");
        root.style.display = "block";
        root.querySelector("style")?.remove();

        const shapes = [...root.querySelectorAll("path, rect")] as SVGGeometryElement[];
        const corners = shapes.filter((el) => el.tagName === "rect");
        const letters = shapes.filter((el) => el.tagName === "path");

        shapes.forEach((el) => {
          const len = el.getTotalLength();
          el.setAttribute("fill", "none");
          el.setAttribute("stroke", strokeOf(el));
          el.setAttribute("stroke-width", "8");
          el.setAttribute("stroke-linecap", "square");
          el.setAttribute("stroke-linejoin", "miter");
          el.style.strokeDasharray = `${len}`;
          el.style.strokeDashoffset = `${len}`;
        });

        const width = Math.min(window.innerWidth * 0.72, 520);
        const startX = (window.innerWidth - width) / 2;
        const startY = (window.innerHeight - width) / 2;
        gsap.set(mark, {
          position: "fixed",
          left: 0,
          top: 0,
          width,
          height: width,
          x: startX,
          y: startY,
          zIndex: 70,
        });
        gsap.set(hero, { opacity: 0, y: 16, scale: 0.98 });

        const last = headerLogo.getBoundingClientRect();
        const scale = Math.max(last.width / width, 0.08);
        gsap.set(headerLogo, { opacity: 0 });

        const tl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = previousOverflow;
            gsap.set(headerLogo, { opacity: 1 });
            sessionStorage.setItem("marini-intro", "1");
            onDone();
          },
        });

        tl.to(
          corners,
          { strokeDashoffset: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" },
          0,
        );
        tl.to(
          letters,
          { strokeDashoffset: 0, duration: 1.35, stagger: 0.025, ease: "power3.out" },
          0.25,
        );
        tl.add(() => {
          shapes.forEach((el) => {
            el.style.fill = fillOf(el);
            el.style.stroke = "none";
          });
        });
        tl.to({}, { duration: 0.28 });
        tl.to(
          mark,
          {
            x: last.left,
            y: last.top,
            scale,
            duration: 0.7,
            ease: "power3.out",
            transformOrigin: "0 0",
          },
          ">",
        );
        tl.to(overlay, { opacity: 0, duration: 0.28, ease: "power3.out" }, "-=0.28");
        tl.to(
          hero,
          { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" },
          "<",
        );
        tl.to(mark, { opacity: 0, duration: 0.2, ease: "power3.out" }, "-=0.12");
        timeline = tl;
      })
      .catch(() => {
        document.body.style.overflow = previousOverflow;
        onDone();
      });

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      timeline?.kill();
      gsap.set(headerLogo, { clearProps: "opacity" });
    };
  }, [onDone]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[60] bg-navy"
      role="presentation"
    >
      <div ref={markRef} aria-hidden />
    </div>
  );
}
