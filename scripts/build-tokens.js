#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read tokens
const tokensPath = path.join(__dirname, '../src/tokens/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Generate CSS variables
function generateCSSVariables() {
  let css = ':root {\n';
  
  // Colors
  Object.entries(tokens.color).forEach(([category, values]) => {
    if (typeof values === 'object' && values.value) {
      // Single color value
      css += `  --color-${category}: ${values.value};\n`;
    } else {
      // Nested color values
      Object.entries(values).forEach(([role, token]) => {
        css += `  --color-${category}-${role}: ${token.value};\n`;
      });
    }
  });
  
  // Spacing
  Object.entries(tokens.space).forEach(([key, value]) => {
    css += `  --space-${key}: ${value};\n`;
  });
  
  // Radius
  Object.entries(tokens.radius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });
  
  // Elevation (convert to box-shadow)
  Object.entries(tokens.elevation).forEach(([key, value]) => {
    const shadow = `${value.x} ${value.y} ${value.blur} ${value.spread} hsl(${value.color})`;
    css += `  --elevation-${key}: ${shadow};\n`;
  });
  
  // Duration
  Object.entries(tokens.duration).forEach(([key, value]) => {
    css += `  --duration-${key}: ${value};\n`;
  });
  
  // Easing
  Object.entries(tokens.easing).forEach(([key, value]) => {
    css += `  --easing-${key}: ${value};\n`;
  });
  
  // Blur
  Object.entries(tokens.blur).forEach(([key, value]) => {
    css += `  --blur-${key}: ${value};\n`;
  });
  
  // Backdrop blur
  Object.entries(tokens.backdrop).forEach(([key, value]) => {
    css += `  --backdrop-${key}: ${value};\n`;
  });
  
  // Z-index
  Object.entries(tokens.z).forEach(([key, value]) => {
    css += `  --z-${key}: ${value};\n`;
  });
  
  // Typography
  Object.entries(tokens.typography.font).forEach(([key, value]) => {
    css += `  --font-${key}: ${value};\n`;
  });
  
  Object.entries(tokens.typography.size).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });
  
  Object.entries(tokens.typography.line).forEach(([key, value]) => {
    css += `  --leading-${key}: ${value};\n`;
  });
  
  Object.entries(tokens.typography.tracking).forEach(([key, value]) => {
    css += `  --tracking-${key}: ${value};\n`;
  });
  
  css += '}\n\n';
  
  // Light theme overrides
  css += '[data-theme="light"] {\n';
  css += '  --color-bg-canvas: 0 0% 100%;\n';
  css += '  --color-bg-surface: 0 0% 98%;\n';
  css += '  --color-bg-muted: 0 0% 95%;\n';
  css += '  --color-bg-elevated: 0 0% 0% / 0.05;\n';
  css += '  --color-text-primary: 0 0% 10%;\n';
  css += '  --color-text-subtle: 0 0% 40%;\n';
  css += '  --color-text-tertiary: 0 0% 60%;\n';
  css += '  --color-text-inverse: 0 0% 100%;\n';
  css += '  --color-brand-primary: 258 55% 63%;\n';
  css += '  --color-brand-secondary: 0 0% 100%;\n';
  css += '  --color-accent-primary: 0 0% 0%;\n';
  css += '  --color-accent-contrast: 0 0% 100%;\n';
  css += '  --color-border-default: 0 0% 0% / 0.1;\n';
  css += '  --color-border-strong: 0 0% 0% / 0.2;\n';
  css += '  --color-border-focus: 0 0% 0% / 0.4;\n';
  css += '}\n';
  
  return css;
}

// Generate Tailwind config
function generateTailwindConfig() {
  const config = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-sans)"],
          mono: ["var(--font-mono)"],
        },
        colors: {
          // Background colors
          'bg-canvas': 'hsl(var(--color-bg-canvas))',
          'bg-surface': 'hsl(var(--color-bg-surface))',
          'bg-muted': 'hsl(var(--color-bg-muted))',
          'bg-elevated': 'hsl(var(--color-bg-elevated))',
          
          // Text colors
          'text': 'hsl(var(--color-text-primary))',
          'text-subtle': 'hsl(var(--color-text-subtle))',
          'text-tertiary': 'hsl(var(--color-text-tertiary))',
          'text-inverse': 'hsl(var(--color-text-inverse))',
          
          // Brand colors
          'brand': 'hsl(var(--color-brand-primary))',
          'brand-secondary': 'hsl(var(--color-brand-secondary))',
          
          // Accent colors
          'accent': 'hsl(var(--color-accent-primary))',
          'accent-contrast': 'hsl(var(--color-accent-contrast))',
          
          // Border colors
          'border': 'hsl(var(--color-border-default))',
          'border-strong': 'hsl(var(--color-border-strong))',
          'border-focus': 'hsl(var(--color-border-focus))',
          
          // Status colors
          'success': 'hsl(var(--color-status-success))',
          'error': 'hsl(var(--color-status-error))',
          'warning': 'hsl(var(--color-status-warning))',
          'info': 'hsl(var(--color-status-info))',
        },
        spacing: {
          '1': 'var(--space-1)',
          '2': 'var(--space-2)',
          '3': 'var(--space-3)',
          '4': 'var(--space-4)',
          '5': 'var(--space-5)',
          '6': 'var(--space-6)',
          '8': 'var(--space-8)',
          '10': 'var(--space-10)',
          '12': 'var(--space-12)',
          '16': 'var(--space-16)',
          '20': 'var(--space-20)',
          '24': 'var(--space-24)',
        },
        borderRadius: {
          '2': 'var(--radius-2)',
          '6': 'var(--radius-6)',
          '12': 'var(--radius-12)',
          '24': 'var(--radius-24)',
          'pill': 'var(--radius-pill)',
        },
        boxShadow: {
          'elevation-1': 'var(--elevation-1)',
          'elevation-2': 'var(--elevation-2)',
          'elevation-3': 'var(--elevation-3)',
          'elevation-4': 'var(--elevation-4)',
          'elevation-5': 'var(--elevation-5)',
        },
        transitionDuration: {
          '120': 'var(--duration-120)',
          '200': 'var(--duration-200)',
          '320': 'var(--duration-320)',
          '480': 'var(--duration-480)',
        },
        transitionTimingFunction: {
          'standard': 'var(--easing-standard)',
          'emphasized': 'var(--easing-emphasized)',
          'entrance': 'var(--easing-entrance)',
          'exit': 'var(--easing-exit)',
        },
        backdropBlur: {
          '4': 'var(--blur-4)',
          '8': 'var(--blur-8)',
          '16': 'var(--blur-16)',
        },
        zIndex: {
          'base': 'var(--z-base)',
          'sticky': 'var(--z-sticky)',
          'dropdown': 'var(--z-dropdown)',
          'modal': 'var(--z-modal)',
          'toast': 'var(--z-toast)',
        },
        screens: {
          'sm': '375px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1440px',
        },
        fontSize: {
          'xs': ['var(--text-xs)', { lineHeight: 'var(--leading-tight)' }],
          'sm': ['var(--text-sm)', { lineHeight: 'var(--leading-tight)' }],
          'md': ['var(--text-md)', { lineHeight: 'var(--leading-normal)' }],
          'lg': ['var(--text-lg)', { lineHeight: 'var(--leading-normal)' }],
          'xl': ['var(--text-xl)', { lineHeight: 'var(--leading-normal)' }],
          '2xl': ['var(--text-2xl)', { lineHeight: 'var(--leading-tight)' }],
          '3xl': ['var(--text-3xl)', { lineHeight: 'var(--leading-tight)' }],
          '4xl': ['var(--text-4xl)', { lineHeight: 'var(--leading-tight)' }],
          '5xl': ['var(--text-5xl)', { lineHeight: 'var(--leading-tight)' }],
          '6xl': ['var(--text-6xl)', { lineHeight: 'var(--leading-tight)' }],
        },
        letterSpacing: {
          '-1': 'var(--tracking--1)',
          '0': 'var(--tracking-0)',
          '1': 'var(--tracking-1)',
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: "none",
              color: "inherit",
              a: {
                color: "inherit",
                textDecoration: "underline",
                fontWeight: "500",
                "&:hover": {
                  opacity: "0.8",
                },
              },
              strong: {
                color: "inherit",
                fontWeight: "600",
              },
              code: {
                color: "inherit",
                backgroundColor: "hsl(var(--color-bg-elevated))",
                padding: "0.25rem 0.5rem",
                borderRadius: "var(--radius-2)",
                fontWeight: "400",
              },
              "code::before": {
                content: '""',
              },
              "code::after": {
                content: '""',
              },
            },
          },
        },
      },
    },
    plugins: ["@tailwindcss/typography"],
  };
  
  return `import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default ${JSON.stringify(config, null, 2).replace(
    '"plugins": [\n    "@tailwindcss/typography"\n  ]',
    '"plugins": [\n    typography\n  ]'
  )} satisfies Config;
`;
}

// Write files
const cssOutput = path.join(__dirname, '../src/styles/tokens.generated.css');
const tailwindOutput = path.join(__dirname, '../tailwind.config.ts');

fs.writeFileSync(cssOutput, generateCSSVariables());
fs.writeFileSync(tailwindOutput, generateTailwindConfig());

console.log('✅ Tokens generated successfully!');
console.log(`📄 CSS variables: ${cssOutput}`);
console.log(`⚙️  Tailwind config: ${tailwindOutput}`);
