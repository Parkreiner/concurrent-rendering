import { sliceCards, useMockCards } from "~/dumping-ground/mockCards";
import { useDeferredValue, useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function DeferOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const cardssToDisplay = useMemo(
    () => sliceCards(cards, capCount),
    [cards, capCount]
  );

  // This is new
  const deferredQuery = useDeferredValue(query);
  const isDeferredRenderPending = query !== deferredQuery;

  return (
    <Experiments
      title="Defer Only"
      memoizeList={false}
      query={deferredQuery}
      capCount={capCount}
      cardsToDisplay={cardssToDisplay}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      totalCards={cards.length}
      onCardCountChange={onCardCountChange}
      additionalLabel={
        <>Deferred Render {isDeferredRenderPending ? "Pending" : "Idle"}</>
      }
    />
  );
}
