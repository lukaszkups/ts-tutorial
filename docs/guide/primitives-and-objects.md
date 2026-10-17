# Primitives & objects - the shapes your UI eats

> Frontend code is mostly data shapes. Products, users, route params, feature flags. Let's type those first.

Frontend work is mostly **data shapes**. Start with primitives, then lock down objects and collections.

## Primitives you use daily

```ts
const label: string = 'Add to cart'
const quantity: number = 2
const inStock: boolean = true

// Prefer inference when the value is obvious
const currency = 'USD' // type: "USD" (string literal) if const
```

Prefer `const` so TypeScript can infer literal types when that's useful - button variants, status codes, that kind of thing.

## Object shapes for UI data

```ts
type ProductCard = {
  id: string
  title: string
  price: number
  imageUrl?: string // optional: may be missing from API
  tags: string[]
}

const card: ProductCard = {
  id: 'p_1',
  title: 'Mechanical keyboard',
  price: 129,
  tags: ['peripherals', 'sale'],
}
```

As you can see - nothing fancy. Just "this card has these fields, and `imageUrl` might be missing."

## Arrays, tuples, `readonly`

```ts
const prices: number[] = [10, 20, 30]
const pair: [string, number] = ['qty', 2] // fixed length + order

type CartLine = Readonly<{
  productId: string
  qty: number
}>

const line: CartLine = { productId: 'p_1', qty: 1 }
// line.qty = 2 // Error: readonly
```

Tuples show up for things like `[key, value]` entries. `readonly` helps when data shouldn't be mutated in place (Redux-style patterns, props-like objects).

## `Record` for lookup maps

```ts
type Status = 'draft' | 'published' | 'archived'

const statusLabel: Record<Status, string> = {
  draft: 'Draft',
  published: 'Live',
  archived: 'Archived',
}

// Missing a key is a type error - great for i18n maps and variant labels
```

I like this one a lot for status → label maps. Forget a key? Compiler complains. 👌

## Index signatures (use sparingly)

```ts
type StringMap = {
  [key: string]: string
}

const query: StringMap = { q: 'keyboard', sort: 'price' }
```

Prefer known keys (`type Query = { q: string; sort?: string }`) when the shape is stable. Index signatures are for truly open maps.

## Common pitfall

```ts
const ids = [] // inferred as any[] with noImplicitAny off; error with strict + no context
const productIds: string[] = [] // explicit when empty
```

Empty arrays need a type annotation (or later context). Easy to forget.

## Mini check

**Question:** How would you type a route params object like `{ productId: string; locale?: string }` and a label map for locales `en | de`?

<details>
<summary>Answer</summary>

```ts
type ProductRouteParams = {
  productId: string
  locale?: string
}

type Locale = 'en' | 'de'
const localeName: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
}
```
</details>

Next: [Unions & narrowing](./unions-narrowing).
