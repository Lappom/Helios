export const clerkAppearance = {
  variables: {
    colorBackground: "#0a0a0a",
    colorInputBackground: "#1a1a1a",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#a3a3a3",
    colorPrimary: "#faff69",
    colorDanger: "#ef4444",
    borderRadius: "8px",
    fontFamily: "var(--font-sans), Inter, sans-serif",
  },
  elements: {
    card: "bg-surface-card border border-hairline shadow-none",
    headerTitle: "text-on-dark font-semibold",
    headerSubtitle: "text-muted",
    formButtonPrimary:
      "bg-primary text-on-primary font-semibold hover:bg-primary/90",
    footerActionLink: "text-primary hover:text-primary/80",
    socialButtonsBlockButton:
      "bg-surface-card border border-hairline text-on-dark",
    formFieldInput: "bg-surface-card border-hairline text-on-dark",
  },
} as const;
