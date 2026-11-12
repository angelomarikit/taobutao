import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  y?: number;
  scale?: number;
  duration?: number;
  delay?: number;
  ease?: string;
  threshold?: number;
};

export function Reveal({
  children,
  className = "",
  y = 0,
  scale,
  duration = 0.6,
  delay = 0,
  ease = "cubic-bezier(0.44, 0, 0.56, 1)",
  threshold = 0.25,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  const style = {
    "--reveal-y": `${y}px`,
    "--reveal-scale": String(scale ?? 1.04),
    "--reveal-duration": `${duration}s`,
    "--reveal-delay": `${delay}s`,
    "--reveal-ease": ease,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={`${shown ? `reveal ${scale ? "reveal-scale" : ""}` : "opacity-0"} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
