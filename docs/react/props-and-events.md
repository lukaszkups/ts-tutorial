# Props & events

## Typing props

```tsx
type UserBadgeProps = {
  name: string
  role?: 'admin' | 'editor' | 'viewer'
  onRemove?: (id: string) => void
  id: string
}

export function UserBadge({ name, role = 'viewer', onRemove, id }: UserBadgeProps) {
  return (
    <div>
      <span>{name}</span>
      <span>{role}</span>
      {onRemove ? <button onClick={() => onRemove(id)}>Remove</button> : null}
    </div>
  )
}
```

Optional props (`?`) pair nicely with defaults in the destructuring - common interview snippet.

## `children`

```tsx
import type { ReactNode } from 'react'

type PanelProps = {
  title: string
  children: ReactNode
}

export function Panel({ title, children }: PanelProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  )
}
```

Use `ReactNode` for anything renderable. Use `ReactElement` only when you really need an actual element (rarer).

## Event handler types

```tsx
import type { ChangeEvent, FormEvent, MouseEvent } from 'react'

type SearchFieldProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function SearchField({ value, onChange, onSubmit }: SearchFieldProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.value)
  }

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
  }

  return (
    <form onSubmit={onSubmit}>
      <input value={value} onChange={handleChange} />
      <button type="button" onClick={handleClick}>
        Clear
      </button>
    </form>
  )
}
```

I prefer **domain callbacks** (`onChange: (value: string) => void`) in public props, and keep the DOM event types inside the component. Cleaner for parents.

## Reusing native element props

```tsx
import type { ComponentProps } from 'react'

type ButtonProps = ComponentProps<'button'> & {
  loading?: boolean
}

export function Button({ loading, children, disabled, ...rest }: ButtonProps) {
  return (
    <button disabled={disabled || loading} {...rest}>
      {loading ? 'Loading…' : children}
    </button>
  )
}
```

## Discriminated union props

```tsx
type LinkButtonProps =
  | { as: 'a'; href: string; onClick?: never }
  | { as: 'button'; href?: never; onClick: () => void }

function Action(props: LinkButtonProps) {
  if (props.as === 'a') {
    return <a href={props.href}>Open</a>
  }
  return <button onClick={props.onClick}>Run</button>
}
```

Same idea as [unions & narrowing](/guide/unions-narrowing). Once you've got that, this feels familiar.

## Common pitfall

```tsx
// Too loose - loses JSX safety
type Bad = {
  onClick: Function
}
```

Prefer something explicit like `(event: MouseEvent<HTMLButtonElement>) => void`, or a domain callback type.

## Mini check

**Question:** How do you type `children` for a layout component that wraps arbitrary content?

<details>
<summary>Answer</summary>

`children: ReactNode` from the `react` package.
</details>

Next: [Hooks typing](./hooks-typing).
