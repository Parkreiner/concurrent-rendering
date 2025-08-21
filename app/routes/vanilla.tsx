import { sliceCards, useMockCards } from "~/dumping-ground/mockCards";
import { useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function Vanilla() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  // This is a cheap operation, but we need to keep the memory reference as
  // stable as possible, for the various implementations
  const cardsToDisplay = useMemo(
    () => sliceCards(cards, capCount),
    [cards, capCount]
  );

  return (
    <Experiments
      title="Vanilla"
      memoizeList={false}
      query={query}
      capCount={capCount}
      cardsToDisplay={cardsToDisplay}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      totalCards={cards.length}
      onCardCountChange={onCardCountChange}
    />
  );
}
