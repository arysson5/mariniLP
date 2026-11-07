import { useEffect, useId, useRef, type RefObject } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { asset, cn } from "@/lib/utils";

gsap.registerPlugin(DrawSVGPlugin, ScrollTrigger);

// Traço central da assinatura (extraído do PNG), na ordem da escrita.
// Serve de máscara: o DrawSVG desenha o traço e revela a tinta original.
const STROKES = [
  "M57.3 31.3 L61.0 17.0 L62.0 15.0 L61.7 15.7 L64.7 13.3 L65.7 14.3 L66.0 19.0 L64.7 77.7 L65.0 80.0 L66.0 81.0 L65.7 95.0",
  "M66.0 81.3 L68.7 79.3 L74.7 48.7 L77.7 37.3 L81.0 28.7 L80.7 29.7 L83.7 27.3 L84.3 28.0 L84.7 62.0 L86.3 70.0 L88.3 70.7 L90.3 69.3 L96.0 42.3 L101.7 23.3 L107.0 11.7 L109.0 10.0 L111.0 9.7 L112.3 11.3 L113.7 18.7 L112.7 68.0 L113.0 89.7 L114.3 108.0",
  "M122.3 77.7 L123.3 73.7 L126.3 69.3 L129.7 66.3 L132.3 66.3 L133.0 67.3 L132.0 72.0 L130.0 73.0 L126.7 76.7 L122.7 78.0",
  "M129.0 74.0 L131.7 72.3 L132.3 73.0 L132.7 77.3 L134.0 78.3 L137.0 78.0 L141.7 74.7 L144.7 73.7 L144.7 74.3 L146.0 61.7 L147.7 57.7",
  "M144.0 92.7 L144.3 85.3 L146.0 78.7 L144.7 77.0 L144.7 74.3",
  "M146.0 78.3 L149.3 77.0 L161.0 65.3 L165.0 63.0",
  "M170.7 82.0 L170.3 70.7 L171.0 65.0 L172.3 62.7",
  "M170.7 82.0 L172.7 86.0 L175.7 85.7 L178.7 83.3 L187.3 70.7 L185.3 66.7 L186.3 62.0 L190.7 57.0 L192.7 56.7 L193.3 57.3",
  "M183.0 111.0 L182.7 109.0 L183.7 104.0 L187.3 96.7 L194.7 87.3 L198.0 87.0 L197.3 96.3 L193.0 107.3 L188.0 112.7 L185.0 113.0 L183.0 111.0 L183.7 112.0",
  "M186.3 72.7 L187.3 71.3 L187.0 72.0 L187.3 71.3 L189.7 72.0 L193.7 76.0 L196.0 79.3 L196.7 82.0 L198.0 82.7 L197.7 86.7",
  "M197.7 83.0 L200.7 82.0 L213.3 71.7 L216.7 71.0 L216.3 77.7 L220.3 76.7 L223.0 73.3 L225.7 72.0 L226.7 66.7 L224.0 66.0 L217.0 71.3 L220.0 68.7",
  "M225.0 72.7 L226.0 73.0 L226.3 77.0 L228.0 78.3 L232.0 77.3 L237.3 73.3",
  "M263.3 31.3 L263.7 27.3 L267.7 15.0 L267.3 15.7 L270.3 13.3 L271.7 16.7 L270.3 67.7 L270.7 78.3 L271.7 79.3 L272.0 81.7 L271.3 95.0",
  "M271.7 79.3 L274.7 77.7 L279.7 51.7 L283.7 36.7 L286.7 28.7 L288.7 27.3 L290.3 27.7 L290.3 62.0 L292.3 70.3 L294.3 70.7 L295.7 70.0 L297.0 66.3 L302.0 41.3 L308.0 21.7 L313.0 11.3 L314.7 10.0 L317.3 10.0 L318.3 12.0 L319.3 18.3 L318.3 76.3 L320.0 107.7",
  "M328.3 77.3 L329.3 73.3 L331.3 70.3 L336.0 66.0 L338.0 66.0 L338.7 67.0 L337.7 72.0 L335.7 73.0 L332.7 76.3 L328.7 77.7",
  "M337.0 72.7 L338.0 73.0 L338.3 77.0 L340.0 78.3 L342.7 78.0 L347.3 74.7 L350.7 74.0 L350.7 73.3 L350.7 77.3 L351.7 78.3 L350.7 82.7 L349.7 92.7",
  "M350.7 73.3 L352.0 61.0 L353.0 58.7",
  "M351.7 78.3 L355.0 77.3 L361.3 70.3 L361.0 71.0 L365.3 66.7 L369.7 63.7",
  "M376.0 70.7 L376.0 80.3 L377.3 85.0 L378.3 86.0 L382.0 85.3 L388.0 78.7 L390.0 77.7 L390.7 79.7 L389.7 87.7 L390.3 88.3 L392.7 87.3 L395.7 79.0 L399.3 71.7 L398.7 73.3",
  "M376.0 70.3 L377.0 64.0 L378.0 62.7",
  "M390.0 77.7 L394.0 69.7",
  "M399.3 71.3 L401.3 68.7 L403.0 68.0 L404.0 68.7 L404.0 76.3 L405.0 81.3 L407.0 85.3 L409.7 87.0 L414.0 86.7 L420.0 83.3 L426.7 78.0 L426.3 78.7 L430.0 77.0 L431.7 85.3 L432.3 86.0 L435.7 85.7 L439.7 82.0 L445.7 73.7",
  "M430.0 77.0 L430.7 66.3 L432.3 62.0",
  "M171.8 51.0 L174.2 51.0",
  "M377.8 51.0 L380.2 51.0",
  "M431.8 51.0 L434.2 51.0",
];

type SignatureProps = {
  className?: string;
  /** Elemento cujo hover redesenha a assinatura. */
  hoverTarget?: RefObject<HTMLElement | null>;
};

export function Signature({ className, hoverTarget }: SignatureProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const maskId = `assinatura-${useId().replace(/:/g, "")}`;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const paths = Array.from(svg.querySelectorAll<SVGPathElement>("mask path"));
    const ctx = gsap.context(() => {
      gsap.set(paths, { drawSVG: "0%" });
      const tl = gsap.timeline({ paused: true });
      paths.forEach((path) => {
        const length = path.getTotalLength();
        tl.to(path, {
          drawSVG: "100%",
          duration: Math.max(0.08, length / 420),
          ease: "power1.inOut",
        });
      });

      ScrollTrigger.create({
        trigger: svg,
        start: "top 85%",
        once: true,
        refreshPriority: -1,
        onEnter: () => tl.play(0),
      });

      const target = hoverTarget?.current;
      const replay = () => {
        if (tl.isActive() || tl.progress() < 1) return;
        tl.play(0);
      };
      target?.addEventListener("mouseenter", replay);
      return () => target?.removeEventListener("mouseenter", replay);
    }, svg);

    return () => ctx.revert();
  }, [hoverTarget]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 501 130"
      className={cn("h-16 w-auto", className)}
      role="img"
      aria-label="Assinatura de Marisa Marini"
    >
      <defs>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="501" height="130">
          {STROKES.map((d, index) => (
            <path
              key={index}
              d={d}
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </mask>
      </defs>
      <image
        href={asset("midias/time/Marisa-Marini.png")}
        width="501"
        height="130"
        mask={`url(#${maskId})`}
      />
    </svg>
  );
}
