import { memo, useState, type FC, type ReactNode } from "react";
import { Button } from "./Button";
import { useForcePeriodicRefresh } from "./useForcePeriodicRerender";
import { DemoToggleButton } from "./DemoToggleButton";
import { filterCards, type CardData } from "./mockCards";
import { Card } from "./Card";

// Clunky props contract
type ExperimentsProps = Readonly<{
  title: string;
  memoizeList: boolean;
  additionalLabel?: ReactNode;

  query: string;
  onQueryChange: (newQuery: string) => void;

  totalCards: number;
  onCardCountChange: (newTotal: number) => void;

  capCount: number;
  onCapCountChange: (newCount: number) => void;

  cardsToDisplay: readonly CardData[];
  onCardsRegeneration: () => void;
}>;

// Normally I wouldn't try to shoehorn six different pages into the exact same
// layout abstraction (especially one that's this clunky and doesn't use
// composition). A little copy and paste is better than a bad abstraction, but
// because we need to control as many factors as possible, forcing all the pages
// to be as similar as possible helps gives us more accurate results.
export const Experiments: FC<ExperimentsProps> = ({
  title,
  query,
  memoizeList,
  totalCards,
  cardsToDisplay,
  capCount,
  additionalLabel,
  onQueryChange,
  onCardsRegeneration,
  onCardCountChange,
  onCapCountChange,
}) => {
  const ListComponent = memoizeList ? MemoizedCardList : CardList;
  const forceRerenderState = useForcePeriodicRefresh(1000);
  const [isThrottled, setIsThrottled] = useState(false);

  return (
    <section className="flex flex-col gap-8">
      <h1 className="sr-only">{title}</h1>

      <div className="flex flex-row items-start gap-6 rounded-md border border-neutral-800 px-6 py-4">
        <div className="flex flex-col gap-2">
          <Button onClick={() => setIsThrottled(!isThrottled)}>Throttle</Button>

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

        <div className="flex flex-col gap-2">
          <DemoToggleButton />
          <p className="text-xl">(this is just a light)</p>
        </div>

        {additionalLabel && (
          <p className="grow text-right text-xl">{additionalLabel}</p>
        )}
      </div>

      <div className="flex flex-row items-end gap-6 rounded-md border border-neutral-800 px-6 py-4">
        <label className="flex grow flex-col gap-2">
          <span>Filter cards</span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="rounded-md border border-neutral-500 px-4 py-1 text-xl"
          />
        </label>

        <label className="flex grow flex-col gap-2">
          <span>Total cards in memory</span>
          <input
            type="number"
            value={totalCards}
            onChange={(e) => onCardCountChange(e.target.valueAsNumber)}
            className="rounded-md border border-neutral-500 px-4 py-1 text-xl"
          />
        </label>

        <label className="flex grow flex-col gap-2">
          <span>Cap DOM nodes (0 is uncapped)</span>
          <input
            type="number"
            value={capCount}
            onChange={(e) => onCapCountChange(e.target.valueAsNumber)}
            className="rounded-md border border-neutral-500 px-4 py-1 text-xl"
          />
        </label>

        <Button onClick={onCardsRegeneration}>Regenerate list</Button>
      </div>

      <ListComponent
        cards={cardsToDisplay}
        query={query}
        isThrottled={isThrottled}
      />
    </section>
  );
};

type CardListProps = Readonly<{
  cards: readonly CardData[];
  query: string;
  isThrottled: boolean;
}>;

export const CardList: FC<CardListProps> = ({ cards, query, isThrottled }) => {
  return (
    <section>
      <h2 className="sr-only">Card List</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filterCards(cards, query, isThrottled).map((r) => (
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
  );
};

export const MemoizedCardList = memo<CardListProps>(
  (props) => {
    return <CardList {...props} />;
  },
  (oldProps, newProps) => {
    const skipUpdate =
      oldProps.cards === newProps.cards &&
      oldProps.isThrottled === newProps.isThrottled &&
      oldProps.query === newProps.query;
    console.log("skip", skipUpdate);
    return skipUpdate;
  }
);
