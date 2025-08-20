import { useId, type FC } from "react";
import type { IconStyle } from "./mockResources";
import { cn } from "./cn";

type CardProps = Readonly<{
  displayName: string;
  authorName: string;
  iconStyle: IconStyle;
  description: string;
  headerLevel?: `h${1 | 2 | 3 | 4 | 5 | 6}`;
  className?: string;
  tags: readonly string[];
}>;

export const Card: FC<CardProps> = ({
  displayName,
  authorName,
  iconStyle,
  description,
  tags,
  className,
  headerLevel,
}) => {
  const Header = headerLevel ?? "h3";
  const hookId = useId();
  const authorId = `${hookId}-author`;
  const descriptionId = `${hookId}-description`;

  return (
    <article
      className={cn(
        "flex flex-col justify-between gap-2 rounded-md bg-neutral-800 p-6",
        className
      )}
    >
      <div className="flex flex-col gap-3">
        {/*
         * Need to scale the circles and diamonds so that they have the same
         * perceptual size as the square. Wrapping them all in a fixed-size div
         * so that even with translation logic, CSS has an easy size to work
         * with for the flex layout algos
         */}
        <div className="size-5">
          <div
            role="none"
            className={cn(
              "size-5",
              iconStyle === "square" && "bg-blue-400",
              iconStyle === "circle" &&
                "scale-[110%] rounded-full bg-yellow-400",
              iconStyle === "diamond" && "scale-[90%] rotate-45 bg-red-400"
            )}
          />
        </div>

        <div className="flex flex-col gap-0.5">
          <Header
            aria-describedby={[authorId, descriptionId].join(" ")}
            className="text-xl leading-tight"
          >
            {displayName}
          </Header>
          <span id={authorId} className="text-base text-neutral-200">
            By {authorName}
          </span>
        </div>
      </div>

      <p id={descriptionId} className="line-clamp-2 text-lg leading-snug">
        {description}
      </p>

      <div className="flex flex-col gap-2 pt-3">
        <div className="leading-none">
          <span className="sr-only">This resource has the following tags:</span>
          <span aria-hidden className="text-xs">
            Tags
          </span>
        </div>
        <ul className="flex flex-row gap-2 overflow-x-auto" aria-label="Tags">
          {tags.map((t) => (
            <li
              key={t}
              className="rounded-full bg-neutral-700 px-3 py-2 leading-none text-nowrap"
            >
              {t}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};
