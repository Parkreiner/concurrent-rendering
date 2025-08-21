import { memo, type FC } from "react";
import { filterCards, type CardData } from "./mockCards";
import { Card } from "./Card";

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
