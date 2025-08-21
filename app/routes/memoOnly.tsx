import { sliceCards, useMockCards } from "~/dumping-ground/mockCards";
import { useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function MemoOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const cardsToDisplay = useMemo(
    () => sliceCards(cards, capCount),
    [cards, capCount]
  );

  return (
    <Experiments
      title="Memo Only"
      memoizeList={true} // This changed
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
