import type { FC, HTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonProps = HTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ className, ...delegatedProps }) => {
  return (
    <button
      className={cn(
        "cursor-pointer rounded-full bg-neutral-500 px-4 py-2 text-lg leading-none text-white transition-colors duration-200 hover:bg-neutral-600",
        className
      )}
      {...delegatedProps}
    />
  );
};
