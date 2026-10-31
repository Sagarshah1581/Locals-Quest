# Implementation Plan: Curated Background Presets & Warm Linen Atmosphere

This plan introduces curated background color options into **Locals' Quest**, setting **Warm Sand & Linen Cream** as the warm, editorial default background aesthetic while providing selectable background presets inside the interactive Theme Palette modal.

---

## User Review Required

> [!IMPORTANT]
> **Default Atmosphere**: Warm Sand & Linen Cream will be applied as the default background atmosphere for the web app, paired with the active Electric Cobalt and Charcoal accent palette.
> **Background Preset Switcher**: Users will be able to select and switch between 5 curated background atmospheres (Warm Sand & Linen, Crisp Mist & Slate, Deep Midnight Navy, Organic Soft Sage, Pure Alabaster) directly in the Theme modal.

---

## Proposed Changes

### Theme System Enhancement (`src/utils/theme.ts`)

- Define a new `BackgroundTheme` interface and 5 curated presets:
  1. **Warm Sand & Linen Cream** *(Default)*:
     - Canvas: `#FAF7F2` (Warm linen wash)
     - Card / Surface: `#FFFFFF` / `#FAF6EF` (Soft parchment warmth)
     - Subtle fill: `#F3EDE2`
     - Border: `#E8E0D1`
     - Text: `#1E1B18`
  2. **Crisp Mist & Slate Gray**:
     - Canvas: `#F8FAFC`, Surface: `#FFFFFF`, Subtle: `#F1F5F9`, Border: `#E2E8F0`, Text: `#0F172A`
  3. **Deep Midnight Navy** *(Dark adventure contrast)*:
     - Canvas: `#0B0F19`, Surface: `#131B2E`, Subtle: `#1E293B`, Border: `#2D3B55`, Text: `#F8FAFC`
  4. **Organic Soft Sage & Stone**:
     - Canvas: `#F3F6F3`, Surface: `#FFFFFF`, Subtle: `#E8EFE8`, Border: `#D5E0D5`, Text: `#142017`
  5. **Pure Minimalist Light**:
     - Canvas: `#FAFAFA`, Surface: `#FFFFFF`, Subtle: `#F4F4F5`, Border: `#E4E4E7`, Text: `#18181B`
- Add CSS variables:
  - `--bg-canvas`
  - `--bg-surface`
  - `--bg-subtle`
  - `--border-theme`
  - `--text-heading`
  - `--text-body`
- Provide helper functions:
  - `getStoredBackgroundTheme()` and `setBackgroundTheme(id)`
  - Sync with `localStorage` (`locals_quest_bg_theme`)
  - `applyTheme(accentThemeId, bgThemeId)` to synchronize accent colors and background atmosphere simultaneously.

---

### Interactive Modal Integration (`src/components/ThemeSwitcherModal.tsx`)

- Add a dedicated **"Canvas Atmosphere & Background"** section right above the accent color swatches.
- Render visual swatch cards for each background option with live preview of canvas, card surface, and border tone.
- Mark the active background with an accent ring and checkmark badge.
- Include one-click "Reset to Warm Sand & Cobalt" default button.

---

### App Layout & Component Adaptation (`src/App.tsx`, `Header.tsx`, `SearchBarAndFilters.tsx`)

- Update the root application container in `src/App.tsx`:
  - Dynamically apply `--bg-canvas` to the outer viewport.
  - Dynamically apply `--bg-surface` and `--border-theme` to the central card container and section rails.
- Ensure Header, Search bar, and sticky filter controls harmonize with the background variable tokens while retaining full legibility and crisp contrast.

---

## Verification Plan

### Automated Build Verification
- Run `compile_applet` to ensure TypeScript compilation, JSX structure, and Vite bundle succeed without errors or broken imports.

### Interactive UX Verification
- Verify that **Warm Sand & Linen Cream** applies immediately upon first load.
- Open the Theme Palette modal and verify that all 5 background presets are displayed with visual swatches.
- Switch between background presets (e.g. Crisp Slate, Deep Midnight, Soft Sage) and verify smooth transitions and consistent contrast.
- Verify persistence across page refresh via `localStorage`.
