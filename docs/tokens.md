# Design Token System

This project uses a centralized design token system that drives CSS variables, Tailwind configuration, and component styling. The system enables consistent theming and easy maintenance across the entire application.

## Overview

The token system follows the W3C Design Token Community Group (DTCG) format and provides:

- **Single source of truth**: `src/tokens/tokens.json`
- **Automatic generation**: CSS variables and Tailwind config
- **Theme support**: Light and dark mode variants
- **Semantic naming**: Role-based color tokens (not raw values)

## Token Categories

### Colors

Colors use HSL format for better theme flexibility:

```json
{
  "color": {
    "bg": {
      "canvas": { "value": "0 0% 0%", "type": "color" },
      "surface": { "value": "0 0% 5%", "type": "color" },
      "muted": { "value": "0 0% 10%", "type": "color" }
    },
    "text": {
      "primary": { "value": "0 0% 100%", "type": "color" },
      "subtle": { "value": "0 0% 70%", "type": "color" },
      "tertiary": { "value": "0 0% 50%", "type": "color" }
    }
  }
}
```

**Available color roles:**

- `bg-canvas`, `bg-surface`, `bg-muted`, `bg-elevated`
- `text`, `text-subtle`, `text-tertiary`, `text-inverse`
- `brand`, `brand-secondary`
- `accent`, `accent-contrast`
- `border`, `border-strong`, `border-focus`
- `success`, `error`, `warning`, `info`

### Spacing

Consistent spacing scale based on 4px units:

```json
{
  "space": {
    "1": "0.25rem", // 4px
    "2": "0.5rem", // 8px
    "4": "1rem", // 16px
    "6": "1.5rem", // 24px
    "8": "2rem", // 32px
    "12": "3rem", // 48px
    "24": "6rem" // 96px
  }
}
```

### Border Radius

```json
{
  "radius": {
    "2": "0.125rem", // 2px
    "6": "0.375rem", // 6px
    "12": "0.75rem", // 12px
    "24": "1.5rem", // 24px
    "pill": "9999px" // Fully rounded
  }
}
```

### Elevation (Shadows)

```json
{
  "elevation": {
    "1": {
      "x": "0",
      "y": "1px",
      "blur": "2px",
      "spread": "0",
      "color": "0 0% 0% / 0.1"
    }
  }
}
```

### Motion

```json
{
  "duration": {
    "120": "120ms",
    "200": "200ms",
    "320": "320ms",
    "480": "480ms"
  },
  "easing": {
    "standard": "cubic-bezier(0.4, 0, 0.2, 1)",
    "emphasized": "cubic-bezier(0.2, 0, 0, 1)"
  }
}
```

### Z-Index

```json
{
  "z": {
    "base": "0",
    "sticky": "10",
    "dropdown": "20",
    "modal": "40",
    "toast": "50"
  }
}
```

## Usage

### In Tailwind Classes

Use semantic color roles instead of raw values:

```html
<!-- ✅ Good: Semantic roles -->
<div class="bg-bg-surface text-text border-border">
  <p class="text-text-subtle">Subtle text</p>
</div>

<!-- ❌ Bad: Raw values -->
<div class="bg-white text-black border-gray-200">
  <p class="text-gray-600">Subtle text</p>
</div>
```

### In CSS

Use CSS custom properties:

```css
.custom-component {
  background: hsl(var(--color-bg-surface));
  color: hsl(var(--color-text-primary));
  border-radius: var(--radius-12);
  box-shadow: var(--elevation-2);
}
```

### In Components

```tsx
// React component
<div className="bg-bg-surface text-text border border-border rounded-12">
  <h3 className="text-text">Title</h3>
  <p className="text-text-subtle">Description</p>
</div>
```

## Theme Support

The system supports light and dark themes through `[data-theme]` selectors:

```css
/* Dark theme (default) */
:root {
  --color-bg-canvas: 0 0% 0%;
  --color-text-primary: 0 0% 100%;
}

/* Light theme */
[data-theme="light"] {
  --color-bg-canvas: 0 0% 100%;
  --color-text-primary: 0 0% 10%;
}
```

To switch themes, add `data-theme="light"` to the `<html>` element.

## Build Process

The token system is automatically built before development and production:

1. **Source**: `src/tokens/tokens.json`
2. **Build script**: `scripts/build-tokens.js`
3. **Outputs**:
   - `src/styles/tokens.generated.css` (CSS variables)
   - `tailwind.config.ts` (Tailwind theme)

### Manual Build

```bash
npm run tokens
```

### Automatic Build

The build script runs automatically:

- Before `npm run dev` (predev)
- Before `npm run build` (prebuild)

## Adding New Tokens

1. **Add to tokens.json**:

```json
{
  "color": {
    "accent": {
      "new-role": { "value": "200 100% 50%", "type": "color" }
    }
  }
}
```

2. **Run build script**:

```bash
npm run tokens
```

3. **Use in components**:

```html
<div class="bg-accent-new-role">Content</div>
```

## Best Practices

### ✅ Do

- Use semantic role names (`text-subtle`, not `gray-600`)
- Reference tokens in Tailwind classes (`bg-bg-surface`)
- Use HSL format for colors (better theme support)
- Group related tokens by category
- Document new token additions

### ❌ Don't

- Use hardcoded hex colors (`#ffffff`)
- Mix raw values with semantic tokens
- Create tokens for one-off values
- Skip the build process after token changes
- Use opacity modifiers (`text-white/70`) - use semantic roles instead

## Migration Guide

When migrating existing components:

1. **Replace hardcoded colors**:
   - `bg-white` → `bg-bg-surface`
   - `text-white/70` → `text-text-subtle`
   - `border-white/10` → `border-border`

2. **Update spacing**:
   - Keep existing spacing classes (they map to tokens)
   - `px-6` → `px-6` (no change needed)

3. **Update radius**:
   - `rounded-xl` → `rounded-12`
   - `rounded-lg` → `rounded-6`

4. **Update shadows**:
   - `shadow-lg` → `shadow-elevation-3`

## Troubleshooting

### Tokens not updating

1. Run the build script: `npm run tokens`
2. Check for JSON syntax errors in `tokens.json`
3. Verify the build script output

### Colors not working

1. Ensure CSS variables are imported: `@import "./tokens.generated.css"`
2. Check HSL format: `hsl(var(--color-bg-surface))`
3. Verify Tailwind config includes the color mappings

### Theme switching issues

1. Check `data-theme` attribute on `<html>`
2. Verify light theme overrides in generated CSS
3. Ensure all color roles have light theme variants

## Examples

### Card Component

```tsx
<article className="bg-bg-surface border border-border rounded-12 p-6 shadow-elevation-1">
  <h3 className="text-text text-lg font-semibold mb-2">Title</h3>
  <p className="text-text-subtle">Description text</p>
</article>
```

### Button Component

```tsx
<button className="bg-brand text-brand-secondary px-6 py-3 rounded-6 hover:bg-brand/90 transition-colors duration-200 focus-ring">
  Click me
</button>
```

### Form Input

```tsx
<input className="bg-bg-surface border border-border text-text px-4 py-3 rounded-6 focus:border-border-focus focus-ring" />
```

This token system ensures consistency, maintainability, and easy theming across the entire application.





























