import { Button } from "~/dumping-ground/Button";
import { useForcePeriodicRefresh } from "~/dumping-ground/useForcePeriodicRerender";
import { useMockResources } from "~/dumping-ground/mockResources";
import { useState } from "react";
import { DemoButton } from "~/dumping-ground/DemoButton";
import { ResourceList } from "~/dumping-ground/ResourceList";

export default function Start() {
  const forceRerenderState = useForcePeriodicRefresh(1000);
  const [query, setQuery] = useState("");
  const {
    resources,
    isThrottled,
    onResourceSizeChange,
    regenerateResources,
    onThrottleChange,
  } = useMockResources(25);

  return (
    <section className="flex flex-col gap-8">
      <h1 className="sr-only">Start</h1>

      <div className="flex flex-row items-start gap-6 rounded-md border border-neutral-800 px-6 py-4">
        <div className="flex flex-col gap-2">
          <Button onClick={() => onThrottleChange(!isThrottled)}>
            Throttle
          </Button>

          <p className="text-xl">
            {isThrottled ? "Throttle on" : "Throttle off"}
          </p>
        </div>

        <div className="flex basis-60 flex-col gap-2">
          <Button
            onClick={forceRerenderState.toggleIsActive}
            className="text-left"
          >
            {forceRerenderState.lastRefresh !== null ? "Disable" : "Enable"}{" "}
            periodic renders
          </Button>

          <p className="text-xl">
            {forceRerenderState.lastRefresh !== null ? (
              <>
                {forceRerenderState.lastRefresh.getSeconds() % 2 === 0
                  ? "Tick"
                  : "Tock"}
              </>
            ) : (
              "Disabled"
            )}
          </p>
        </div>

        <DemoButton />
      </div>

      <div className="flex flex-row items-end gap-6 rounded-md border border-neutral-800 px-6 py-4">
        <label className="flex grow flex-col gap-2">
          <span>Filter resources</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="rounded-md border border-neutral-500 px-4 py-1 text-xl"
          />
        </label>

        <label className="flex grow flex-col gap-2">
          <span>Change resources</span>
          <input
            type="number"
            value={resources.length}
            onChange={(e) => onResourceSizeChange(e.target.valueAsNumber)}
            className="rounded-md border border-neutral-500 px-4 py-1 text-xl"
          />
        </label>

        <Button onClick={() => regenerateResources()}>Regenerate list</Button>
      </div>

      <ResourceList
        resources={resources}
        query={query}
        isThrottled={isThrottled}
      />
    </section>
  );
}
