# Async & APIs - typing JSON you don't control

> Almost every FE app talks to HTTP. The hard part is typing that JSON without sliding into `any`.

## `Promise` basics

```ts
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function loadLabel(): Promise<string> {
  await delay(100)
  return 'Ready'
}
```

`async` functions always return a `Promise`. Annotate the resolved type - don't wrap `Promise` twice by accident.

## Typing REST responses

```ts
type Product = {
  id: string
  title: string
  price: number
}

type ApiErrorBody = {
  message: string
  code?: string
}

async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`/api/products/${id}`)
  if (!res.ok) {
    const err = (await res.json()) as ApiErrorBody
    throw new Error(err.message ?? `HTTP ${res.status}`)
  }
  return (await res.json()) as Product
}
```

## Prefer result unions when the UI needs both paths

```ts
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string }

async function getProductResult(id: string): Promise<Result<Product>> {
  try {
    const res = await fetch(`/api/products/${id}`)
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` }
    }
    const data = (await res.json()) as Product
    return { ok: true, data }
  } catch {
    return { ok: false, error: 'Network error' }
  }
}

const result = await getProductResult('1')
if (result.ok) {
  console.log(result.data.title)
} else {
  console.error(result.error)
}
```

This pairs really well with [discriminated unions](./unions-narrowing) for rendering. I've used this shape more times than I can count.

## Why `res.json()` is dangerous

```ts
const data = await res.json() // any (or unknown in some lib configs)
data.foo.bar.baz // no safety
```

Always give JSON a type **and** decide how much you trust it:

1. **Cast** (`as Product`) - fine for prototypes / trusted internal APIs
2. **Validate** (zod, valibot, custom guards) - preferred for public / unstable APIs

## Common pitfall

```ts
async function load(): Promise<Product[]> {
  const data = await fetch('/api/products').then((r) => r.json())
  return data // if data is any, this "works" while being unsafe
}
```

Enable `strict` and type the boundary explicitly so `any` doesn't leak into your UI. Silent `any` is how you get "it compiled, why is production broken?" nights.

## Mini check

**Question:** What is the resolved type of `async function f() { return 1 }`?

<details>
<summary>Answer</summary>

`Promise<number>`. Callers use `await f()` to get `number`.
</details>

Next: [Utility types](./utility-types).
