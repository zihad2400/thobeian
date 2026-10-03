"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const fetchAnnouncement = async () => {
    try {
      const { data } = await axios.get("/api/site-settings");
      const ann = data.data.settings?.announcement;

      if (ann && ann.isActive && ann.text) {
        setAnnouncement(ann);
      }
    } catch (error) {
      console.error("Announcement fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // No announcement = don't show bar
  if (loading || !announcement) return null;

  const content = (
    <>
      <span className="text-xs tracking-wider">
        {announcement.text}
      </span>
      {announcement.link && (
        <ArrowRight
          size={12}
          className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
        />
      )}
    </>
  );

  // If has link — clickable
  if (announcement.link) {
    return (
      <Link
        href={announcement.link}
        className="block text-center py-2.5 tracking-wider transition-colors hover:opacity-90 group"
        style={{
          backgroundColor: announcement.backgroundColor || "#1F1F1F",
          color: announcement.textColor || "#FFFFFF",
        }}
      >
        {content}
      </Link>
    );
  }

  // No link — just text
  return (
    <div
      className="text-center py-2.5 tracking-wider"
      style={{
        backgroundColor: announcement.backgroundColor || "#1F1F1F",
        color: announcement.textColor || "#FFFFFF",
      }}
    >
      {content}
    </div>
  );
}
