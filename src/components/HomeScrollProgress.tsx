"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomeScrollProgress() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // scroll position - track the whole document
  const { scrollYProgress } = useScroll();

  // movement smooth 
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Show on Homepage ("/") and All Items page ("/all-items")
  useEffect(() => {
    const allowedPaths = ["/", "/all-items"];
    if (allowedPaths.includes(pathname)) {
      setIsVisible(true);
      // Small delay to ensure DOM is ready and scroll values are accurate
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
      setIsReady(false);
    }
  }, [pathname]);

  // Reset scroll progress when navigating to a new page
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