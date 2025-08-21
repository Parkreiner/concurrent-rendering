import {
  sliceResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useMemo, useState } from "react";
import { Experiments } from "~/dumping-ground/Experiments";

export default function MemoOnly() {
  const [query, setQuery] = useState("");
  const [capCount, setCapCount] = useState(0);
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  const resourcesToDisplay = useMemo(
    () => sliceResources(resources, capCount),
    [resources, capCount]
  );

  return (
    <Experiments
      title="Memo Only"
      memoizeList={true} // This changed
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
