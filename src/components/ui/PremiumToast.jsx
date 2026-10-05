"use client";

import {
  Check,
  X,
  AlertTriangle,
  Info,
  X as CloseIcon,
} from "lucide-react";
import hotToast from "react-hot-toast";

const CONFIG = {
  success: {
    icon: Check,
    accent: "#B4935A",
    secondary: "#E8D5A8",
    bg: "#FFFDF7",
    iconBg: "#F4E8CC",
    title: "Success",
    duration: 2200,
  },

  error: {
    icon: X,
    accent: "#C25B63",
    secondary: "#E9A9AE",
    bg: "#FFF8F9",
    iconBg: "#F8E1E4",
    title: "Something went wrong",
    duration: 2600,
  },

  warning: {
    icon: AlertTriangle,
    accent: "#D08A2E",
    secondary: "#F0C77D",
    bg: "#FFFDF5",
    iconBg: "#F8EACB",
    title: "Attention",
    duration: 2400,
  },

  info: {
    icon: Info,
    accent: "#6688A8",
    secondary: "#AFC9E0",
    bg: "#F8FBFF",
    iconBg: "#E1EDF7",
    title: "Information",
    duration: 2200,
  },
};

export default function PremiumToast({
  t,
  type = "success",
  message,
}) {
  const config = CONFIG[type] || CONFIG.info;
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        thobeian-toast
        group
        relative
        flex
        w-[min(390px,calc(100vw-24px))]
        items-center
        gap-3
        overflow-hidden
        rounded-2xl
        border
        px-3.5
        py-3
        transition-all
        duration-300
        ease-[cubic-bezier(.22,1,.36,1)]
        ${
          t.visible
            ? "translate-x-0 scale-100 opacity-100"
            : "translate-x-8 scale-95 opacity-0"
        }
      `}
      style={{
        borderColor: `${config.secondary}90`,
        background: `
          linear-gradient(
            135deg,
            ${config.bg} 0%,
            #FFFFFF 55%,
            ${config.secondary}12 100%
          )
        `,
        boxShadow: `
          0 14px 38px rgba(31,31,31,0.13),
          0 3px 10px rgba(31,31,31,0.06),
          inset 0 1px 0 rgba(255,255,255,0.9)
        `,
      }}
    >

      {/* COLOR GLOW */}
      <div
        className="
          pointer-events-none
          absolute
          -right-8
          -top-8
          h-20
          w-20
          rounded-full
          opacity-30
          blur-2xl
        "
        style={{
          backgroundColor: config.secondary,
        }}
      />

      {/* TOP ACCENT */}
      <div
        className="
          absolute
          left-0
          right-0
          top-0
          h-[2.5px]
        "
        style={{
          background: `
            linear-gradient(
              90deg,
              ${config.secondary},
              ${config.accent},
              ${config.secondary}
            )
          `,
        }}
      />

      {/* ICON */}
      <div
        className="
          relative
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-xl
          transition-all
          duration-300
          group-hover:rotate-3
          group-hover:scale-110
        "
        style={{
          background: `
            linear-gradient(
              135deg,
              ${config.iconBg},
              ${config.secondary}55
            )
          `,
          boxShadow: `
            inset 0 0 0 1px ${config.secondary}55,
            0 4px 12px ${config.secondary}30
          `,
        }}
      >
        <Icon
          size={17}
          strokeWidth={2.6}
          style={{
            color: config.accent,
          }}
        />

        <span
          className="
            absolute
            inset-0
            rounded-xl
            animate-[toastIconPulse_1.8s_ease-in-out_infinite]
          "
          style={{
            boxShadow: `0 0 0 0 ${config.secondary}55`,
          }}
        />
      </div>

      {/* MESSAGE */}
      <div className="relative min-w-0 flex-1">
        <p
          className="
            mb-0.5
            text-[9px]
            font-bold
            uppercase
            tracking-[0.16em]
          "
          style={{
            color: config.accent,
          }}
        >
          {config.title}
        </p>

        <p className="
          text-[12.5px]
          font-medium
          leading-[1.4]
          text-[#242424]
          sm:text-[13px]
        ">
          {message}
        </p>
      </div>

      {/* CLOSE */}
      <button
        type="button"
        onClick={() => hotToast.dismiss(t.id)}
        aria-label="Close notification"
        className="
          relative
          flex
          h-7
          w-7
          shrink-0
          items-center
          justify-center
          rounded-full
          text-[#A5A5A5]
          transition-all
          duration-200
          hover:bg-black/[0.06]
          hover:text-[#333]
          active:scale-75
        "
      >
        <CloseIcon
          size={13}
          strokeWidth={2}
        />
      </button>

      {/* PROGRESS TRACK */}
      <div
        className="
          absolute
          bottom-0
          left-3.5
          right-3.5
          h-[2px]
          overflow-hidden
          rounded-full
        "
        style={{
          backgroundColor: `${config.accent}18`,
        }}
      >
        <div
          className="h-full origin-left"
          style={{
            background: `
              linear-gradient(
                90deg,
                ${config.secondary},
                ${config.accent}
              )
            `,
            animation: `toastPremium ${config.duration}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
