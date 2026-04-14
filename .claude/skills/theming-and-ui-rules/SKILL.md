---
name: theming-and-ui-rules
description: Rules for UI/theming screens and components. Use this skill to understand how to apply components, build screens, and theme them correctly using Shadcn UI with full light/dark mode support.
---

# Theming & UI Rules

## Core Theming Principles

1. **Shadcn UI theming system** is the single source of truth for all visual styling. Use CSS variables defined in `globals.css` (e.g., `--background`, `--foreground`, `--primary`, `--muted`, etc.) — never hardcode colors.
2. **Always support light and dark mode.** Every screen and component must look correct in both. Use Tailwind's `dark:` variant only when a CSS variable alone is insufficient.
3. **Never use raw color classes** like `bg-white`, `text-black`, `bg-gray-100`, etc. Always prefer semantic tokens: `bg-background`, `text-foreground`, `bg-muted`, `text-muted-foreground`, `border-border`, and so on.
4. **Text must always be readable** in both themes. Pair backgrounds with their semantic foreground counterparts (e.g., `bg-card` + `text-card-foreground`).

## Shadcn Component Installation — CRITICAL

5. **Before using any Shadcn UI component, verify it exists in `components/ui/`.** Do not assume a component is installed.
6. **If a required Shadcn component is NOT present in `components/ui/`, you MUST stop and ask the user to install it before writing any code that depends on it.** Example request:

   > "This requires the `Dialog` component from Shadcn UI, which isn't installed yet. Please run the following in your terminal, then let me know when it's done:"
   >
   > ```bash
   > npx shadcn@latest add dialog
   > ```

7. **Never write code that imports from `components/ui/<component>` if that file does not exist yet.** Doing so will break the build. Always confirm installation first.
8. **Never recreate or reimplement a Shadcn UI component manually.** If it's not installed, ask for installation — don't build a substitute.
9. **You cannot run terminal commands yourself.** Always provide the exact command and wait for the user to confirm it ran successfully before proceeding.

## File & Folder Structure

10. **Custom components** go directly inside the `components/` folder (not inside `components/ui/`). Follow existing naming conventions (PascalCase filenames).
11. **`components/ui/`** is reserved exclusively for Shadcn UI generated components. Do not place custom logic or wrappers here.
12. **Never edit files inside `components/ui/`**. If a Shadcn component needs customization, create a wrapper component in `components/` that imports and extends it.

## Component Authoring Rules

13. **Use `cn()` utility** (from `lib/utils`) to merge Tailwind classes conditionally — never concatenate class strings manually.
14. **Prefer Shadcn primitives** (Button, Card, Input, Badge, etc.) over raw HTML elements whenever a suitable component exists.
15. **Compound components** (e.g., Card with CardHeader, CardContent, CardFooter) should always be used together as intended — don't strip structural subcomponents.
16. **Interactive states** (hover, focus, disabled) must be visible and consistent in both themes. Rely on Shadcn's built-in variants rather than overriding with raw Tailwind.

## Dark Mode Implementation

17. Dark mode is controlled via the `dark` class on the `<html>` element (class strategy). Do not use `media` strategy unless explicitly required.
18. When building new layouts or pages, verify the design in both themes before considering it done.
19. Illustrations, icons, and images that are theme-sensitive should use conditional rendering or CSS filters to adapt — document this when it applies.
