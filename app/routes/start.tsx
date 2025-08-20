import { Button } from "~/dumping-ground/Button";
import { Card } from "~/dumping-ground/Card";
import { useForcePeriodicRerender } from "~/dumping-ground/useForcePeriodicRerender";
import {
  filterResources,
  useMockResources,
} from "~/dumping-ground/mockResources";
import { useState } from "react";

export default function Start() {
  const forceRerenderState = useForcePeriodicRerender(500);
  const [query, setQuery] = useState("");
  const { resources, onResourceSizeChange, regenerateResources } =
    useMockResources(25);

  return (
    <section className="flex flex-col gap-8">
      <h1 className="sr-only">Start</h1>

      <div className="flex flex-row items-center gap-4 rounded-md border border-white p-4">
        <label className="flex grow flex-col gap-2">
          <span>Filter resources</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>

        <label className="flex grow flex-col gap-2">
          <span>Change resources</span>
          <input
            type="number"
            value={resources.length}
            onChange={(e) => onResourceSizeChange(e.target.valueAsNumber)}
          />
        </label>

        <Button onClick={forceRerenderState.toggleIsActive}>
          {forceRerenderState.isActive
            ? "Disable periodic renders"
            : "Enable periodic renders"}
        </Button>

        <Button onClick={() => regenerateResources()}>Regenerate</Button>
      </div>

      <section>
        <h2 className="sr-only">Resource List</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {filterResources(resources, query)
            .slice(0, 100)
            .map((r) => (
              <li key={r.id}>
                <Card
                  headerLevel="h3"
                  className="h-full"
                  displayName={r.displayName}
                  authorName={r.author}
                  description={r.description}
                  iconStyle={r.iconStyle}
                  tags={r.tags}
                />
              </li>
            ))}
        </ul>
      </section>
    </section>
  );
}
