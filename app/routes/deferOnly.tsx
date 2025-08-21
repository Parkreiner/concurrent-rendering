import { useMockCards } from "~/dumping-ground/mockCards";
import { useDeferredValue, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function DeferOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  // This is new
  const deferredQuery = useDeferredValue(query);
  const isDeferredRenderPending = query !== deferredQuery;

  return (
    <Experiments
      title="Defer Only"
      memoizeList={false}
      query={deferredQuery}
      capCount={capCount}
      cards={cards}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      onCardCountChange={onCardCountChange}
      additionalLabel={
        <>Deferred Render {isDeferredRenderPending ? "Pending" : "Idle"}</>
      }
    />
  );
}
