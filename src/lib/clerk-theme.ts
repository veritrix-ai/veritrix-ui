import { useEffect, useState } from "react";

export function useDarkTheme() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isDark;
}

export function getClerkAppearance(isDark: boolean) {
  return {
    variables: {
      colorPrimary: "#2AABEE",
      colorBackground: isDark ? "#212329" : "#FFFFFF",
      colorForeground: isDark ? "#F5F7FA" : "#111827",
      colorMutedForeground: isDark ? "#9AA3B2" : "#667085",
      colorNeutral: isDark ? "#F5F7FA" : "#111827",
      colorDanger: isDark ? "#F87171" : "#DC2626",
      borderRadius: "0.75rem",
    },
    elements: {
      modalBackdrop: "backdrop-blur-sm",
    },
  };
}
