"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useMotionTemplate } from "framer-motion";

const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

interface ScrollSplitCardItem {
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  icon?: React.ReactNode;
}

interface ScrollSplitCardProps {
  className?: string;
  imageSrc: string;
  cards: ScrollSplitCardItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function ScrollSplitCard({
  className,
  imageSrc,
  cards,
}: ScrollSplitCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Stage 1 to 2: Separation (0 to 0.4), then Stage 2 to 3: Overlap closer (0.4 to 0.8)
  const leftX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, -48, -24]);
  const rightX = useTransform(scrollYProgress, [0, 0.4, 0.8], [0, 48, 24]);
  const scale = useTransform(scrollYProgress, [0, 0.4], [1, 0.9]);

  // Stage 2 to 3: Flip (0.4 to 0.8)
  const rotateY = useTransform(scrollYProgress, [0.4, 0.8], [0, 180]);
  // Due to 180deg Y flip, positive Z becomes visual counter-clockwise, negative Z becomes visual clockwise
  const rotateZLeft = useTransform(scrollYProgress, [0.4, 0.8], [0, 6]);
  const rotateZRight = useTransform(scrollYProgress, [0.4, 0.8], [0, -6]);

  // Dynamic borders/radii so it looks like ONE flat image initially
  const borderRadiusLeft = useTransform(scrollYProgress, [0, 0.2], ["16px 0px 0px 16px", "16px 16px 16px 16px"]);
  const borderRadiusMiddle = useTransform(scrollYProgress, [0, 0.2], ["0px 0px 0px 0px", "16px 16px 16px 16px"]);
  const borderRadiusRight = useTransform(scrollYProgress, [0, 0.2], ["0px 16px 16px 0px", "16px 16px 16px 16px"]);
  const borderOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.2]);
  const shadowOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 0.4]);
  const boxShadow = useMotionTemplate`inset 0 1px 1px rgba(255, 255, 255, ${borderOpacity}), inset 0 -24px 48px rgba(0, 0, 0, ${shadowOpacity}), 0 25px 50px -12px rgba(0, 0, 0, ${shadowOpacity})`;

  // Cards move up in the last viewport
  const cardsY = useTransform(scrollYProgress, [0.8, 1], [0, -200]);

  // Text appearance at the end in the sticky viewport
  const textOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.8, 1], [40, 0]);

  // Indicator text appearance at the start
  const startTextOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const startTextY = useTransform(scrollYProgress, [0, 0.1], [0, 20]);

  // Text appearance on cards as they flip
  const cardTextOpacity = useTransform(scrollYProgress, [0.45, 0.75], [0, 1]);
  const cardTextY = useTransform(scrollYProgress, [0.45, 0.75], [30, 0]);
  const cardIconScale = useTransform(scrollYProgress, [0.45, 0.75], [0.5, 1]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-[300vh] w-full", className)}
    >
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden [perspective:1200px]">


        <motion.div
          style={{ scale, y: cardsY, transformStyle: "preserve-3d" }}
          className="flex h-[400px] w-full max-w-4xl px-4 relative"
        >
          {cards.slice(0, 3).map((card, i) => (
            <motion.div
              key={i}
              className="relative h-full flex-1"
              style={{
                x: i === 0 ? leftX : i === 2 ? rightX : 0,
                rotateY,
                rotateZ: i === 0 ? rotateZLeft : i === 2 ? rotateZRight : 0,
                zIndex: i, // Ensures Left is under Middle, and Right is above Middle
                transformStyle: "preserve-3d",
              }}
            >
              {/* Front Side: Original Image Split */}
              <motion.div
                className="absolute inset-0 overflow-hidden"
                style={{
                  zIndex: 2, // Ensure front stays above initially
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div
                  className="absolute inset-0 h-full w-[300%]"
                  style={{
                    left: `${-100 * i}%`,
                    backgroundImage: `url(${imageSrc})`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                  }}
                />
              </motion.div>

              {/* Back Side: New Content Card */}
              <motion.div
                className={cn(
                  "absolute inset-0 overflow-hidden flex flex-col justify-between p-6 sm:p-8 will-change-transform",
                  "border border-white/15 bg-gradient-to-br from-white/15 to-transparent",
                  "shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),inset_0_-24px_48px_rgba(0,0,0,0.25)]"
                )}
                style={{
                  backgroundColor: card.bgColor,
                  color: card.textColor,
                  rotateY: 180,
                  zIndex: 1, // Ensure back is behind before flip
                  borderRadius: i === 0 ? borderRadiusLeft : i === 2 ? borderRadiusRight : borderRadiusMiddle,
                  boxShadow,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                {/* Grainy Noise Overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-20 mix-blend-overlay"
                  style={{
                    backgroundImage: `url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png?width=256&height=256")`,
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* Top: Icon / Emoji Badge */}
                <motion.div 
                  style={{ opacity: cardTextOpacity, scale: cardIconScale }}
                  className="relative z-10"
                >
                  {card.icon || (
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-lg backdrop-blur-md">
                      {i === 0 ? "💰" : i === 1 ? "🏆" : "🚀"}
                    </div>
                  )}
                </motion.div>
                
                {/* Middle: Title */}
                <motion.h3 
                  style={{ opacity: cardTextOpacity, y: cardTextY }}
                  className="relative z-10 text-lg sm:text-xl font-black uppercase tracking-tight leading-snug drop-shadow-lg my-auto"
                >
                  {card.title}
                </motion.h3>

                {/* Bottom: Description */}
                <motion.p 
                  style={{ opacity: cardTextOpacity, y: cardTextY }}
                  className="relative z-10 text-xs sm:text-sm opacity-95 leading-relaxed font-medium"
                >
                  {card.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Ending Text fixed in the sticky viewport */}
        <motion.div
          className="absolute bottom-[20%] left-0 right-0 text-center"
          style={{
            opacity: textOpacity,
            y: textY,
          }}
        >
          <p className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase italic">
            The Future Has Odds.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
