# React + TypeScript (light chapter)

> Intentionally short. Just the bits FE React interviews usually poke at - on top of the [core guide](/guide/intro).

Assumes React 18/19 with the modern JSX transform (no need to `import React` just for JSX).

## What you should already know

- [Unions & narrowing](/guide/unions-narrowing) for UI state
- [Generics](/guide/generics) for data helpers
- [Utility types](/guide/utility-types) for form/PATCH shapes

## Mental model

React components are functions. Props are a typed object. State and refs need types when inference isn't enough (empty arrays, DOM refs, discriminated unions).

```tsx
type HelloProps = {
  name: string
}

export function Hello({ name }: HelloProps) {
  return <p>Hello, {name}</p>
}
```

As you can see - nothing magical. Function in, JSX out, props typed.

## Chapter map

1. [Props & events](./props-and-events) - children, handlers, `ComponentProps`
2. [Hooks typing](./hooks-typing) - `useState`, `useRef`, basic custom hooks

## Mini check

**Question:** Where do React props types usually live relative to the component?

<details>
<summary>Answer</summary>

As a `type` or `interface` next to the component (or colocated in the same file), passed as the parameter type of the function component. Prefer named props types over inline huge objects for readability.
</details>
