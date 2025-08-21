import {
  sliceResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useDeferredValue, useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function DeferOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  const resourcesToDisplay = useMemo(
    () => sliceResources(resources, capCount),
    [resources, capCount]
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
      resourcesToDisplay={resourcesToDisplay}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onResourceRegenerate={regenerateResources}
      totalResources={resources.length}
      onTotalResourcesChange={onResourceSizeChange}
      additionalLabel={
        <>Deferred Render {isDeferredRenderPending ? "Pending" : "Idle"}</>
      }
    />
  );
}
