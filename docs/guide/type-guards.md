# Type guards - turning `unknown` into something useful

> A type guard is a check that **narrows** a type. Custom guards are how you turn `unknown` (safe) into a specific shape without `any` (yolo).

## `unknown` vs `any`

| | `any` | `unknown` |
| - | ----- | --------- |
| Assignability | Escapes the type system | Must narrow before use |
| FE default for untrusted JSON | Avoid | Prefer |

```ts
function handle(data: unknown) {
  // data.foo // Error
  if (typeof data === 'string') {
    console.log(data.toUpperCase())
  }
}
```

If I had a euro for every `any` I've removed from FE codebases… 🙂

## Built-in narrowing

`typeof`, `instanceof`, equality checks, and `in` are type guards TypeScript already understands.

```ts
function printError(err: unknown) {
  if (err instanceof Error) {
    console.error(err.message)
  } else {
    console.error(String(err))
  }
}
```

## Custom type predicates

```ts
type Product = {
  id: string
  title: string
  price: number
}

function isProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.price === 'number'
  )
}

async function loadProduct(url: string): Promise<Product> {
  const data: unknown = await fetch(url).then((r) => r.json())
  if (!isProduct(data)) {
    throw new Error('Invalid product payload')
  }
  return data // Product
}
```

Comments for the code above:

- `value is Product` is the type predicate - that's the interview detail
- after `isProduct(data)` is true, `data` is `Product`
- keep the guard honest; TypeScript will trust whatever you return

## Feature-flag / API error payloads

```ts
type FlagPayload =
  | { type: 'boolean'; value: boolean }
  | { type: 'string'; value: string }

function isFlagPayload(value: unknown): value is FlagPayload {
  if (typeof value !== 'object' || value === null) return false
  const v = value as Record<string, unknown>
  if (v.type === 'boolean' && typeof v.value === 'boolean') return true
  if (v.type === 'string' && typeof v.value === 'string') return true
  return false
}
```

## Common pitfall

```ts
function isProduct(value: unknown): value is Product {
  return true // lies - TypeScript will trust you
}
```

A wrong predicate is worse than `any`, because it **looks** safe. Keep guards honest and minimal.

## Mini check

**Question:** What does `value is Foo` mean on a function return type?

<details>
<summary>Answer</summary>

It is a type predicate: if the function returns `true`, TypeScript narrows the argument to `Foo` in that branch.
</details>

Next: [Interview drills](./interview-drills) - time to practice a bit.
