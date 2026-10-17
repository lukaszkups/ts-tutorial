# Functions - callbacks, returns, and `void`

> Most FE TypeScript bugs around functions are about callback shapes, optional args, and whether anyone should care about the return value.

## Params and return types

```ts
function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency,
  }).format(cents / 100)
}

const formatPriceArrow = (cents: number, currency: string): string =>
  formatPrice(cents, currency)
```

Let inference work for obvious returns. Annotate public APIs and the tricky callbacks.

## Optional and default parameters

```ts
function greeting(name: string, title?: string): string {
  return title ? `${title} ${name}` : name
}

function paginate(page = 1, pageSize = 20): { offset: number; limit: number } {
  return { offset: (page - 1) * pageSize, limit: pageSize }
}
```

Optional (`?`) means `T | undefined`. Defaults make the parameter optional and give you a value. Simple stuff - but interviews still ask.

## Event-handler style callbacks

```ts
type OnChange = (value: string) => void

function bindInput(onChange: OnChange) {
  onChange('next')
  // return value of onChange is ignored - void signals "fire and forget"
}

type SubmitHandler = (payload: { email: string }) => void | Promise<void>

async function submit(handler: SubmitHandler) {
  await handler({ email: 'a@b.com' })
}
```

## `void` vs `undefined`

```ts
function log(): void {
  console.log('hi')
  // may implicitly return undefined, but callers must not rely on a value
}

function maybeId(): string | undefined {
  return Math.random() > 0.5 ? 'id' : undefined
}
```

Use `void` for callbacks whose return value must not be used. Use `| undefined` when "no value" is actual data you care about.

## Mappers and list helpers

```ts
type User = { id: string; name: string }
type UserOption = { value: string; label: string }

function toOption(user: User): UserOption {
  return { value: user.id, label: user.name }
}

const options = [{ id: '1', name: 'Ada' }].map(toOption)
```

As you can see - once `toOption` is typed, `.map` just follows along. Nice.

## Light function overloads

Useful for APIs that change return type by input (shows up in lib typings and "how would you type this?" interview questions):

```ts
function getItem(key: 'theme'): 'light' | 'dark'
function getItem(key: 'token'): string
function getItem(key: string): string | null
function getItem(key: string): string | null {
  return localStorage.getItem(key)
}

const theme = getItem('theme') // 'light' | 'dark'
```

Prefer overloads sparingly. A generic or a union return is often clearer.

## Common pitfall

```ts
const handlers: Array<() => void> = [
  () => fetch('/api/ping'), // returns Promise - still assignable to void-returning!
]
```

TypeScript allows returning a value where `void` is expected in callback positions (so `.map` / listeners stay ergonomic). Don't assume `void` means "cannot return."

## Mini check

**Question:** Type a function `onSelect` that receives a `productId: string` and returns nothing meaningful to the caller.

<details>
<summary>Answer</summary>

```ts
type OnSelect = (productId: string) => void
```
</details>

Next: [Generics](./generics).
