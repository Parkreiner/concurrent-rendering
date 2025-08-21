import {
  sliceResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function Vanilla() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  // This is a cheap operation, but we need to keep the memory reference as
  // stable as possible, for the various implementations
  const resourcesToDisplay = useMemo(
    () => sliceResources(resources, capCount),
    [resources, capCount]
  );

  return (
    <Experiments
      title="Vanilla"
      memoizeList={false}
      query={query}
      capCount={capCount}
      resourcesToDisplay={resourcesToDisplay}
      onQueryChange={setQuery}
      onCapCountChange={setCapCount}
      onResourceRegenerate={regenerateResources}
      totalResources={resources.length}
      onTotalResourcesChange={onResourceSizeChange}
    />
  );
}
