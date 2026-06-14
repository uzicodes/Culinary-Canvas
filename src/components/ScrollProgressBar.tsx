"use client";

import { useEffect, useMemo } from "react";
import { m as motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";

const ALLOWED_PATHS = ["/", "/all-items"];

export default function ScrollProgressBar() {
  const pathname = usePathname();

  // Derive visibility directly from pathname — no state needed
  const isVisible = useMemo(() => ALLOWED_PATHS.includes(pathname), [pathname]);

  // Track scroll progress of the entire document
  const { scrollYProgress } = useScroll();

  // Smooth animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Reset scroll to top when navigating to an allowed path
  useEffect(() => {
    if (isVisible) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-red-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
