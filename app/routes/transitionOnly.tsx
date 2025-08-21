import { sliceCards, useMockCards } from "~/dumping-ground/mockCards";
import { useMemo, useState, useTransition } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function TransitionOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const cardsToDisplay = useMemo(
    () => sliceCards(cards, capCount),
    [cards, capCount]
  );

  // This is new
  const [isPending, startTransition] = useTransition();

  return (
    <Experiments
      title="Transitions Only"
      memoizeList={false}
      query={query}
      capCount={capCount}
      cardsToDisplay={cardsToDisplay}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      totalCards={cards.length}
      // These now dispatch state updates via transitions; this is exactly the
      // kind of state that you DON'T want to use transitions for, but I think
      // they do a good job of showcasing the nuances of useTransition vs
      // useDeferredValue
      onQueryChange={(newQuery) => {
        startTransition(() => {
          setQuery(newQuery);
        });
      }}
      onCardCountChange={(newTotal) => {
        startTransition(() => {
          onCardCountChange(newTotal);
        });
      }}
      additionalLabel={<>Transition {isPending ? "Pending" : "Idle"}</>}
    />
  );
}
