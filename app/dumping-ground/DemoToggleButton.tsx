import { useState, type FC } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

// Split off into separate component, so that we have a new boundary to put
// state, and have assurances that any renders for this button are kept as small
// as possible. That way, it really sells how much things can break when a
// pending render somewhere else breaks something as simple as this
export const DemoToggleButton: FC = () => {
  const [isOn, setIsOn] = useState(false);
  return (
    <Button
      onClick={() => setIsOn(!isOn)}
      className="flex flex-row items-center gap-2"
    >
      <span
        className={cn(
          "size-4 rounded-full",
          isOn && "bg-green-400",
          !isOn && "bg-neutral-950"
        )}
      />
      Toggle light
      <span className="sr-only"> (Switch is {isOn ? "on" : "off"})</span>
    </Button>
  );
};
