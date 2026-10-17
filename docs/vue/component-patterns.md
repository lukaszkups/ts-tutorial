# Component patterns

> Practical Vue + TS patterns you'll write in apps and explain in interviews.

## 1. Form with `v-model`

```vue
<script setup lang="ts">
type FormModel = {
  title: string
  publish: boolean
}

const model = defineModel<FormModel>({ required: true })

const emit = defineEmits<{
  save: [value: FormModel]
}>()

function onSubmit() {
  emit('save', model.value)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="model.title" />
    <label>
      <input v-model="model.publish" type="checkbox" />
      Publish
    </label>
    <button type="submit">Save</button>
  </form>
</template>
```

If your Vue version predates `defineModel`, use the classic `modelValue` + `update:modelValue` emit pair with the same types.

## 2. Async list with discriminated status

```vue
<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Product = { id: string; title: string; price: number }

type ListState =
  | { status: 'loading' }
  | { status: 'success'; items: Product[] }
  | { status: 'error'; message: string }

const state = ref<ListState>({ status: 'loading' })

onMounted(async () => {
  try {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const items = (await res.json()) as Product[]
    state.value = { status: 'success', items }
  } catch (err: unknown) {
    state.value = {
      status: 'error',
      message: err instanceof Error ? err.message : 'Failed to load',
    }
  }
})
</script>

<template>
  <p v-if="state.status === 'loading'">Loading…</p>
  <p v-else-if="state.status === 'error'">{{ state.message }}</p>
  <ul v-else>
    <li v-for="item in state.items" :key="item.id">
      {{ item.title }} - {{ item.price }}
    </li>
  </ul>
</template>
```

Same discriminant pattern as the [core unions lesson](/guide/unions-narrowing). Once you've got that, Vue is just the delivery vehicle.

## 3. Presentational card + typed emits

```vue
<script setup lang="ts">
type Product = { id: string; title: string; price: number }

defineProps<{ product: Product }>()

const emit = defineEmits<{
  addToCart: [productId: string]
}>()
</script>

<template>
  <article>
    <h3>{{ product.title }}</h3>
    <p>{{ product.price }}</p>
    <button type="button" @click="emit('addToCart', product.id)">Add</button>
  </article>
</template>
```

## 4. Composable-driven page

```vue
<script setup lang="ts">
import { useFetch } from './useFetch'

type Product = { id: string; title: string }

const { data, loading, error, reload } = useFetch<Product>('/api/products/1')
</script>

<template>
  <button type="button" @click="reload">Reload</button>
  <p v-if="loading">Loading…</p>
  <p v-else-if="error">{{ error }}</p>
  <p v-else-if="data">{{ data.title }}</p>
</template>
```

## Interview notes

- **Props vs emits:** props configure; emits notify. Type both so parents can't pass wrong payloads.
- **When inference fails:** annotate `ref`/`computed`, use `defineProps<T>()`, type emit maps, avoid untyped `[]` / `null` initials.
- **`vue-tsc` in CI:** Volar in the editor is not enough for merges - run `vue-tsc --noEmit` like `tsc` in the core [setup](/guide/setup) lesson.

## Common pitfall

Optional boolean props without defaults become `boolean | undefined` in script - use `withDefaults` when you need a real `boolean`.

## Mini check

**Question:** Why prefer a discriminated `ListState` over `{ loading, items?, error? }`?

<details>
<summary>Answer</summary>

Illegal combinations (loading + items, or error + items) are harder to represent. A discriminant makes each UI branch's fields required and others unavailable - fewer runtime surprises.
</details>

And that's the Vue track. You've got the core guide, a light React chapter, and this fuller Vue one - should be enough to talk TypeScript in FE interviews without drowning in type-theory rabbit holes.

Until next time folks!
