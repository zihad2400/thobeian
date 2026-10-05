"use client";

import hotToast from "react-hot-toast";
import PremiumToast from "@/components/ui/PremiumToast";

const showPremiumToast = ({
  type,
  message,
  title,
  duration,
}) => {
  return hotToast.custom(
    (t) => (
      <PremiumToast
        t={t}
        type={type}
        message={message}
        title={title}
      />
    ),
    {
      duration:
        duration ||
        (type === "error" ? 5000 : 4200),

      position: "top-right",

      ariaProps: {
        role: "status",
        "aria-live": "polite",
      },
    }
  );
};

const toast = {
  success(message, options = {}) {
    return showPremiumToast({
      type: "success",
      message,
      title: options.title || "SUCCESS",
      duration: options.duration,
    });
  },

  error(message, options = {}) {
    return showPremiumToast({
      type: "error",
      message,
      title: options.title || "ERROR",
      duration: options.duration,
    });
  },

  warning(message, options = {}) {
    return showPremiumToast({
      type: "warning",
      message,
      title: options.title || "WARNING",
      duration: options.duration,
    });
  },

  info(message, options = {}) {
    return showPremiumToast({
      type: "info",
      message,
      title: options.title || "NOTICE",
      duration: options.duration,
    });
  },

  loading(message, options = {}) {
    return hotToast.loading(message, {
      duration: options.duration || Infinity,
    });
  },

  dismiss(toastId) {
    return hotToast.dismiss(toastId);
  },

  remove(toastId) {
    return hotToast.remove(toastId);
  },

  promise(promise, messages, options) {
    return hotToast.promise(
      promise,
      messages,
      options
    );
  },

  custom(renderer, options) {
    return hotToast.custom(renderer, options);
  },
};

export default toast;
