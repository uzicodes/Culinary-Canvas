"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Track scroll progress of the entire document
  const { scrollYProgress } = useScroll();

  // Smooth animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Show only on homepage and all-items page
  useEffect(() => {
    const allowedPaths = ["/", "/all-items"];
    if (allowedPaths.includes(pathname)) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsReady(false);
    }
  }, [pathname]);

  // Reset scroll to top when navigating
  useEffect(() => {
    if (isVisible) {
      window.scrollTo(0, 0);
    }
  }, [pathname, isVisible]);

  if (!isVisible || !isReady) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-red-500 origin-left z-[100]"
      style={{ scaleX }}
    />
  );
}
