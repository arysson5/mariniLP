import { liquidMetalFragmentShader, ShaderMount } from "@paper-design/shaders";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

interface LiquidMetalButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

export function LiquidMetalButton({
  label = "Solicitar orçamento",
  onClick,
  className,
  icon,
}: LiquidMetalButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [fine, setFine] = useState(false);
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const shaderRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<ShaderMount | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleId = useRef(0);
  const hoveredRef = useRef(false);

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
    const parent = shaderRef.current;
    if (!parent) return;

    const mount = new ShaderMount(
      parent,
      liquidMetalFragmentShader,
      {
        u_repetition: 4,
        u_softness: 0.5,
        u_shiftRed: 0.72,
        u_shiftBlue: -0.28,
        u_distortion: 0,
        u_contour: 0,
        u_angle: 45,
        u_scale: 8,
        u_shape: 1,
        u_offsetX: 0.1,
        u_offsetY: -0.1,
      },
      undefined,
      reduced ? 0 : 0.6,
    );
    mountRef.current = mount;

    return () => {
      mount.dispose();
      mountRef.current = null;
    };
  }, [reduced]);

  const showHover = fine && !reduced;

  function handleEnter() {
    if (!showHover) return;
    hoveredRef.current = true;
    setHovered(true);
    mountRef.current?.setSpeed(1);
  }

  function handleLeave() {
    hoveredRef.current = false;
    setHovered(false);
    setPressed(false);
    if (!reduced) mountRef.current?.setSpeed(0.6);
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (!reduced && mountRef.current) {
      mountRef.current.setSpeed(2.4);
      window.setTimeout(() => {
        mountRef.current?.setSpeed(hoveredRef.current ? 1 : 0.6);
      }, 300);
    }

    if (!reduced && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const ripple = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        id: rippleId.current++,
      };
      setRipples((prev) => [...prev, ripple]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((item) => item.id !== ripple.id));
      }, 600);
    }

    onClick?.();
  }

  const shadow = pressed
    ? "0 1px 2px rgba(18, 22, 72, 0.45)"
    : hovered && showHover
      ? "0 14px 30px rgba(195, 94, 94, 0.55), 0 4px 10px rgba(18, 22, 72, 0.3)"
      : "0 10px 22px rgba(195, 94, 94, 0.38), 0 2px 6px rgba(18, 22, 72, 0.28)";

  const lifted = hovered && showHover;

  return (
    <div
      className={cn("group/cta relative inline-grid h-[52px] min-w-[14rem]", className)}
      style={{
        transform: pressed ? "scale(0.97)" : lifted ? "translateY(-2px)" : "none",
        transition: `transform 220ms ${EASE}, box-shadow 220ms ${EASE}`,
        boxShadow: shadow,
        borderRadius: 999,
      }}
    >
      {!reduced && (
        <span aria-hidden className="cta-halo pointer-events-none absolute inset-0 rounded-full" />
      )}
      <div
        ref={shaderRef}
        className="shader-container-exploded absolute inset-0 overflow-hidden rounded-full"
        aria-hidden
      />
      <div className="pointer-events-none relative z-10 m-[2px] flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-br from-[#de7a78] via-coral to-[#9a4244] px-7">
        {!reduced && <span aria-hidden className="cta-shine absolute inset-y-0 w-1/3" />}
        <span className="relative font-sans text-[0.95rem] font-semibold tracking-wide whitespace-nowrap text-white drop-shadow-[0_1px_1px_rgba(18,22,72,0.35)]">
          {label}
        </span>
        <span
          aria-hidden
          className="relative inline-flex size-6 items-center justify-center rounded-full bg-white/20"
          style={{
            transform: lifted ? "translateX(3px)" : "none",
            transition: `transform 220ms ${EASE}`,
          }}
        >
          {icon ?? <ArrowRight className="size-3.5 text-white" strokeWidth={2.5} />}
        </span>
      </div>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onPointerDown={() => setPressed(true)}
        onPointerUp={() => setPressed(false)}
        onPointerCancel={() => setPressed(false)}
        className="absolute inset-0 z-20 cursor-pointer touch-manipulation rounded-full border-0 bg-transparent"
        aria-label={label}
      >
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="liquid-ripple pointer-events-none absolute size-5 rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              background:
                "radial-gradient(circle, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 70%)",
              animation: `liquid-ripple 600ms ${EASE}`,
            }}
          />
        ))}
      </button>
    </div>
  );
}
