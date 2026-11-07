import { useEffect, useState } from "react";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

/**
 * Botão flutuante de orçamento. Fica sempre montado (o metal líquido usa WebGL,
 * e o iOS limita contextos), só alterna a visibilidade.
 * Aparece depois do hero e some quando o formulário de contato está na tela.
 */
export function FloatingQuote({
  onClick,
  forceVisible = false,
}: {
  onClick: () => void;
  forceVisible?: boolean;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [atContact, setAtContact] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const small = window.matchMedia("(max-width: 639px)");
    const sync = () => setCompact(small.matches);
    sync();
    small.addEventListener("change", sync);
    return () => small.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contato");
    let observer: IntersectionObserver | undefined;
    if (contact) {
      observer = new IntersectionObserver(
        ([entry]) => setAtContact(entry.isIntersecting),
        { threshold: 0.25 },
      );
      observer.observe(contact);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
    };
  }, []);

  const visible = forceVisible || (pastHero && !atContact);

  return (
    <div
      className="floating-quote fixed z-50"
      aria-hidden={visible ? undefined : true}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(24px) scale(0.92)",
        pointerEvents: visible ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
        transition: `opacity 360ms ${EASE}, transform 460ms ${EASE}, visibility 0s linear ${visible ? "0s" : "460ms"}`,
      }}
    >
      <LiquidMetalButton
        label={compact ? "Orçamento" : "Solicitar orçamento"}
        className={compact ? "h-[48px] min-w-0" : undefined}
        onClick={onClick}
        icon={<WhatsAppIcon className="size-3.5 text-white" />}
      />
    </div>
  );
}
