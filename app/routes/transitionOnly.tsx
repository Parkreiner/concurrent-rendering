import {
  sliceResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useMemo, useState, useTransition } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function TransitionOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  const resourcesToDisplay = useMemo(
    () => sliceResources(resources, capCount),
    [resources, capCount]
  );

  // This is new
  const [isPending, startTransition] = useTransition();

  return (
    <Experiments
      title="Transitions Only"
      memoizeList={false}
      query={query}
      capCount={capCount}
      resourcesToDisplay={resourcesToDisplay}
      onCapCountChange={setCapCount}
      onResourceRegenerate={regenerateResources}
      totalResources={resources.length}
      // These now dispatch state updates via transitions; this is exactly the
      // kind of state that you DON'T want to use transitions for, but I think
      // they do a good job of showcasing the nuances of useTransition vs
      // useDeferredValue
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
