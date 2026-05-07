"use client";

import { useRef } from "react";
import { useCountUp } from "use-count-up";
import { useInView } from "framer-motion";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export function CountUp({
  to,
  from = 0,
  duration = 2,
  suffix = "",
  prefix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  const { value } = useCountUp({
    isCounting: inView,
    end: to,
    start: from,
    duration: duration,
    decimalPlaces: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
