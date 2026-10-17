# Vue + TypeScript (full chapter)

> Deeper than the React section. Assumes **Vue 3** with `<script setup lang="ts">` - the default for new Vue FE work in 2026.

## What you should already know

Work through the [core guide](/guide/intro) first. Vue typing builds on the same unions, generics, and utility types - just with different macros.

## Mental model

| Piece | How TS shows up |
| ----- | ---------------- |
| Props | `defineProps` with a type argument or runtime + `PropType` |
| Emits | `defineEmits` with a typed call signature |
| Slots | `defineSlots` (Vue 3.3+) |
| State | `ref` / `reactive` / `computed` inference |
| Reuse | Composables returning typed refs/objects |

```vue
<script setup lang="ts">
type Props = {
  title: string
  open?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
})
</script>

<template>
  <div v-if="props.open">{{ props.title }}</div>
</template>
```

As you can see - props are still "an object of inputs." Vue just gives you macros for it.

## Chapter map

1. [Props, emits & slots](./props-emits-slots) - component contracts
2. [Composables & refs](./composables-and-refs) - `ref`, `computed`, `useFetch`-style generics
3. [Component patterns](./component-patterns) - forms, async lists, status UI

## Interview angle

Be ready to explain **props vs emits** as the typed input/output contract of a component, and what to do when inference fails (explicit generics on `ref`, `defineProps<T>()`, typing `defineEmits`).

## Mini check

**Question:** Why put `lang="ts"` on `<script setup>`?

<details>
<summary>Answer</summary>

It enables TypeScript syntax in the script block (`type`/`interface`, generics on `defineProps`, typed emits). Without it, the SFC is plain JavaScript.
</details>
