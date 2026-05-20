# Dynamic Routes in Next.js 16 — What Went Wrong & The Fix

## The bug in plain English

Your URL `/users/john` is supposed to deliver the value `"john"` to your page as `params.name`. In your old code, you wrote:

```tsx
const user = users.find((u) => u.username === params.name)
```

This compared every user's `username` against `params.name`. But `params.name` was **not actually the string `"john"`** — so the comparison always failed, `users.find` returned `undefined`, and your page showed "User does not exist."

## Why `params.name` wasn't `"john"`

In **Next.js 16**, the `params` object is a **Promise** — a placeholder for a value that's not ready yet. Promises don't have a `.name` property on them; they have a value *inside* them that you have to unwrap.

Think of it like a sealed envelope:
- `params` is the envelope
- `{ name: "john" }` is the letter inside
- You can't read the letter without opening the envelope first

In older Next.js (14 and earlier), there was no envelope — params was the plain object `{ name: "john" }` and you could read `.name` directly. Most tutorials online still show that older pattern, which is probably what you copied.

## The three changes I made

### 1. Changed the type to say "this is a Promise"

```tsx
// Before
type Props = {
    params: { name: string; }
}

// After
type Props = {
    params: Promise<{ name: string; }>
}
```

`Promise<X>` means "an envelope containing an X." This tells TypeScript the truth about what Next.js actually hands you, so it catches mistakes.

### 2. Added `async` to the function

```tsx
// Before
export default function UserPage(...)

// After
export default async function UserPage(...)
```

`async` is required whenever you want to use `await` inside a function. It's a small keyword with a big rule attached: only `async` functions can `await`.

### 3. `await` to open the envelope

```tsx
const { name } = await params;
```

`await params` waits for the Promise to resolve and gives you the value inside — the real `{ name: "john" }` object. Then `const { name }` destructures it (a shortcut for `const name = result.name`).

After this line, `name` is the string `"john"`, and `users.find((u) => u.username === name)` actually finds John.

## How to spot this yourself next time

If routing or data feels "silently broken" (no error, just wrong/empty results), add a quick log:

```tsx
console.log("params is:", params);
```

If you see `Promise { <pending> }` or `Promise { ... }` in the terminal instead of an object, that's your hint — you need `await`.

You can also hover over `params` in VS Code. If TypeScript shows `Promise<...>`, it's a Promise. If your `Props` type says one thing but Next.js's real type says another, the bug is in your type definition lying to you.

## The final working file

`app/users/[name]/page.tsx`:

```tsx
import ProfileSideBar from "../../components/ProfileSideBar"
import AboutBox from "../../components/AboutBox";
import { users } from "../../data/users";

type Props = {
    params: Promise<{
        name: string;
    }>
}

export default async function UserPage({params} : Props){
    const { name } = await params;
    const user = users.find(
        (u) => u.username === name
    )

    if (!user) {
        return <h1>User does not exist.</h1>
    }

    return(
        <main>
            <ProfileSideBar
                name={user.name}
                status={user.status}
                mood={user.mood}
            />
            <AboutBox
                name={user.name}
                about={user.about}
                answer={user.answer}
            />
        </main>
    );
}
```
