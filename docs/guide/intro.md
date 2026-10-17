# TypeScript basics for frontend folks (2026)

> Not a textbook. Just the TypeScript bits you'll actually use in FE work - and the ones that show up in interviews.

TypeScript in frontend isn't about collecting fancy types for sport. It's about making the shapes your UI already depends on - API payloads, form drafts, loading states, event handlers - visible to the compiler before a user hits a bug. 🙂

I've kept this guide focused on **basics that show up in real FE code and interviews in 2026**. We stay framework-agnostic first, then there's a light React chapter and a fuller Vue one.

## What "basics" means here

Stuff we'll actually practice:

- describing object shapes (`interface` / `type`)
- unions and narrowing (especially discriminated unions for UI state)
- typing functions and generics used with lists and `fetch`
- avoiding `any` with `unknown` and type guards
- everyday utility types (`Partial`, `Pick`, `Omit`, …)

We're **not** going into advanced conditional types, variance, or declaration merging. Useful later - not the first thing most FE interviews poke at.

## A real FE scenario

You fetch a product and render a card. Without types, a renamed field is a silent runtime failure:

```ts
// Runtime-only: typo survives until the UI blanks out
async function loadProduct(id: string) {
  const res = await fetch(`/api/products/${id}`)
  const data = await res.json()
  return data.titel // oops - should be title
}
```

With a type, the mistake becomes a compile error:

```ts
type Product = {
  id: string
  title: string
  price: number
}

async function loadProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  const data: Product = await res.json()
  return data.title // OK
  // return data.titel // Error: Property 'titel' does not exist
}
```

As you can see - same idea, but the typo dies in the editor instead of in production.

(`res.json()` is still a bit `any`-ish at the boundary - we clean that up properly in [Async & APIs](./async-and-apis) and [Type guards](./type-guards).)

## How to use this guide

Each page roughly follows the same flow:

1. a frontend scenario
2. a typed example
3. a common pitfall
4. a mini interview-style check

Start with [Setup](./setup), then follow the sidebar. Or jump straight to [Interview drills](./interview-drills) if you just want practice prompts with answers.

## Mini check

**Question:** Name one frontend bug TypeScript catches that unit tests often miss until late.

<details>
<summary>Answer</summary>

Renamed or mistyped property access on API / component data (e.g. `product.titel`). Types fail at compile time across every call site; a test only fails if that path is covered.
</details>

Next up: [Setup](./setup).
