import { sliceCards, useMockCards } from "~/dumping-ground/mockCards";
import { useMemo, useState, useTransition } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function TransitionWithMemo() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const cardsToDisplay = useMemo(
    () => sliceCards(cards, capCount),
    [cards, capCount]
  );

  const [isPending, startTransition] = useTransition();

  return (
    <Experiments
      title="Transitions with Memo"
      memoizeList={true} // This is different
      query={query}
      capCount={capCount}
      cardsToDisplay={cardsToDisplay}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      totalCards={cards.length}
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
