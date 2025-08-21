import { useMockCards } from "~/dumping-ground/mockCards";
import { useState, useTransition } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function TransitionWithMemo() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { cards, onCardCountChange, regenerateCards } = useMockCards(25);

  const [isPending, startTransition] = useTransition();

  return (
    <Experiments
      title="Transitions with Memo"
      memoizeList={true} // This is different
      query={query}
      capCount={capCount}
      cards={cards}
      onCapCountChange={setCapCount}
      onCardsRegeneration={regenerateCards}
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
