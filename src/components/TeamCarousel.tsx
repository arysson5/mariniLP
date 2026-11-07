import type React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type TeamPerson = {
  name: string;
  role: string;
  src: string;
};

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

function offsetFrom(index: number, current: number, total: number) {
  let offset = (index - current + total) % total;
  if (offset > Math.floor(total / 2)) offset -= total;
  return offset;
}

export function TeamCarousel({ people }: { people: TeamPerson[] }) {
  const [index, setIndex] = useState(() => Math.floor(people.length / 2));
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      setReduced(motion.matches);
      setFine(pointer.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    pointer.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      pointer.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (reduced || paused || people.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % people.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, people.length, reduced]);

  function step(direction: number) {
    setIndex((current) => (current + direction + people.length) % people.length);
  }

  // Swipe por toque: arrastar para o lado troca a pessoa, sem travar a rolagem vertical.
  const touch = useRef<{ x: number; y: number } | null>(null);
  function onTouchStart(event: React.TouchEvent) {
    const t = event.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
    setPaused(true);
  }
  function onTouchEnd(event: React.TouchEvent) {
    const start = touch.current;
    touch.current = null;
    setPaused(false);
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) step(dx < 0 ? 1 : -1);
  }

  return (
    <div
      className="relative mt-10 mb-12 h-[350px] w-full md:mt-14 md:h-[450px]"
      aria-roledescription="carrossel"
      onMouseEnter={() => {
        if (fine) setPaused(true);
      }}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={() => {
        touch.current = null;
        setPaused(false);
      }}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative flex h-full w-full items-center justify-center [perspective:1000px]">
        {people.map((person, personIndex) => {
          const offset = reduced ? (personIndex === index ? 0 : 2) : offsetFrom(personIndex, index, people.length);
          const active = offset === 0;
          const neighbor = Math.abs(offset) === 1;
          const hidden = Math.abs(offset) > 1;
          return (
            <div
              key={person.name}
              aria-hidden={active ? undefined : true}
              className="absolute flex h-[350px] w-56 items-center justify-center md:h-[450px] md:w-80"
              style={{
                transform: `translateX(${offset * 45}%) scale(${active ? 1 : neighbor ? 0.85 : 0.7}) rotateY(${offset * -10}deg)`,
                zIndex: active ? 10 : neighbor ? 5 : 1,
                opacity: active ? 1 : neighbor ? 0.4 : 0,
                filter: active ? "blur(0px)" : "blur(4px)",
                visibility: hidden ? "hidden" : "visible",
                transition: reduced
                  ? "none"
                  : "transform 500ms ease-in-out, opacity 500ms ease-in-out, filter 500ms ease-in-out",
              }}
            >
              <img
                src={person.src}
                alt={active ? `${person.name}, ${person.role}` : ""}
                className="h-full w-full rounded-3xl border-2 border-navy/10 object-cover object-top shadow-2xl"
              />
              {active && (
                <div className="absolute inset-x-0 bottom-0 rounded-b-3xl bg-gradient-to-t from-navy/85 via-navy/30 to-transparent px-4 pt-16 pb-5 text-left">
                  <p
                    key={person.role}
                    className={`font-sans text-sm text-white ${reduced ? "" : "animate-role-in"}`}
                  >
                    {person.role}
                  </p>
                  <p
                    className={`mt-1 font-display text-2xl font-semibold text-white ${
                      reduced ? "" : "animate-role-in [animation-delay:70ms]"
                    }`}
                  >
                    {person.name}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Pessoa anterior"
        onClick={() => step(-1)}
        className="absolute top-1/2 left-2 z-20 inline-flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-navy/15 bg-white/80 text-navy shadow-sm backdrop-blur-sm active:scale-95 sm:left-8"
        style={{ transition: `transform 160ms ${EASE}` }}
      >
        <ChevronLeft aria-hidden className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Próxima pessoa"
        onClick={() => step(1)}
        className="absolute top-1/2 right-2 z-20 inline-flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-navy/15 bg-white/80 text-navy shadow-sm backdrop-blur-sm active:scale-95 sm:right-8"
        style={{ transition: `transform 160ms ${EASE}` }}
      >
        <ChevronRight aria-hidden className="size-5" />
      </button>
      <div className="absolute inset-x-0 -bottom-10 flex justify-center gap-2">
        {people.map((person, personIndex) => (
          <button
            key={person.name}
            type="button"
            aria-label={`Ver ${person.name}`}
            aria-current={personIndex === index ? "true" : undefined}
            onClick={() => setIndex(personIndex)}
            className="flex h-6 touch-manipulation items-center px-1"
          >
            <span
              className="block h-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
              style={{
                width: personIndex === index ? 28 : 10,
                background: personIndex === index ? "#c35e5e" : "rgba(28,34,110,0.2)",
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
