import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';
import { waitForFonts } from './Copy';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText, ScrollTrigger);
}

export function ArrowForwardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 512 512"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M85 277.375h259.704L225.002 397.077 256 427l171-171L256 85l-29.922 29.924 118.626 119.701H85v42.75z" />
    </svg>
  );
}

interface AnimatedButtonProps {
  label: string;
  route?: string;
  animate?: boolean;
  animateOnScroll?: boolean;
  delay?: number;
  onNavigate?: (route: string) => void;
}

export function AnimatedButton({
  label,
  route,
  animate = true,
  animateOnScroll = true,
  delay = 0,
  onNavigate,
}: AnimatedButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const circleRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useGSAP(
    () => {
      if (!buttonRef.current || !textRef.current) return;

      if (!animate) {
        gsap.set(buttonRef.current, { scale: 1 });
        gsap.set(circleRef.current, { scale: 1, opacity: 1 });
        gsap.set(iconRef.current, { opacity: 1, x: 0 });
        return;
      }

      let cancelled = false;

      (async () => {
        await waitForFonts();
        if (cancelled || !buttonRef.current || !textRef.current) return;

        const split = SplitText.create(textRef.current, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'line++',
          lineThreshold: 0.1,
        });
        splitRef.current = split;

        gsap.set(buttonRef.current, { scale: 0, transformOrigin: 'center' });
        gsap.set(circleRef.current, { scale: 0, transformOrigin: 'center', opacity: 0 });
        gsap.set(iconRef.current, { opacity: 0, x: -20 });
        gsap.set(split.lines, { y: '100%', opacity: 0 });

        const tl = gsap.timeline({ delay });
        tl.to(buttonRef.current, { scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
        tl.to(circleRef.current, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }, '+0.25');
        tl.to(iconRef.current, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, '-0.25');
        tl.to(
          split.lines,
          { y: '0%', opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' },
          '-=0.2'
        );

        if (animateOnScroll) {
          ScrollTrigger.create({
            trigger: buttonRef.current,
            start: 'top 90%',
            once: true,
            animation: tl,
          });
        }
      })();

      return () => {
        cancelled = true;
        if (splitRef.current) {
          splitRef.current.revert();
        }
      };
    },
    { scope: buttonRef, dependencies: [animate, animateOnScroll, delay] }
  );

  const innerContent = (
    <>
      <span className="circle" ref={circleRef} aria-hidden="true" />
      <div className="icon" ref={iconRef}>
        <ArrowForwardIcon />
      </div>
      <span className="button-text" ref={textRef}>
        {label}
      </span>
    </>
  );

  if (route) {
    return (
      <a
        href={route}
        className="btn"
        ref={buttonRef}
        onClick={(e) => {
          e.preventDefault();
          onNavigate?.(route);
        }}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button type="button" className="btn" ref={buttonRef}>
      {innerContent}
    </button>
  );
}
