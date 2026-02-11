import { StyleGuide } from "@/redux/api/style-guide";

export const mockStyleGuide: StyleGuide = {
  theme: "light",
  description: "A clean, modern and accessible design system for the app UI.",
  colorSections: [
    {
      title: "Primary Colors",
      swatches: [
        {
          name: "Primary Blue",
          hexColor: "#3b82f6",
          description:
            "Main brand color used for primary actions and highlights.",
        },
        {
          name: "Primary Dark Blue",
          hexColor: "#2563eb",
          description: "Used for hover and active states of primary elements.",
        },
        {
          name: "Primary Red",
          hexColor: "#ef4444",
          description: "Used for errors, destructive actions, and alerts.",
        },
        {
          name: "Primary Green",
          hexColor: "#22c55e",
          description: "Indicates successful actions or states.",
        }
      ],
    },
    {
      title: "Secondary & Accent Colors",
      swatches: [
        {
          name: "Accent Purple",
          hexColor: "#8b5cf6",
          description: "Accent color for highlights and special UI elements.",
        },
        {
          name: "Accent Pink",
          hexColor: "#ec4899",
          description: "Used for decorative elements and emphasis.",
        },
        {
          name: "Accent Orange",
          hexColor: "#f97316",
          description: "Used for warnings and important highlights.",
        },
        {
          name: "Accent Teal",
          hexColor: "#14b8a6",
          description: "Used for informational messages and highlights.",
        }
      ],
    },
    {
      title: "UI Component Colors",
      swatches: [
        {
          name: "Card Background",
          hexColor: "#ffffff",
          description: "Background color for cards and surfaces.",
        },
        {
          name: "Border Gray",
          hexColor: "#e5e7eb",
          description: "Used for borders, dividers, and outlines.",
        },
        {
          name: "Overlay silver",
          hexColor: "#f9fafb",
          description: "Used for overlays and modals.",
        },
        {
          name: "Shadow Purple",
          hexColor: "#8b5cf6",
          description: "Used for shadows and elevations.",
        }
      ],
    },
    {
      title: "Utility & Font Colors",
      swatches: [
        {
          name: "Primary Text",
          hexColor: "#111827",
          description: "Main text color for headings and body text.",
        },
        {
          name: "Muted Text",
          hexColor: "#6b7280",
          description: "Used for secondary text and placeholders.",
        },
        {
          name: "Violent Gray",
          hexColor: "#374151",
          description: "Used for dark text and elements.",
        },
        {
          name: "Disabled Gray",
          hexColor: "#9ca3af",
          description: "Used for disabled text and elements.",
        }
      ],
    },
    {
      title: "Status & Feedback Colors",
      swatches: [
        {
          name: "Success Green",
          hexColor: "#22c55e",
          description: "Indicates successful actions or states.",
        },
        {
          name: "Error Red",
          hexColor: "#ef4444",
          description: "Used for errors, destructive actions, and alerts.",
        },
        {
          name: "Warning Yellow",
          hexColor: "#fbbf24",
          description: "Used for warnings and important highlights.",
        },
        {
          name: "Info Blue",
          hexColor: "#3b82f6",
          description: "Used for informational messages and highlights.",
        }
      ],
    },
  ],
  typographySections: [
    {
      title: "Headings",
      styles: [
        {
          name: "H1",
          fontFamily: "Inter, sans-serif",
          fontSize: "32px",
          fontWeight: "700",
          lineHeight: "40px",
          letterSpacing: "-0.02em",
          description: "Main page headings.",
        },
        {
          name: "H2",
          fontFamily: "Inter, sans-serif",
          fontSize: "24px",
          fontWeight: "600",
          lineHeight: "32px",
          letterSpacing: "-0.01em",
          description: "Section headings.",
        },
      ],
    },
    {
      title: "Body Text",
      styles: [
        {
          name: "Body Regular",
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "24px",
          letterSpacing: "0em",
          description: "Default body text.",
        },
        {
          name: "Body Small",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "400",
          lineHeight: "20px",
          letterSpacing: "0em",
          description: "Secondary text and captions.",
        },
      ],
    },
    {
      title: "UI Labels",
      styles: [
        {
          name: "Button Text",
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "20px",
          letterSpacing: "0.02em",
          description: "Text used inside buttons.",
        },
        {
          name: "Overline",
          fontFamily: "Inter, sans-serif",
          fontSize: "12px",
          fontWeight: "600",
          lineHeight: "16px",
          letterSpacing: "0.08em",
          description: "Small uppercase labels and badges.",
        },
      ],
    },
  ],
};
