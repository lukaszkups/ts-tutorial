# Interfaces vs types - pick a side (kind of)

> Interviews love this question. Have a practical answer, not a holy war. 🤔

Both describe object shapes. In FE codebases you'll see both. Interviews often ask "when do you use which?" - so let's keep it practical.

## Same job for object shapes

```ts
interface User {
  id: string
  email: string
}

type UserType = {
  id: string
  email: string
}
```

For plain object shapes, either works. Pick one style per project and stay consistent. I've seen teams bike-shed this for hours. Don't.

## What `type` does better

Unions, intersections for composition, mapped/utility-heavy aliases, and primitives:

```ts
type Status = 'idle' | 'loading' | 'done'
type Result<T> = { ok: true; data: T } | { ok: false; error: string }
type UserWithRole = User & { role: 'admin' | 'editor' }
type Id = string
```

Interfaces cannot express `A | B` directly. That's usually the interview killer detail.

## What `interface` does better

Extending and declaration merging (libraries). Extending reads well for component-like hierarchies:

```ts
interface BaseProps {
  className?: string
  testId?: string
}

interface ModalProps extends BaseProps {
  title: string
  open: boolean
}
```

Equivalent with types:

```ts
type ModalProps = BaseProps & {
  title: string
  open: boolean
}
```

## Props-like shapes without a framework

```ts
type CardProps = {
  title: string
  subtitle?: string
  onSelect: (id: string) => void
}

function createCard(props: CardProps) {
  props.onSelect('p_1')
}
```

This is the same mental model React/Vue props use - an object of inputs, some optional, some callbacks.

## Common pitfall

Mixing styles randomly in one file, or overusing `interface` for unions:

```ts
// Cannot do this with interface alone
// interface Status = 'a' | 'b'

type Status = 'a' | 'b' // use type
```

## Practical rule of thumb

- **Unions / aliases / utilities** → `type`
- **Object shapes you might extend** → `interface` or `type` (team convention)
- **Do not** rewrite working code just to switch keyword

## Mini check

**Question:** Would you model `PrimaryButtonProps | LinkButtonProps` as an interface or a type? Why?

<details>
<summary>Answer</summary>

As a `type` (union). Interfaces describe a single object shape; unions of alternate prop bags need `type`.

```ts
type PrimaryButtonProps = {
  kind: 'primary'
  onClick: () => void
}

type LinkButtonProps = {
  kind: 'link'
  href: string
}

type ButtonProps = PrimaryButtonProps | LinkButtonProps

function handle(props: ButtonProps) {
  if (props.kind === 'primary') {
    props.onClick()
  } else {
    window.location.assign(props.href)
  }
}
```
</details>

Next: [Functions](./functions).
