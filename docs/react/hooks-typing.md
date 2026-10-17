# Hooks typing

## `useState`

Inference works when the initial value is precise:

```tsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0) // number
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>
}
```

Annotate when the initial value is empty or a union:

```tsx
type User = { id: string; name: string }

const [user, setUser] = useState<User | null>(null)
const [ids, setIds] = useState<string[]>([])

type RequestState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; user: User }

const [state, setState] = useState<RequestState>({ status: 'idle' })
```

## `useRef`

```tsx
import { useEffect, useRef } from 'react'

export function FocusInput() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return <input ref={inputRef} />
}
```

Comments for the code above:

- DOM refs: `useRef<HTMLInputElement>(null)` → `.current` is `HTMLInputElement | null`
- mutable box: `useRef(0)` for values that shouldn't retrigger render

## Custom hooks

Type the inputs and the return object. Generics show up for data hooks:

```tsx
import { useEffect, useState } from 'react'

type QueryState<T> =
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

export function useJsonQuery<T>(url: string): QueryState<T> {
  const [state, setState] = useState<QueryState<T>>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<T>
      })
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Unknown error'
        if (!cancelled) setState({ status: 'error', error: message })
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return state
}
```

This is basically [Generics](/guide/generics) + [Async & APIs](/guide/async-and-apis) wearing a React jacket.

## Common pitfall

```tsx
const [items, setItems] = useState([])
// items is never[] - push/set with strings will error
```

Always annotate empty array state: `useState<string[]>([])`. Classic trap. 😅

## Mini check

**Question:** What is the type of `useRef<HTMLDivElement>(null).current`?

<details>
<summary>Answer</summary>

`HTMLDivElement | null` - until React assigns the DOM node, `current` is `null`.
</details>

That's the light React chapter. If you want the deeper framework track, head to [Vue](/vue/).
