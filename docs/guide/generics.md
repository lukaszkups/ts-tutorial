# Generics - one function, many shapes

> Type parameters. Fancy name for "this works for some `T` the caller chooses." Super common with lists, fetch helpers, and hooks/composables.

## Why generics

```ts
function firstString(items: string[]): string | undefined {
  return items[0]
}

function firstNumber(items: number[]): number | undefined {
  return items[0]
}

// One function, many element types
function first<T>(items: T[]): T | undefined {
  return items[0]
}

const a = first(['a', 'b']) // string | undefined
const b = first([1, 2]) // number | undefined
```

As you can see - same helper, no copy-paste for every element type. 🙌

## Constrained generics

```ts
type HasId = { id: string }

function byId<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id)
}

byId([{ id: '1', title: 'Desk' }], '1')
```

`extends` limits what `T` can be so you can safely use `.id`. Classic interview pattern.

## Default type parameters

```ts
type ApiResponse<T = unknown> = {
  data: T
  meta?: { page: number }
}

type Loose = ApiResponse // data: unknown
type Products = ApiResponse<Product[]>
```

## `fetchJson<T>` pattern

```ts
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json() as Promise<T>
}

type Product = { id: string; title: string }

const product = await fetchJson<Product>('/api/products/1')
product.title
```

Important detail: that cast is an **assumption** at the boundary. Pair it with runtime validation in production (see [Type guards](./type-guards)). Interviews still expect you to know this generic pattern though.

## `keyof` for safe property access

```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const title = pluck({ id: '1', title: 'Lamp' }, 'title') // string
```

## Common pitfall

```ts
async function badFetch<T>(): Promise<T> {
  return {} as T // lies about the type - compiles, crashes later
}
```

Generics do not create values. If you can't produce a real `T`, don't fake it with `as T`. Which now DOESN'T WORK the way you hoped at runtime. 😅

## Mini check

**Question:** Type a helper `unwrapList` that takes `{ items: T[] }` and returns `T[]`.

<details>
<summary>Answer</summary>

```ts
function unwrapList<T>(payload: { items: T[] }): T[] {
  return payload.items
}
```
</details>

Next: [Async & APIs](./async-and-apis).
