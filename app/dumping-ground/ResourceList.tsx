import { memo, type FC } from "react";
import { filterResources, type WebsiteResource } from "./mockResources";
import { Card } from "./Card";

type ResourceListProps = Readonly<{
  resources: readonly WebsiteResource[];
  query: string;
  isThrottled: boolean;
}>;

export const ResourceList: FC<ResourceListProps> = ({
  resources,
  query,
  isThrottled,
}) => {
  return (
    <section>
      <h2 className="sr-only">Resource List</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filterResources(resources, query, isThrottled).map((r) => (
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

export const MemoizedResourceList = memo<ResourceListProps>((props) => {
  return <ResourceList {...props} />;
});
