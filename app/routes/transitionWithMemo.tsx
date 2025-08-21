import {
  sliceResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useMemo, useState, useTransition } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function TransitionWithMemo() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  const resourcesToDisplay = useMemo(
    () => sliceResources(resources, capCount),
    [resources, capCount]
  );

  const [isPending, startTransition] = useTransition();

  return (
    <Experiments
      title="Transitions with Memo"
      memoizeList={true} // This is different
      query={query}
      capCount={capCount}
      resourcesToDisplay={resourcesToDisplay}
      onCapCountChange={setCapCount}
      onResourceRegenerate={regenerateResources}
      totalResources={resources.length}
      onQueryChange={(newQuery) => {
        startTransition(() => {
          setQuery(newQuery);
        });
      }}
      onTotalResourcesChange={(newTotal) => {
        startTransition(() => {
          onResourceSizeChange(newTotal);
        });
      }}
      additionalLabel={<>Transition {isPending ? "Pending" : "Idle"}</>}
    />
  );
}
