export const authAppearance = {
  baseTheme: undefined,
  variables: {
    colorPrimary: "#2AABEE",
    colorBackground: "transparent",
    colorInputBackground: "#f4f5f6",
    colorInputText: "#0c0f14",
    colorText: "#0c0f14",
    colorTextSecondary: "#6b6e73",
    colorDanger: "#dc2626",
    colorNeutral: "#0c0f14",
    borderRadius: "0.75rem",
    fontFamily: "Inter, system-ui, sans-serif",
    spacingUnit: "1rem",
  },
  layout: {
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
  },
  elements: {
    rootBox: "w-full !max-w-none !m-0 overflow-visible shadow-none !bg-transparent",
    cardBox: "w-full !max-w-none !m-0 overflow-visible shadow-none border-0 !bg-transparent",
    card: "w-full !max-w-none !m-0 overflow-visible shadow-none border-0 !bg-transparent !p-0",
    main: "w-full !max-w-none overflow-visible shadow-none border-0 !bg-transparent",
    scrollBox: "overflow-visible !bg-transparent",
    header: "hidden",
    headerTitle: "hidden",
    headerSubtitle: "hidden",
    footer: "hidden",
    footerAction: "hidden",
    footerActionText: "hidden",
    footerActionLink: "hidden",
    logoBox: "hidden",
    badge: "hidden",
    identityPreview: "hidden",
    socialButtons: "w-full !flex !flex-row !gap-3",
    socialButtonsBlockButton:
      "!flex-1 !bg-[#f4f5f6] !text-[#0c0f14] !border !border-[#d8dce2] hover:!bg-[#E8F6FD]",
    socialButtonsBlockButtonText: "!text-[#0c0f14]",
    form: "w-full",
    formFieldRow: "w-full",
    formFieldInput: "!bg-[#f4f5f6] !text-[#0c0f14] w-full",
    formButtonPrimary: "!bg-[#2AABEE] hover:!bg-[#1E96D8] w-full",
  },
};

export const authLocalization = {
  signIn: {
    start: {
      title: "Welcome",
      subtitle: "",
    },
  },
  signUp: {
    start: {
      title: "Create account",
      subtitle: "",
    },
  },
} as const;
