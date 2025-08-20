import { useState, type FC } from "react";
import { Button } from "./Button";
import { cn } from "./cn";

export const DemoButton: FC = () => {
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
      Toggle me!
      <span className="sr-only"> (Switch is {isOn ? "on" : "off"})</span>
    </Button>
  );
};
