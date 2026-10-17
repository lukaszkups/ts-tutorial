# Composables & refs

## `ref` inference and explicit types

```ts
import { ref } from 'vue'

const count = ref(0) // Ref<number>
const title = ref('Cart') // Ref<string>

type User = { id: string; name: string }
const user = ref<User | null>(null)
const tags = ref<string[]>([])
```

Empty arrays and unions need an explicit type parameter - same lesson as React `useState`. Template unwraps refs; in script you use `.value`.

## `reactive` vs `ref`

```ts
import { reactive, ref } from 'vue'

const form = reactive({
  email: '',
  remember: false,
})

form.email = 'a@b.com'

// For replacements of the whole object, ref is often clearer
const formRef = ref({ email: '', remember: false })
formRef.value = { email: 'b@c.com', remember: true }
```

Typing `reactive` uses the object's shape. Adding optional fields later can get awkward - prefer defining a type up front:

```ts
type LoginForm = { email: string; remember: boolean }
const form = reactive<LoginForm>({ email: '', remember: false })
```

## `computed`

```ts
import { computed, ref } from 'vue'

const priceCents = ref(1999)
const label = computed(() => `$${(priceCents.value / 100).toFixed(2)}`)
// ComputedRef<string>
```

Annotate when the computed can return a union:

```ts
const discount = computed<number | null>(() => {
  return priceCents.value > 2000 ? 10 : null
})
```

## Composable with generics (`useFetch`)

```ts
import { onMounted, ref, type Ref } from 'vue'

type UseFetchReturn<T> = {
  data: Ref<T | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  reload: () => Promise<void>
}

export function useFetch<T>(url: string): UseFetchReturn<T> {
  const data = ref<T | null>(null) as Ref<T | null>
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function reload() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data.value = (await res.json()) as T
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  onMounted(reload)

  return { data, error, loading, reload }
}
```

Usage:

```ts
type Product = { id: string; title: string }
const { data, loading, error } = useFetch<Product>('/api/products/1')
```

As you can see - same generic idea as the core [Generics](/guide/generics) chapter. For safer JSON, peek at [Type guards](/guide/type-guards).

## When inference fails

- empty `ref([])` → `ref<Item[]>([])`
- `ref(null)` for DOM → `ref<HTMLElement | null>(null)`
- template refs: `const el = ref<HTMLInputElement | null>(null)`

```vue
<script setup lang="ts">
import { ref } from 'vue'

const inputEl = ref<HTMLInputElement | null>(null)

function focus() {
  inputEl.value?.focus()
}
</script>

<template>
  <input ref="inputEl" />
  <button type="button" @click="focus">Focus</button>
</template>
```

## Common pitfall

```ts
const state = ref({ items: [] })
// items is never[]
state.value.items.push('a') // error
```

Type the array: `ref<{ items: string[] }>({ items: [] })`. Same empty-array trap as everywhere else. 😅

## Mini check

**Question:** What is the script-side type of `const count = ref(0)` when reading the value?

<details>
<summary>Answer</summary>

`count` is `Ref<number>`; the number is `count.value`. In templates, Vue unwraps it so you write `count`.
</details>

Next: [Component patterns](./component-patterns).
