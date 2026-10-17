# Utility types - PATCH bodies, drafts, loaders

> These transform existing types. FE interviews love them because they map straight to forms and API wrappers.

## `Partial` - form drafts and PATCH bodies

```ts
type User = {
  id: string
  email: string
  name: string
}

type UserDraft = Partial<User>
// { id?: string; email?: string; name?: string }

function updateUser(id: string, patch: Partial<Omit<User, 'id'>>) {
  // send PATCH
}
```

## `Pick` and `Omit`

```ts
type UserCard = Pick<User, 'id' | 'name'>
type UserWithoutId = Omit<User, 'id'>

type CreateUserInput = Omit<User, 'id'> // body for POST
```

As you can see - `Omit` for "create without id", `Pick` for "just what the card needs." Super common.

## `Required` and `Readonly`

```ts
type NeedsEverything = Required<UserDraft>
type FrozenUser = Readonly<User>
```

## `ReturnType` and `Awaited`

```ts
async function fetchUser() {
  return { id: '1', name: 'Ada' }
}

type FetchUserReturn = ReturnType<typeof fetchUser> // Promise<{ id: string; name: string }>
type UserFromApi = Awaited<ReturnType<typeof fetchUser>> // { id: string; name: string }
```

`Awaited` unwraps promises - handy when you're deriving props from loaders.

## Building an update payload

```ts
type Product = {
  id: string
  title: string
  price: number
  tags: string[]
}

type ProductUpdate = Partial<Omit<Product, 'id'>>

const patch: ProductUpdate = { price: 20 }
```

## Common pitfall

```ts
type Wrong = Partial<User> & { id: string }
// id is still optional from Partial unless you re-required it carefully

type Better = Partial<Omit<User, 'id'>> & { id: string }
```

Compose utilities carefully - order matters when you mix `Partial` / `Omit` / intersections. Easy to think you required `id` when you didn't. 🤔

## Mini check

**Question:** From `type Article = { id: string; title: string; body: string; authorId: string }`, type a create-input that has no `id`.

<details>
<summary>Answer</summary>

```ts
type CreateArticleInput = Omit<Article, 'id'>
```
</details>

Next: [Type guards](./type-guards).
