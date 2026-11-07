import { asset } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

type Place = {
  id: string;
  name: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  anchor: "start" | "middle" | "end";
  wrap?: boolean;
};

export const places: Place[] = [
  { id: "sp", name: "São Paulo", x: 59.5, y: 64.09, dx: -2.2, dy: -1.6, anchor: "end" },
  { id: "rj", name: "Rio de Janeiro", x: 68, y: 63.22, dx: 2.2, dy: 1.8, anchor: "start" },
  { id: "mg", name: "Minas Gerais", x: 68, y: 58.02, dx: -2, dy: -1.4, anchor: "end" },
  { id: "es", name: "Espírito Santo", x: 73.5, y: 57.16, dx: 1.8, dy: -2.4, anchor: "start", wrap: true },
  { id: "pr", name: "Paraná", x: 54.5, y: 69.28, dx: -2, dy: 0.8, anchor: "end" },
  { id: "sc", name: "Santa Catarina", x: 55.5, y: 74.48, dx: 2, dy: 0.7, anchor: "start" },
  { id: "rs", name: "Rio Grande do Sul", x: 52, y: 80.54, dx: 2, dy: 0.9, anchor: "start" },
  { id: "ms", name: "Mato Grosso do Sul", x: 48.5, y: 58.89, dx: -2, dy: 0.7, anchor: "end" },
  { id: "mt", name: "Mato Grosso", x: 46.5, y: 46.77, dx: -2, dy: 0.7, anchor: "end" },
  { id: "df", name: "Distrito Federal", x: 61, y: 47.63, dx: 2, dy: 0.7, anchor: "start" },
  { id: "ba", name: "Bahia", x: 77.5, y: 39.84, dx: -2.2, dy: 0.7, anchor: "end" },
  { id: "al", name: "Alagoas", x: 83.5, y: 32.91, dx: -2.2, dy: 0.8, anchor: "end" },
  { id: "pe", name: "Pernambuco", x: 84, y: 28.58, dx: -2.2, dy: 0.2, anchor: "end" },
  { id: "ce", name: "Ceará", x: 76.5, y: 19.05, dx: 2, dy: 0.7, anchor: "start" },
  { id: "ma", name: "Maranhão", x: 65.5, y: 17.32, dx: 0, dy: -2.2, anchor: "middle" },
  { id: "pa", name: "Pará", x: 59.5, y: 13.86, dx: -2, dy: 0.7, anchor: "end" },
  { id: "am", name: "Amazonas", x: 31, y: 18.19, dx: 2.2, dy: 0.7, anchor: "start" },
];

export const placeNames = places.map((place) => place.name);

const hub = places[0];
const routes = places.slice(1);

function curve(from: Place, to: Place) {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const lift = Math.min(length * 0.28, 14);
  const nx = -dy / length;
  const ny = dx / length;
  const sign = ny > 0 ? -1 : 1;
  return `M ${from.x} ${from.y} Q ${midX + nx * lift * sign} ${midY + ny * lift * sign} ${to.x} ${to.y}`;
}

export function BrazilMap() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative">
        <img
          src={asset("midias/mapa/brasil.svg")}
          alt=""
          className="block h-auto w-full"
        />
        <svg
          viewBox="0 0 86 90"
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={`Estados atendidos: ${placeNames.join(", ")}`}
        >
          <defs>
            <linearGradient id="rota-brasil" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C35E5E" stopOpacity="0" />
              <stop offset="18%" stopColor="#C35E5E" stopOpacity="1" />
              <stop offset="82%" stopColor="#C35E5E" stopOpacity="1" />
              <stop offset="100%" stopColor="#C35E5E" stopOpacity="0" />
            </linearGradient>
          </defs>
          {routes.map((place, index) => (
            <motion.path
              key={place.id}
              d={curve(hub, place)}
              fill="none"
              stroke="url(#rota-brasil)"
              strokeWidth="0.32"
              strokeLinecap="round"
              initial={{ pathLength: reduced ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 1.15,
                      delay: 0.2 + index * 0.14,
                      ease: EASE,
                      repeat: Infinity,
                      repeatType: "loop",
                      repeatDelay: 2.4,
                    }
              }
            />
          ))}
          {places.map((place) => (
            <g key={place.id}>
              <circle cx={place.x} cy={place.y} r="0.72" fill="#C35E5E" />
              {!reduced && (
                <circle cx={place.x} cy={place.y} r="0.72" fill="#C35E5E" opacity="0.45">
                  <animate
                    attributeName="r"
                    values="0.72;2.6"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.45;0"
                    dur="1.8s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              <text
                x={place.x + place.dx}
                y={place.y + place.dy}
                textAnchor={place.anchor}
                fill="#1C226E"
                fontFamily="Hind, sans-serif"
                fontSize="1.85"
                fontWeight="600"
                className="max-sm:hidden"
              >
                {place.wrap
                  ? place.name.split(" ").map((word, line) => (
                      <tspan key={word} x={place.x + place.dx} dy={line === 0 ? 0 : 2}>
                        {word}
                      </tspan>
                    ))
                  : place.name}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ul className="mt-6 flex flex-wrap gap-2 sm:hidden" aria-hidden>
        {places.map((place) => (
          <li
            key={place.id}
            className="rounded-full border border-navy/15 bg-white/70 px-3 py-1 font-sans text-xs font-medium text-navy"
          >
            <span className="mr-1.5 inline-block size-1.5 -translate-y-px rounded-full bg-coral" />
            {place.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
