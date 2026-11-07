import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrazilMap, places } from "@/components/BrazilMap";
import { FloatingQuote } from "@/components/FloatingQuote";
import { MenuToggle, MobileMenu } from "@/components/MobileMenu";
import { Signature } from "@/components/Signature";
import { TeamCarousel } from "@/components/TeamCarousel";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { LiquidMetalButton } from "@/components/ui/liquid-metal-button";
import {
  clients,
  differences,
  jobs,
  quoteUrl,
  services,
  steps,
  team,
} from "@/content";
import { asset } from "@/lib/utils";

const NAV = [
  { href: "#jobs", label: "Jobs" },
  { href: "#servicos", label: "Serviços" },
  { href: "#origem", label: "A Marini" },
  { href: "#time", label: "Time" },
  { href: "#contato", label: "Contato" },
];

function openQuote(extra?: string) {
  window.location.assign(quoteUrl(extra));
}

function scrollToHash(href: string) {
  const target = document.querySelector(href);
  if (!target) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const top = target.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", href);
}

export function Landing({ holdHero }: { holdHero: boolean }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const origemTextRef = useRef<HTMLDivElement>(null);
  const jobsScrollerRef = useRef<HTMLDivElement>(null);
  const jobsBarRef = useRef<HTMLSpanElement>(null);
  const [jobIndex, setJobIndex] = useState(0);

  const closeMenu = useCallback(() => setOpen(false), []);
  const navigate = useCallback((href: string) => {
    setOpen(false);
    // espera o menu destravar a rolagem antes de rolar até a seção
    window.setTimeout(() => scrollToHash(href), 60);
  }, []);

  const setJobsProgress = useCallback((progress: number) => {
    const clamped = Math.min(Math.max(progress, 0), 1);
    if (jobsBarRef.current) jobsBarRef.current.style.transform = `scaleX(${Math.max(clamped, 0.04)})`;
    setJobIndex(Math.round(clamped * (jobs.length - 1)));
  }, []);

  // No celular a galeria rola na horizontal com o dedo (scroll nativo com snap).
  useEffect(() => {
    const scroller = jobsScrollerRef.current;
    if (!scroller) return;
    const onScroll = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max > 0) setJobsProgress(scroller.scrollLeft / max);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, [setJobsProgress]);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (holdHero) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    gsap.registerPlugin(ScrollTrigger);
    // evita recalcular tudo quando a barra de endereço do iOS/Android aparece e some
    ScrollTrigger.config({ ignoreMobileResize: true });
    const ctx = gsap.context(() => {
      gsap.to("#hero-photo", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("#hero-copy", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: "#diferenca", start: "top 75%" },
        })
        .from("#diferenca .reveal-title", { y: 44, opacity: 0, duration: 0.8 })
        .from("#diferenca .reveal-lead", { y: 24, opacity: 0, duration: 0.7 }, "-=0.55")
        .from(
          "#diferenca article",
          { y: 56, opacity: 0, duration: 0.85, stagger: 0.14 },
          "-=0.4",
        )
        .from(
          "#diferenca .diff-line",
          { scaleX: 0, transformOrigin: "left center", duration: 0.9, stagger: 0.14 },
          "<0.15",
        );

      gsap.from("#servicos .reveal-title", {
        y: 44,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: { trigger: "#servicos", start: "top 75%" },
      });

      gsap.set("#servicos .svc-line", { scaleX: 0, transformOrigin: "left center" });
      gsap.set("#servicos .svc-copy", { y: 28, opacity: 0 });
      ScrollTrigger.batch("#servicos article", {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
          const els = batch as HTMLElement[];
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .to(
              els.map((el) => el.querySelector(".svc-line")),
              { scaleX: 1, duration: 0.9, stagger: 0.12 },
            )
            .to(
              els.flatMap((el) => Array.from(el.querySelectorAll(".svc-copy"))),
              { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
              "<0.15",
            );
        },
      });

      const mm = gsap.matchMedia();
      mm.add("(max-width: 767px)", () => {
        ScrollTrigger.batch("#metodo li", {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.from(batch, { y: 40, opacity: 0, duration: 0.7, stagger: 0.12, ease: "power3.out" }),
        });
        gsap.from("#jobs-track figure", {
          x: 60,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: "#jobs", start: "top 70%" },
        });
      });

      mm.add("(min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>("#metodo li");
        gsap.set(items, { opacity: 0.15, y: 12 });
        const stepsTl = gsap.timeline({
          scrollTrigger: {
            trigger: "#metodo",
            start: "top 12%",
            end: "+=80%",
            pin: true,
            scrub: 0.4,
          },
        });
        items.forEach((item) => {
          stepsTl.to(item, { opacity: 1, y: 0, ease: "power3.out" });
        });

        const track = document.querySelector<HTMLElement>("#jobs-track");
        if (track) {
          gsap.to(track, {
            x: () => -Math.max(track.scrollWidth - window.innerWidth + 64, 0),
            ease: "none",
            scrollTrigger: {
              trigger: "#jobs",
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              pin: true,
              scrub: 0.7,
              invalidateOnRefresh: true,
              onUpdate: (self) => setJobsProgress(self.progress),
            },
          });
        }
      });

      gsap.from("#origem .origem-col", {
        y: 22,
        opacity: 0,
        duration: 0.28,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: "#origem", start: "top 72%" },
      });

      // Em telas de toque não há hover: os detalhes da seção acendem ao entrar na tela.
      ScrollTrigger.create({
        trigger: "#origem",
        start: "top 55%",
        once: true,
        onEnter: () => document.getElementById("origem")?.classList.add("is-inview"),
      });

    });

    return () => ctx.revert();
  }, [holdHero, setJobsProgress]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      `Nome: ${data.get("nome") || ""}`,
      `E-mail: ${data.get("email") || ""}`,
      `Empresa: ${data.get("empresa") || ""}`,
      `Cidade: ${data.get("cidade") || ""}`,
      `Mensagem: ${data.get("mensagem") || ""}`,
    ];
    openQuote(lines.join("\n"));
  }

  return (
    <div className="silk-page text-navy">
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-200 ${
          solid || open ? "bg-navy shadow-[0_8px_18px_rgba(18,22,72,0.28)]" : "bg-transparent"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
          <a
            href="#hero"
            className="shrink-0"
            aria-label="Marini Casting"
            onClick={(event) => {
              event.preventDefault();
              navigate("#hero");
            }}
          >
            <img
              id="header-logo"
              src={asset("midias/marca/Design-sem-nome-89.png")}
              alt="Marini Casting"
              className="h-12 w-auto mix-blend-screen"
            />
          </a>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Seções">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-sm text-white/95 underline-offset-4 hover:underline"
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.href);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <MenuToggle open={open} onToggle={() => setOpen((value) => !value)} />
        </div>
      </header>
      <MobileMenu open={open} items={NAV} onNavigate={navigate} onClose={closeMenu} />

      <main>
        <section id="hero" className="relative min-h-[100svh] overflow-hidden bg-navy">
          <img
            id="hero-photo"
            src={asset("midias/hero/PHOTO-2024-11-03-16-47-20-2-scaled.jpg")}
            alt="Equipe da Porto reunida em ativação."
            className="absolute inset-0 h-[115%] w-full object-cover object-[center_30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/25 to-navy/20" />
          <div
            id="hero-copy"
            data-hold={holdHero ? "true" : "false"}
            className="hero-copy relative z-10 flex min-h-[100svh] items-end px-5 pb-16 pt-28 md:px-12"
          >
            <div className="max-w-3xl">
              <h1 className="max-w-[16ch] font-display text-4xl leading-[1.05] font-semibold text-balance text-white sm:text-6xl">
                A equipe certa para a sua marca acontecer ao vivo.
              </h1>
              <p className="mt-5 max-w-[62ch] font-sans text-base leading-relaxed text-white sm:text-lg">
                Há mais de 15 anos, ajudamos empresas e agências a encontrarem a equipe certa para transformar eventos e ativações de marca em experiências inesquecíveis.
              </p>
              <div className="mt-8">
                <LiquidMetalButton onClick={() => openQuote()} />
              </div>
            </div>
          </div>
        </section>

        <section className="silk-band py-16 md:py-24" aria-labelledby="estados-titulo">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-12">
            <div>
              <h2 id="estados-titulo" className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                Em campo em todo o Brasil.
              </h2>
              <p className="mt-5 max-w-[28ch] font-sans text-lg leading-relaxed">
                Equipes em {places.length - 1} estados e no Distrito Federal, do Amazonas ao Rio Grande do Sul.
              </p>
            </div>
            <BrazilMap />
          </div>
        </section>

        <section className="bg-navy py-12" aria-label="Clientes">
          <InfiniteSlider gap={48} duration={40} durationOnHover={80}>
            {clients.map((client) => (
              <img
                key={client.file}
                src={asset(`midias/clientes/${client.file}`)}
                alt={client.name}
                className="h-14 w-auto mix-blend-screen"
              />
            ))}
          </InfiniteSlider>
        </section>

        <section id="diferenca" className="silk-band py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal-title max-w-[18ch] font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
              Presença com propósito.
            </h2>
            <p className="reveal-lead mt-5 max-w-[46ch] font-sans text-lg leading-relaxed">
              Na Marini, casting não é sobre volume. É sobre valor.
            </p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
              {differences.map((item, index) => (
                <article key={item.title}>
                  <div className="mb-5 flex items-center gap-3">
                    <span className="font-display text-sm font-semibold tracking-widest text-coral">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span aria-hidden className="diff-line block h-[2px] w-14 bg-coral" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-3 max-w-[36ch] font-sans text-base leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="servicos" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="reveal-title font-display text-4xl font-semibold text-balance sm:text-5xl">
              Do briefing à execução.
            </h2>
            <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {services.map((item) => (
                <article key={item.title} className="group relative pt-5">
                  <span aria-hidden className="svc-line absolute inset-x-0 top-0 h-px bg-navy/15">
                    <span className="absolute inset-y-0 left-0 w-0 bg-coral transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-full" />
                  </span>
                  <h3 className="svc-copy font-display text-2xl font-semibold">{item.title}</h3>
                  <p className="svc-copy mt-3 max-w-[42ch] font-sans leading-relaxed">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="metodo" className="silk-band py-20 md:min-h-[100svh] md:py-0">
          <div className="mx-auto flex min-h-[inherit] max-w-6xl flex-col justify-center px-5 py-16">
            <h2 className="font-display text-4xl font-semibold text-balance sm:text-5xl">
              Como a equipe chega ao piso.
            </h2>
            <ol className="mt-10 grid gap-6 md:grid-cols-2">
              {steps.map((step, index) => (
                <li key={step} className="bg-white/70 p-6 shadow-[0_10px_18px_rgba(18,22,72,0.08)]">
                  <p className="font-display text-3xl font-semibold text-coral">{index + 1}</p>
                  <p className="mt-3 font-sans text-lg leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[52ch] font-sans leading-relaxed">
              O briefing é lido de verdade. A equipe sai alinhada ao perfil do evento.
            </p>
          </div>
        </section>

        <section id="jobs" className="overflow-hidden bg-navy text-white md:h-[100svh]">
          <div className="flex h-full flex-col justify-center py-16 md:py-0">
            <div className="flex items-end justify-between gap-6 px-5 md:px-12">
              <h2 className="font-display text-4xl font-semibold text-balance sm:text-5xl">
                A marca em campo.
              </h2>
              <div className="flex shrink-0 flex-col items-end gap-2 pb-1">
                <p className="font-sans text-xs tracking-[0.2em] text-white/70 tabular-nums" aria-live="polite">
                  <span className="text-white">{String(jobIndex + 1).padStart(2, "0")}</span>
                  {" / "}
                  {String(jobs.length).padStart(2, "0")}
                </p>
                <span aria-hidden className="block h-[2px] w-24 overflow-hidden bg-white/15 md:w-40">
                  <span
                    ref={jobsBarRef}
                    className="block h-full w-full origin-left bg-coral transition-transform duration-150 ease-out"
                    style={{ transform: "scaleX(0.04)" }}
                  />
                </span>
              </div>
            </div>
            <div
              id="jobs-scroller"
              ref={jobsScrollerRef}
              className="jobs-scroller mt-8 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-5 md:snap-none md:overflow-hidden"
            >
              <div id="jobs-track" className="flex w-max gap-4 px-5 md:gap-5 md:px-12">
                {jobs.map((job, index) => (
                  <figure key={job.src} className="job-card group relative shrink-0 snap-start">
                    <div
                      className="relative h-[min(60svh,105vw)] max-w-[86vw] overflow-hidden bg-navy-deep md:h-[68svh] md:max-w-none"
                      style={{ aspectRatio: job.ratio }}
                    >
                      <img
                        src={job.src}
                        alt={job.alt}
                        loading="lazy"
                        draggable={false}
                        className="h-full w-full object-cover object-[center_25%]"
                      />
                      <figcaption className="job-caption absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-navy-deep/95 via-navy-deep/55 to-transparent px-4 pt-20 pb-4 md:px-5 md:pb-5">
                        <div className="min-w-0">
                          <span className="font-sans text-[0.7rem] font-medium tracking-[0.22em] text-coral">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <p className="mt-1 truncate font-display text-2xl leading-none font-semibold md:text-[1.7rem]">
                            {job.brand}
                          </p>
                          <span
                            aria-hidden
                            className="mt-3 block h-[2px] w-8 bg-coral transition-[width] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:w-16"
                          />
                        </div>
                        <span className="shrink-0 rounded-full border border-white/35 bg-white/10 px-3 py-1 font-sans text-[0.68rem] font-medium tracking-[0.14em] whitespace-nowrap uppercase backdrop-blur-sm">
                          {job.kind}
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
            <p className="mt-5 flex items-center gap-2 px-5 font-sans text-xs text-white/60 md:hidden">
              Arraste para o lado
              <span aria-hidden className="swipe-hint inline-block">→</span>
            </p>
          </div>
        </section>

        <section id="origem" className="silk-band py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 md:grid-cols-2">
            <div ref={origemTextRef} className="origem-col group/texto">
              <span
                aria-hidden
                className="mb-6 block h-[3px] w-10 bg-coral transition-[width] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/texto:w-28 touch-on:w-28"
              />
              <h2 className="font-display text-4xl leading-tight font-semibold text-balance sm:text-5xl">
                A Marini nasceu de quem já viveu o{" "}
                <span className="bg-[linear-gradient(var(--color-coral),var(--color-coral))] bg-[length:0%_3px] bg-left-bottom bg-no-repeat transition-[background-size] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/texto:bg-[length:100%_3px] touch-on:bg-[length:100%_3px] touch-on:delay-300">
                  backstage
                </span>
                .
              </h2>
              <p className="mt-6 max-w-[58ch] font-sans text-base leading-relaxed">
                A fundadora começou em eventos, como promotora e produtora. Essa vivência virou uma agência que entende o detalhe e valoriza quem entrega.{" "}
                <span className="font-medium transition-colors duration-500 group-hover/texto:text-coral touch-on:text-coral touch-on:delay-500">
                  Há mais de 15 anos
                </span>{" "}
                conecta marcas, experiências e profissionais de forma estratégica, cuidadosa e humana. Mais do que selecionar perfis, prepara profissionais para representar a marca com presença, postura e autenticidade.
              </p>
              <Signature className="mt-8" hoverTarget={origemTextRef} />
            </div>
            <div className="origem-col">
              <figure className="group/foto relative mr-4 mb-4">
                <span
                  aria-hidden
                  className="absolute inset-0 translate-x-4 translate-y-4 border border-coral/60 transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/foto:translate-x-2 group-hover/foto:translate-y-2 touch-on:translate-x-2 touch-on:translate-y-2"
                />
                <div className="relative overflow-hidden shadow-[0_18px_36px_rgba(18,22,72,0.18)]">
                  <img
                    src={team.find((person) => person.role === "CEO")?.src}
                    alt="Marisa Marini, CEO"
                    className="aspect-[4/5] w-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/foto:scale-[1.04] touch-on:scale-[1.04]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-navy/85 via-navy/35 to-transparent px-6 pt-20 pb-6 text-white opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover/foto:translate-y-0 group-hover/foto:opacity-100 touch-on:translate-y-0 touch-on:opacity-100 touch-on:delay-500">
                    <p className="font-sans text-sm text-white/85">Fundadora e CEO</p>
                    <p className="mt-1 font-display text-2xl font-semibold">Marisa Marini</p>
                  </figcaption>
                </div>
              </figure>
            </div>
          </div>
        </section>

        <section id="time" className="overflow-x-clip bg-white py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5">
            <h2 className="font-display text-4xl font-semibold text-balance sm:text-5xl">
              Quem segura a operação.
            </h2>
            <p className="mt-5 max-w-[48ch] font-sans text-lg leading-relaxed">
              Experiência de mercado, escuta e um processo sem surpresa.
            </p>
            <TeamCarousel people={team} />
          </div>
        </section>

        <section id="talentos" className="bg-silk py-16 md:py-20">
          <div className="mx-auto max-w-3xl px-5">
            <h2 className="font-display text-3xl font-semibold text-balance">
              Quer fazer parte do casting?
            </h2>
            <p className="mt-4 max-w-[58ch] font-sans leading-relaxed">
              Atitude e profissionalismo. Envie fotos, medidas, cidade e contatos para{" "}
              <a
                className="underline decoration-coral decoration-2 underline-offset-4"
                href="mailto:casting01@marinicasting.com.br"
              >
                casting01@marinicasting.com.br
              </a>
              .
            </p>
          </div>
        </section>

        <section id="contato" className="bg-navy py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-4xl font-semibold text-balance sm:text-5xl">
                Solicite o orçamento.
              </h2>
              <p className="mt-4 max-w-[46ch] font-sans leading-relaxed text-white/90">
                Conte a ação. A resposta segue pelo WhatsApp{" "}
                <span className="whitespace-nowrap">11 99492-9630</span>.
              </p>
              <form className="mt-8 grid gap-4" onSubmit={onSubmit}>
                <label className="grid gap-1 font-sans text-sm">
                  Nome
                  <input required name="nome" className="field" autoComplete="name" />
                </label>
                <label className="grid gap-1 font-sans text-sm">
                  E-mail
                  <input required type="email" name="email" className="field" autoComplete="email" />
                </label>
                <label className="grid gap-1 font-sans text-sm">
                  Empresa
                  <input required name="empresa" className="field" autoComplete="organization" />
                </label>
                <label className="grid gap-1 font-sans text-sm">
                  Cidade
                  <input required name="cidade" className="field" autoComplete="address-level2" />
                </label>
                <label className="grid gap-1 font-sans text-sm">
                  Mensagem
                  <textarea required name="mensagem" rows={4} className="field" />
                </label>
                <LiquidMetalButton className="w-full justify-self-start sm:w-fit" onClick={() => {
                  const form = document.querySelector<HTMLFormElement>("#contato form");
                  form?.requestSubmit();
                }} />
              </form>
              <p className="mt-6 font-sans text-sm leading-relaxed text-white/90">
                Rua Maguatá, 50, São Paulo
                <br />
                <a className="underline decoration-coral underline-offset-4" href="mailto:contato@marinicasting.com.br">
                  contato@marinicasting.com.br
                </a>
              </p>
            </div>
            <iframe
              loading="lazy"
              title="Mapa do escritório da Marini Casting"
              className="min-h-80 w-full border-0"
              src="https://maps.google.com/maps?q=Rua%20Maguat%C3%A1%2050%20S%C3%A3o%20Paulo&output=embed"
            />
          </div>
        </section>
      </main>

      <FloatingQuote onClick={() => openQuote()} forceVisible={open} />

      <footer className="bg-navy-deep px-5 pt-8 pb-28 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm">Marini Casting</p>
          <div className="flex gap-5 font-sans text-sm">
            <a className="underline-offset-4 hover:underline" href="https://www.instagram.com/marinicasting/">
              Instagram
            </a>
            <a className="underline-offset-4 hover:underline" href="https://br.linkedin.com/company/marini-casting">
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
