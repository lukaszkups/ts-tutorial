# Props, emits & slots

> Component contracts in Vue are **props in**, **emits out**, **slots for structure**. TypeScript should describe all three.

## `defineProps` with types (recommended)

```vue
<script setup lang="ts">
type UserCardProps = {
  id: string
  name: string
  role?: 'admin' | 'editor'
}

const props = withDefaults(defineProps<UserCardProps>(), {
  role: 'editor',
})
</script>

<template>
  <article>
    <h2>{{ props.name }}</h2>
    <p>{{ props.role }}</p>
  </article>
</template>
```

Vue 3.3+ compiler macros understand the type argument and generate runtime props options for you in most cases. Nice.

## Runtime props + `PropType` (legacy / library style)

```ts
import type { PropType } from 'vue'

defineProps({
  status: {
    type: String as PropType<'idle' | 'loading' | 'done'>,
    required: true,
  },
})
```

Prefer the type-argument form in app code. Know `PropType` for interviews and older examples.

## Typed emits

```vue
<script setup lang="ts">
type User = { id: string; name: string }

const emit = defineEmits<{
  select: [user: User]
  close: []
}>()

function onPick(user: User) {
  emit('select', user)
  emit('close')
}
</script>
```

Tuple syntax (`select: [user: User]`) is the modern emit payload style. Emitting the wrong payload? Type error. 👌

## Props vs emits (interview)

- **Props** - parent configures the child (data down)
- **Emits** - child notifies the parent (events up)

Typing both makes illegal wiring fail in the parent when you're using Volar / `vue-tsc`.

## Slots with `defineSlots`

```vue
<script setup lang="ts">
type User = { id: string; name: string }

defineSlots<{
  default: (props: { user: User }) => any
  actions: (props: { user: User }) => any
}>()

const user: User = { id: '1', name: 'Ada' }
</script>

<template>
  <div>
    <slot :user="user" />
    <footer>
      <slot name="actions" :user="user" />
    </footer>
  </div>
</template>
```

## Discriminated props

```ts
type BannerProps =
  | { variant: 'info'; message: string }
  | { variant: 'error'; message: string; retry: () => void }

const props = defineProps<BannerProps>()
```

Narrow on `props.variant` in script or template (Volar understands the common cases).

## Common pitfall

```ts
// Losing emit typing
const emit = defineEmits(['update', 'close'])
emit('update', 123) // allowed - payloads unchecked
```

Always prefer the typed `defineEmits<{ ... }>()` form. The string-array version is how unchecked payloads sneak in.

## Mini check

**Question:** How do you declare an emit `save` that passes `{ title: string }`?

<details>
<summary>Answer</summary>

```ts
const emit = defineEmits<{
  save: [payload: { title: string }]
}>()
```
</details>

Next: [Composables & refs](./composables-and-refs).
