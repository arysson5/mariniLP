import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

type NavItem = { href: string; label: string };

export function MenuToggle({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      className="relative -mr-2 inline-flex size-11 touch-manipulation items-center justify-center text-white md:hidden"
      aria-expanded={open}
      aria-controls="menu-mobile"
      aria-label={open ? "Fechar menu" : "Abrir menu"}
      onClick={onToggle}
    >
      <span aria-hidden className="relative block h-3.5 w-6">
        {[0, 1, 2].map((line) => (
          <span
            key={line}
            className="absolute left-0 block h-[2px] w-full rounded-full bg-current transition-[transform,opacity,top] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
            style={{
              top: open ? "6px" : `${line * 6}px`,
              opacity: open && line === 1 ? 0 : 1,
              transform: open ? `rotate(${line === 0 ? 45 : line === 2 ? -45 : 0}deg)` : "none",
            }}
          />
        ))}
      </span>
    </button>
  );
}

/** Trava a rolagem da página (funciona também no Safari do iOS). */
function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    const { body, documentElement } = document;
    const y = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: documentElement.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${y}px`;
    body.style.width = "100%";
    documentElement.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      documentElement.style.overflow = prev.overflow;
      window.scrollTo(0, y);
    };
  }, [locked]);
}

export function MobileMenu({
  open,
  items,
  onNavigate,
  onClose,
}: {
  open: boolean;
  items: NavItem[];
  onNavigate: (href: string) => void;
  onClose: () => void;
}) {
  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => {
      if (desktop.matches) onClose();
    };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-mobile"
          className="fixed inset-0 z-30 flex flex-col bg-navy px-5 pt-28 text-white md:hidden"
          style={{ paddingBottom: "max(7rem, calc(env(safe-area-inset-bottom) + 6rem))" }}
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <nav aria-label="Seções" className="flex flex-1 flex-col justify-center gap-1">
            {items.map((item, index) => (
              <motion.a
                key={item.href}
                href={item.href}
                className="group flex items-baseline gap-4 py-2 font-display text-4xl font-semibold"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.15 } }}
                transition={{ duration: 0.5, delay: 0.12 + index * 0.06, ease: EASE }}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(item.href);
                }}
              >
                <span className="font-sans text-sm font-medium text-coral">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="transition-transform duration-300 group-active:translate-x-1">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </nav>
          <motion.div
            className="border-t border-white/15 pt-6 font-sans text-sm leading-relaxed text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <p>Rua Maguatá, 50, São Paulo</p>
            <a className="underline decoration-coral underline-offset-4" href="mailto:contato@marinicasting.com.br">
              contato@marinicasting.com.br
            </a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
