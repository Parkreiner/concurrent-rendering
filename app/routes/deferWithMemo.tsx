import { useMockCards } from "~/dumping-ground/mockCards";
import { useDeferredValue, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function DeferOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const deferredQuery = useDeferredValue(query);
  console.log(query || "[empty]", deferredQuery || "[empty]");
  const isDeferredRenderPending = query !== deferredQuery;

  return (
    <Experiments
      title="Defer with Memo"
      memoizeList={true} // This is the only thing that changes from DeferOnly
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
