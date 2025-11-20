import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  "content": [
    "./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"
  ],
  "theme": {
    "extend": {
      "fontFamily": {
        "sans": [
          "var(--font-sans)"
        ],
        "mono": [
          "var(--font-mono)"
        ]
      },
      "colors": {
        "bg-canvas": "hsl(var(--color-bg-canvas))",
        "bg-surface": "hsl(var(--color-bg-surface))",
        "bg-muted": "hsl(var(--color-bg-muted))",
        "bg-elevated": "hsl(var(--color-bg-elevated))",
        "text": "hsl(var(--color-text-primary))",
        "text-subtle": "hsl(var(--color-text-subtle))",
        "text-tertiary": "hsl(var(--color-text-tertiary))",
        "text-inverse": "hsl(var(--color-text-inverse))",
        "brand": "hsl(var(--color-brand-primary))",
        "brand-secondary": "hsl(var(--color-brand-secondary))",
        "accent": "hsl(var(--color-accent-primary))",
        "accent-contrast": "hsl(var(--color-accent-contrast))",
        "border": "hsl(var(--color-border-default))",
        "border-strong": "hsl(var(--color-border-strong))",
        "border-focus": "hsl(var(--color-border-focus))",
        "success": "hsl(var(--color-status-success))",
        "error": "hsl(var(--color-status-error))",
        "warning": "hsl(var(--color-status-warning))",
        "info": "hsl(var(--color-status-info))"
      },
      "spacing": {
        "1": "var(--space-1)",
        "2": "var(--space-2)",
        "3": "var(--space-3)",
        "4": "var(--space-4)",
        "5": "var(--space-5)",
        "6": "var(--space-6)",
        "8": "var(--space-8)",
        "10": "var(--space-10)",
        "12": "var(--space-12)",
        "16": "var(--space-16)",
        "20": "var(--space-20)",
        "24": "var(--space-24)"
      },
      "borderRadius": {
        "2": "var(--radius-2)",
        "6": "var(--radius-6)",
        "12": "var(--radius-12)",
        "24": "var(--radius-24)",
        "pill": "var(--radius-pill)"
      },
      "boxShadow": {
        "elevation-1": "var(--elevation-1)",
        "elevation-2": "var(--elevation-2)",
        "elevation-3": "var(--elevation-3)",
        "elevation-4": "var(--elevation-4)",
        "elevation-5": "var(--elevation-5)"
      },
      "transitionDuration": {
        "120": "var(--duration-120)",
        "200": "var(--duration-200)",
        "320": "var(--duration-320)",
        "480": "var(--duration-480)"
      },
      "transitionTimingFunction": {
        "standard": "var(--easing-standard)",
        "emphasized": "var(--easing-emphasized)",
        "entrance": "var(--easing-entrance)",
        "exit": "var(--easing-exit)"
      },
      "backdropBlur": {
        "4": "var(--blur-4)",
        "8": "var(--blur-8)",
        "16": "var(--blur-16)"
      },
      "zIndex": {
        "base": "var(--z-base)",
        "sticky": "var(--z-sticky)",
        "dropdown": "var(--z-dropdown)",
        "modal": "var(--z-modal)",
        "toast": "var(--z-toast)"
      },
      "screens": {
        "sm": "375px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1440px"
      },
      "fontSize": {
        "xs": [
          "var(--text-xs)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "sm": [
          "var(--text-sm)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "md": [
          "var(--text-md)",
          {
            "lineHeight": "var(--leading-normal)"
          }
        ],
        "lg": [
          "var(--text-lg)",
          {
            "lineHeight": "var(--leading-normal)"
          }
        ],
        "xl": [
          "var(--text-xl)",
          {
            "lineHeight": "var(--leading-normal)"
          }
        ],
        "2xl": [
          "var(--text-2xl)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "3xl": [
          "var(--text-3xl)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "4xl": [
          "var(--text-4xl)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "5xl": [
          "var(--text-5xl)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ],
        "6xl": [
          "var(--text-6xl)",
          {
            "lineHeight": "var(--leading-tight)"
          }
        ]
      },
      "letterSpacing": {
        "0": "var(--tracking-0)",
        "1": "var(--tracking-1)",
        "-1": "var(--tracking--1)"
      },
      "typography": {
        "DEFAULT": {
          "css": {
            "maxWidth": "none",
            "color": "inherit",
            "a": {
              "color": "inherit",
              "textDecoration": "underline",
              "fontWeight": "500",
              "&:hover": {
                "opacity": "0.8"
              }
            },
            "strong": {
              "color": "inherit",
              "fontWeight": "600"
            },
            "code": {
              "color": "inherit",
              "backgroundColor": "hsl(var(--color-bg-elevated))",
              "padding": "0.25rem 0.5rem",
              "borderRadius": "var(--radius-2)",
              "fontWeight": "400"
            },
            "code::before": {
              "content": "\"\""
            },
            "code::after": {
              "content": "\"\""
            }
          }
        }
      }
    }
  },
  "plugins": [
    typography
  ]
} satisfies Config;
