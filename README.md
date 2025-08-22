# Demo – Concurrent Rendering in React

This is the demo

> [!NOTE]
> I whipped this project up using React Router v7 (which is basically Remix), when I had never used v7 before, and I was rushing to get the presentation done, so I just stumbled by way through getting things working. The code organization is very bad, and I'm not even sure if I used the file-based routing features properly.

## Additional content cut for time

These were things that I originally had as part of the talk, but I had to cut them for time.

### Transitions and the function updater form

This is something super interesting that I observed, and I'm fairly certain that I did things right. If so, it's absolutely baffling to me that the React documentation does not mention this edge case at all.

All state setter functions produced via `useState` support a function updater form:

```ts
const [items, setItems] = useState([item1, item2, item3]);
const onClick1 = () => {
  setItems([...items, item4]);
};
const onClick2 = () => {
  setItems((current) => [...current, item4]);
};
```

When you call a state setter with a function, you get access to the _current_ value that was associated with the state that was last flushed. Note that React expects these functions to be 100% pure, because even after the state update gets made, it won't get flushed via a re-render until after the callback (e.g., `onClick2`) finishes running, and React can handle the render via the event loop.

Now, in non-concurrent React, this is basically just overly-intellectual hair-splitting. You usually don't have to care that the state hasn't yet been flushed after your state setter runs – the loop of update->re-render is usually quick enough that you won't even notice.

But in concurrent React (at least, version 19.1.0), it looks like React just silently falls apart????

See for yourself. Go to `transitionOnly.tsx`, and update the state update logic for the `onChange` handler starting on line 71:

```tsx
onChange={(e) => {
  startTransition(() => {
    setQuery((current) => {
      console.log(current);
      return e.target.value;
    });
  });
}}
```

Try updating the text field with the React Dev Tools open. You'll see that a re-render does happen, but not only does nothing happen on screen, but you don't even see the `console.log`. This indicates if a state transition happens, and it's callback-based, React doesn't know what to do, so it just kind of gives up.

In fact, if you update the setup above to return out the exact same state value as before, you'll see that React still re-renders. In normal React, if you dispatch a value that is equal to the value currently in state, React bails out of the re-render as a performance optimization, because it knows that nothing would change. Transitions somehow break all of that:

```tsx
onChange={() => {
  startTransition(() => {
    setQuery((current) => {
      console.log(current);
      return current;
    });
  });
}}
```

I understand why doing all this would be tricky, but I'm baffled that this is the current behavior. Think about it this way: if the callback pattern is supposed to give you the most recent state value, but there's a background render that is in the middle of processing, how sure are you that you can use that state without it being thrown away/invalidated by something else in the future? You could just always use the most recent state value that was flushed, but it's still weird to think about, and could lead to results getting discard a ton.

Right now, React transitions really seem to be only designed to work with state snapshots. As in, if you kick off a transition, you really have to lean into all the snapshot-based and closure-based logic – you can't even use the escape hatches that the React team themselves gave you.

### Interactions with useSyncExternalStore

One other major edge case with concurrent rendering is that it is not yet compatible with React's tools for preventing screen tearing. React 18 introduced the `useSyncExternalStore` hook. Basically, there's two parts to it:

1. It is designed to set up synchronizations and subscriptions for external, synchronous stores (I've seen some people use it to wire React up to native browser APIs)
2. There are a lot of rules that the external store must follow, like making sure that if React tries to pull a value from the store, it always get back the exact same value (via value equality – reference equality isn't good enough, and will actually make React explode in dev mode)

In exchange for setting things up very precisely, you get a few things in return:

1. It's safe for React to get a value from the store, right from inside the mounting render, even though this has historically been deemed impure/unsafe
2. It also gives React the tools to efficiently update all components that are subscribed to the store at once, which removes any risk that some components will update, but others won't. The React team calls this problem "screen tearing", which has typically meant something slightly different, especially in the world of video games.

Well, the whole point of concurrency is that you give React the ability to split up and schedule and coordinate state updates – but only for state that it owns. How can it possibly do that for state that is in a completely external system? It can't. (At least, not right now.)

So, if a state update happens via `useSyncExternalStore` while a background render happens, React tries to do the safe thing by turning every single remaining part of the background render into an active render. That way, it can process it and the store's update at once. This is probably the right move for eventual correctness (as long as you're willing to put up with some jank, the resulting UI will probably be fine once everything settles). But it's absolutely disastrous for performance in the meantime while all that's getting processed. After all, there's probably a reason you reached for concurrent rendering in the first place – you were trying to solve a performance problem you were already running into. Well, React will sometimes undo all of those performance improvements without telling you. What's worse, it also breaks a bunch of `Suspense` boundaries and forces them to unload if they were already pending.

So basically, right now, when you're trying to deal with render edge cases, you have to choose between one of two things:

- Being able to opt into concurrent renders and Suspense features to improve UX for things that take some time to run
- Having assurances that any updates from an external store actually make their way to every subscriber without updates getting dropped

You **_have_** to choose – you do not get both. The problem is, virtually every state management library (Redux, Zustand, React Query) already uses `useSyncExternalStore` under the hood, so the library creators have made the choice for you.

Even Daishi Kato, the creator of Zustand (and a bunch of other state management libraries) basically said that it's not possible right now, and [he values protections against screen tearings more right now](https://github.com/pmndrs/zustand/discussions/2318#discussioncomment-8405256).

As a sort of band-aid, he did [create a fork of Zustand](https://github.com/zustandjs/use-zustand) that supports concurrency – but it does so by dropping `useSyncExternalStore` support, so you lose all the protections against screen tearing.

The good news is that the React team is aware of this problem, and is working on [something called Concurrent Stores](https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more#concurrent-stores) that should hopefully solve both problems. No ETA on when to expect this.

(Also, not to be mean, but you can ignore a lot of the statements made [in Kent C. Dodds's recent article on `useSyncExternalStore`](https://www.epicreact.dev/use-sync-external-store-demystified-for-practical-react-development-w5ac0). It most definitely does **_not_** work with concurrency – a bunch of library authors wishes that it did, but they're stuck waiting for a fix. And that "fix" basically means updating some parts of React's core architecture.)

## Bibliography

### React Documentation

- [useDeferredValue](https://react.dev/reference/react/useDeferredValue)
- [useTransition](https://react.dev/reference/react/useTransition)
- [startTransition](https://react.dev/reference/react/startTransition)

## Blog Posts

- [Vercel - How React 18 Improves Application Performance](https://vercel.com/blog/how-react-18-improves-application-performance)

## Additional Reading

- [Josh Comeau – 'Snappy UI Optimization with useDeferredValue'](https://www.joshwcomeau.com/react/use-deferred-value/)
- [AceMarke - A Mostly(Mostly) Complete Guide to React Rendering Behavior](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)
