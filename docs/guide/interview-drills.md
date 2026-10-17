# Interview drills

> Short prompts you can answer out loud. Try each before opening the answer - no peeking. 😉

## 1. `unknown` vs `any`

**Prompt:** When would you type `res.json()` as `unknown` instead of casting straight to `Product`?

<details>
<summary>Answer</summary>

When the payload is untrusted or unstable. `unknown` forces a type guard or validator before property access. A direct cast (`as Product`) is an unchecked assumption - fine for trusted internal APIs in prototypes, risky for public APIs.
</details>

## 2. Discriminated union for UI state

**Prompt:** Model and render loading / success / error for a user profile fetch.

<details>
<summary>Answer</summary>

```ts
type Profile = { name: string }

type ProfileState =
  | { status: 'loading' }
  | { status: 'success'; profile: Profile }
  | { status: 'error'; message: string }

function label(state: ProfileState): string {
  switch (state.status) {
    case 'loading':
      return 'Loading'
    case 'success':
      return state.profile.name
    case 'error':
      return state.message
  }
}
```
</details>

## 3. Fix the generic

**Prompt:** What is wrong, and how do you fix it?

```ts
function getById(items: { id: string }[], id: string) {
  return items.find((i) => i.id === id)
}
// Caller loses specific item fields (title, etc.)
```

<details>
<summary>Answer</summary>

```ts
function getById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find((i) => i.id === id)
}
```

The generic preserves the element type instead of widening to `{ id: string }`.
</details>

## 4. Utility types for PATCH

**Prompt:** Given `type Task = { id: string; title: string; done: boolean }`, type a PATCH body that cannot change `id` and may send any subset of the other fields.

<details>
<summary>Answer</summary>

```ts
type TaskPatch = Partial<Omit<Task, 'id'>>
```
</details>

## 5. Narrow this error

**Prompt:** Type `catch (err)` and safely read a message.

<details>
<summary>Answer</summary>

```ts
catch (err: unknown) {
  const message = err instanceof Error ? err.message : String(err)
}
```

Don't type `err` as `any` or `Error` blindly - non-Error throws exist.
</details>

## 6. Interface vs type

**Prompt:** Model `Clickable | SubmitButton` where one has `href` and the other has `type: 'submit'`. Interface or type?

<details>
<summary>Answer</summary>

Use a `type` union (often with a discriminant like `kind`). Interfaces alone cannot express alternate shapes as a union.
</details>

## 7. `void` callbacks

**Prompt:** Why type `onClose: () => void` instead of `() => undefined`?

<details>
<summary>Answer</summary>

`void` means callers should ignore the return value. It also allows passing functions that return something (common with inline handlers). `() => undefined` requires returning `undefined` specifically.
</details>

## 8. Explain `Awaited<ReturnType<typeof load>>`

**Prompt:** What does this extract?

```ts
async function load() {
  return { items: [] as string[] }
}
type X = Awaited<ReturnType<typeof load>>
```

<details>
<summary>Answer</summary>

`{ items: string[] }` - the resolved value inside the Promise returned by `load`.
</details>

## Where next?

- apply the same ideas in [React](/react/) (light)
- go deeper with [Vue](/vue/) (full chapter)

Enjoy!
