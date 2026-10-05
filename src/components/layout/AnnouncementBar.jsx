"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchAnnouncement = async () => {
      try {
        const response = await fetch("/api/site-settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }

        const data = await response.json();
        const ann = data?.data?.settings?.announcement;

        if (mounted && ann?.text && ann?.isActive !== false) {
          setAnnouncement(ann);
        }
      } catch (error) {
        console.error("Announcement fetch error:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchAnnouncement();

    return () => {
      mounted = false;
    };
  }, []);

  const marqueeItems = useMemo(() => {
    if (!announcement?.text) return [];

    return Array.from({ length: 6 }, (_, index) => (
      <span
        key={index}
        className="inline-flex shrink-0 items-center"
      >
        <span className="mx-5 inline-flex items-center gap-2 sm:mx-8">
          <Sparkles
            size={11}
            strokeWidth={2}
            className="shrink-0 text-[#C8A96B]"
          />

          <span className="whitespace-nowrap">
            {announcement.text}
          </span>

          <span className="mx-2 h-1 w-1 rounded-full bg-[#C8A96B]" />
        </span>
      </span>
    ));
  }, [announcement]);

  if (
    loading ||
    !announcement?.text ||
    announcement?.isActive === false
  ) {
    return null;
  }

  return (
    <div
      className="announcement-luxury group relative flex h-9 w-full items-center overflow-hidden border-b border-[#D8C3A5]/40 sm:h-10"
      aria-label="THOBEIAN announcement"
    >
      {/* Luxury background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F7F3EA] via-[#FFFDF9] to-[#F7F3EA]" />

      {/* Moving shine */}
      <div className="announcement-shine pointer-events-none absolute inset-y-0 -left-[30%] w-[30%]" />

      {/* Left fade */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-[#F7F3EA] to-transparent sm:w-20" />

      {/* Right fade */}
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-[#F7F3EA] to-transparent sm:w-20" />

      {/* Brand indicator */}
      <div className="absolute left-3 z-20 hidden items-center gap-2 rounded-full border border-[#C8A96B]/30 bg-white/70 px-2.5 py-1 backdrop-blur-sm sm:flex">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C8A96B] opacity-50" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#C8A96B]" />
        </span>

        <span className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#1F1F1F]/70">
          THOBEIAN
        </span>
      </div>

      {/* Marquee */}
      <div className="relative flex min-w-0 flex-1 overflow-hidden">
        <div
          className="announcement-track flex min-w-max items-center whitespace-nowrap py-2 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#1F1F1F] group-hover:[animation-play-state:paused] sm:text-[10px] sm:tracking-[0.18em]"
        >
          {marqueeItems}
        </div>
      </div>

      {/* Explore */}
      {announcement.link && (
        <Link
          href={announcement.link}
          className="group/action absolute right-2 z-20 hidden items-center gap-1.5 rounded-full border border-[#C8A96B]/50 bg-white/80 px-3 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#1F1F1F] shadow-sm backdrop-blur-md transition-all duration-300 hover:border-[#C8A96B] hover:bg-[#C8A96B] hover:text-white hover:shadow-md sm:flex"
        >
          <span>Explore</span>

          <ArrowUpRight
            size={11}
            className="transition-transform duration-300 group-hover/action:-translate-y-0.5 group-hover/action:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
