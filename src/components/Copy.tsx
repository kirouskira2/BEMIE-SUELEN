import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export const waitForFonts = async (): Promise<boolean> => {
  try {
    await document.fonts.ready;
    const checks = ['Manrope'].map((font) => document.fonts.check(`16px ${font}`));
    await Promise.all(checks);
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return true;
  }
};

interface CopyProps {
  children: React.ReactElement;
  animateOnScroll?: boolean;
  delay?: number;
}

export function Copy({ children, animateOnScroll = true, delay = 0 }: CopyProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const elementsRef = useRef<HTMLElement[]>([]);
  const splitRefs = useRef<SplitText[]>([]);
  const linesRef = useRef<Element[]>([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      let cancelled = false;

      (async () => {
        await waitForFonts();
        if (cancelled || !containerRef.current) return;

        splitRefs.current = [];
        linesRef.current = [];
        elementsRef.current = [];

        const targets: HTMLElement[] = containerRef.current.hasAttribute('data-copy-wrapper')
          ? (Array.from(containerRef.current.children) as HTMLElement[])
          : [containerRef.current];

        targets.forEach((el) => {
          elementsRef.current.push(el);
          const split = SplitText.create(el, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line++',
            lineThreshold: 0.1,
          });
          splitRefs.current.push(split);

          const textIndent = window.getComputedStyle(el).textIndent;
          if (textIndent && textIndent !== '0px') {
            if (split.lines.length > 0) {
              (split.lines[0] as HTMLElement).style.paddingLeft = textIndent;
            }
            el.style.textIndent = '0';
          }
          linesRef.current.push(...split.lines);
        });

        gsap.set(linesRef.current, { y: '100%' });

        const animProps: gsap.TweenVars = {
          y: '0%',
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          delay,
        };

        if (animateOnScroll) {
          gsap.to(linesRef.current, {
            ...animProps,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 90%',
              once: true,
            },
          });
        } else {
          gsap.to(linesRef.current, animProps);
        }
      })();

      return () => {
        cancelled = true;
        splitRefs.current.forEach((split) => {
          if (split) split.revert();
        });
      };
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children as React.ReactElement<{ ref?: React.Ref<HTMLElement> }>, {
      ref: containerRef,
    });
  }

  return (
    <div ref={containerRef as React.RefObject<HTMLDivElement>} data-copy-wrapper="true">
      {children}
    </div>
  );
}
