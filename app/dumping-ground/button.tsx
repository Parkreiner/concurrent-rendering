import type { FC, HTMLAttributes } from "react";
import { cn } from "./cn";

type ButtonProps = HTMLAttributes<HTMLButtonElement>;

export const Button: FC<ButtonProps> = ({ className, ...delegatedProps }) => {
  return (
    <button
      className={cn("rounded-full text-sm", className)}
      {...delegatedProps}
    />
  );
};
