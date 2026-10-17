# Unions & narrowing - UI state without the soup

> "This value is one of several shapes." That's most of your loading screens, button variants, and API results.

Unions model "this value is one of several shapes." Narrowing is how you teach TypeScript which shape you're currently in. Critical for UI state and variants.

## Basic unions

```ts
type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type Id = string | number

function formatId(id: Id): string {
  if (typeof id === 'number') {
    return String(id) // narrowed to number
  }
  return id // narrowed to string
}
```

## Discriminated unions for UI state

This pattern shows up constantly in interviews and in real apps (loading screens, query results, remote data):

```ts
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function renderUser(state: AsyncState<{ name: string }>): string {
  switch (state.status) {
    case 'idle':
      return 'Pick a user'
    case 'loading':
      return 'Loading…'
    case 'success':
      return state.data.name // OK: data exists
    case 'error':
      return state.error // OK: error exists
  }
}
```

Comments for the code above:

- the discriminant is `status`
- once you check it, TypeScript knows which fields exist
- this beats optional soup every day of the week

```ts
// Harder to keep consistent
type MessyState<T> = {
  loading: boolean
  data?: T
  error?: string
}
```

## Narrowing with `in` and equality

```ts
type Success = { ok: true; value: string }
type Failure = { ok: false; message: string }
type Result = Success | Failure

function message(result: Result): string {
  if (result.ok) return result.value
  return result.message
}

type Circle = { kind: 'circle'; radius: number }
type Rect = { kind: 'rect'; width: number; height: number }

function area(shape: Circle | Rect): number {
  if ('radius' in shape) return Math.PI * shape.radius ** 2
  return shape.width * shape.height
}
```

## Button / component variants

```ts
type IconButton = {
  kind: 'icon'
  icon: string
  label: string // a11y
}

type TextButton = {
  kind: 'text'
  label: string
}

type ButtonProps = IconButton | TextButton

function buttonLabel(props: ButtonProps): string {
  return props.kind === 'icon' ? props.label : props.label
}
```

## Common pitfall

Forgetting a discriminant and using overlapping optionals - TypeScript cannot prove when `data` is defined:

```ts
if (!state.loading && state.data) {
  // still easy to leave error + data both set
}
```

Use a tagged union instead.

```ts
type State<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function readData<T>(state: State<T>): T | string {
  if (state.status === 'success') {
    return state.data // data is definitely defined
  }
  if (state.status === 'error') {
    return state.error
  }
  return 'still loading'
}
```

As you can see - once `status` is `'success'`, `data` is just there. No optional gymnastics.

## Mini check

**Question:** Rewrite `{ loading: boolean; user?: User; error?: string }` as a discriminated union.

<details>
<summary>Answer</summary>

```ts
type User = { id: string; name: string }

type UserState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; user: User }
  | { status: 'error'; error: string }
```
</details>

Next: [Interfaces vs types](./interfaces-vs-types).
