import { useLayoutEffect, useState, type FC } from "react";

type RenderSource = "parent" | "self";

// Breaking a ton of React rules, but understandably, React doesn't really
// expose great ways to expose these values
const RenderPerformanceTrackerCore: FC = () => {
  const [prevRenderDate, setPrevrenderDate] = useState(new Date());
  const [newRenderDate, setNewRenderDate] = useState<Date | null>(null);
  const [lastSource, setLastSource] = useState<RenderSource>("parent");

  useLayoutEffect(() => {
    if (lastSource === "parent") {
      return;
    }
    setLastSource("self");
    setPrevrenderDate(newRenderDate);
    setNewRenderDate(new Date());
  }, [lastSource, newRenderDate]);

  if (prevRenderDate === null) {
    return null;
  }

  const delta =
    (newRenderDate?.getMilliseconds() ?? 0) - prevRenderDate.getMilliseconds();

  return (
    <p>
      {newRenderDate !== null && <>Last render took: {delta} milliseconds</>}
    </p>
  );
};

export const RenderPerformanceTracker: FC = () => {
  if (typeof window === "undefined") {
    return null;
  }
  return <RenderPerformanceTrackerCore />;
};
