import { useMockCards } from "~/dumping-ground/mockCards";
import { useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function MemoOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  return (
    <Experiments
      title="Memo Only"
      memoizeList={true} // This changed
      query={query}
      capCount={capCount}
      cards={cards}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
      onCardCountChange={onCardCountChange}
    />
  );
}
