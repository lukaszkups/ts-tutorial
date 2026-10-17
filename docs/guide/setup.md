# Setup - what you actually need

> You don't need a special "TypeScript app". Most FE tools already speak TS. You just need to know who does what.

You don't need some fancy ritual to learn these basics. In 2026 most FE tools (Vite, Next, Nuxt, etc.) ship TypeScript support out of the box. Mentally separate three jobs: **writing** `.ts` / `.tsx` / `.vue`, **type-checking**, and **bundling**.

## Mental model

| Layer | Job |
| ----- | --- |
| Editor + `tsc` / `vue-tsc` | Catch type errors |
| Vite / bundler | Emit JS for the browser |
| Runtime | Runs JS only - types are gone |

Vite strips types during build. A green production build does **not** prove your types are fine - unless you also run a typecheck in CI. Ask me how I know. 😅

## `tsconfig` knobs FE folks care about

Start from `strict: true`. That turns on the checks that actually matter for UI code:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "preserve",
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

Comments for the config above - what interviews usually care about:

- **`strictNullChecks`** (via `strict`) - `string | null` is not a `string`. That's why optional chaining and narrowing show up everywhere.
- **`noImplicitAny`** - parameters without types become errors instead of silent `any`.
- **`moduleResolution: "bundler"`** - matches how Vite resolves imports.
- **`paths`** - aliases like `@/components/...`; your bundler must mirror them (Vite `resolve.alias`).

## Vite + TypeScript (typical FE)

1. `npm create vite@latest` and pick a TS template, or just add `typescript` to an existing Vite app.
2. Keep `noEmit: true` - Vite emits, `tsc` only checks.
3. Add a script: `"typecheck": "tsc --noEmit"` (or `vue-tsc --noEmit` for Vue).

## Common pitfall

Treating `// @ts-ignore` or `as any` as a setup strategy. Prefer fixing the type, narrowing with a guard, or typing the API boundary once.

```ts
// Avoid as a habit
const product = data as any

// Prefer: define the shape, then validate or assert at the edge
type Product = { id: string; title: string }
```

## Mini check

**Question:** Why can `vite build` succeed while types are broken?

<details>
<summary>Answer</summary>

The bundler erases types and does not fully type-check. You need `tsc --noEmit` / `vue-tsc` (ideally in CI) to catch type errors.
</details>

Next: [Primitives & objects](./primitives-and-objects).
