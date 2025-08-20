import { useLayoutEffect, useRef, useState } from "react";

// There's no triangle because those are a pain to make in CSS
const iconStyles = [
  "square",
  "circle",
  "diamond",
] as const satisfies readonly string[];

export type IconStyle = (typeof iconStyles)[number];

export type WebsiteResource = Readonly<{
  id: string;
  author: string;
  displayName: string;
  description: string;
  iconStyle: IconStyle;
  tags: readonly string[];
}>;

const mockAuthors: readonly string[] = [
  "Pompompurin",
  "Spongebob",
  "Homestar Runner",
  "Bobby Hill",
  "Charles E. Cheese",
];

const mockDisplayNames: readonly string[] = [
  "Neato",
  "Game Changer S07E11 is REAL",
  "D20 on a Bus",
  "Cool Thingy",
  "Silksong BABY",
];

const mockDescriptions: readonly string[] = [
  "Gives you a big hug",
  "Tells you the future",
  "Saves SEPTA from certain doom",
  "Gives you a free play for an arcade game",
  "I dunno",
  "Cool stuff",
];

const mockTags: readonly string[] = [
  "red",
  "blue",
  "green",
  "yellow",
  "orange",
  "pink",
  "purple",
  "burgundy",
  "white pearl",
  "chocolate",
  "ivory",
  "vermillion",
  "fuchsia",
  "dead (no, Suda51, this is not a color)",
];

function shuffleInPlace(input: unknown[]): void {
  for (let i = input.length - 1; i >= 1; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const elementToSwap = input[i];
    input[i] = input[randomIndex];
    input[randomIndex] = elementToSwap;
  }
}

function generateResources(size: number): readonly WebsiteResource[] {
  const resources: WebsiteResource[] = [];
  if (!Number.isInteger(size) || size <= 0) {
    return resources;
  }

  for (let i = 0; i < size; i++) {
    const resourceType = Math.random() < 0.5 ? "module" : "template";
    const descriptionBase =
      mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)] ??
      "";

    let tags: string[] = [...mockTags];
    shuffleInPlace(tags);
    tags = tags.slice(0, 5);

    const newResource: WebsiteResource = {
      tags,
      id: crypto.randomUUID(),
      author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)] ?? "",
      description: `A ${resourceType} that does the following: ${descriptionBase}`,
      displayName:
        mockDisplayNames[Math.floor(Math.random() * mockDisplayNames.length)] ??
        "",
      iconStyle:
        iconStyles[Math.floor(Math.random() * iconStyles.length)] ?? "circle",
    };

    resources.push(newResource);
  }

  return resources;
}

// This is definitely inefficient. One, that made it easier to write. Two, that
// makes the performance problems more obvious for the demo
export function filterResources<T extends WebsiteResource>(
  resources: readonly T[],
  query: string,
  artificiallyThrottle: boolean
): readonly T[] {
  if (resources.length === 0 || query.length === 0) {
    return resources;
  }

  const terms = query.split(" ").map((term) => new RegExp(term, "i"));
  return resources.filter((r) => {
    const fieldsToCheck = [r.displayName, r.author, r.description, ...r.tags];
    const result = terms.every((term) => {
      return fieldsToCheck.some((f) => term.test(f));
    });

    // Did a little too good job of simplifying the problem, so on a 2021 M1
    // Mac, the UI can still zip through the filtering with no issue. Didn't
    // want to bring in much more complexity for the demo, so I'm just
    // introducing an artificial delay instead
    if (artificiallyThrottle) {
      const start = Date.now();
      while (Date.now() - start < 2) {}
    }
    return result;
  });
}

type UseMockResourcesResult = Readonly<{
  resources: readonly WebsiteResource[];
  isThrottled: boolean;

  onResourceSizeChange: (newSize: number) => void;
  regenerateResources: () => void;
  onThrottleChange: (newThrottleValue: boolean) => void;
}>;

// Normally we would want to add some debouncing for some of the core state
// transitions, but considering the topic of the talk, we actually want to lean
// into the jank as much as humanly possible
export function useMockResources(
  initialResourceCount: number
): UseMockResourcesResult {
  const [isThrottled, setIsThrottled] = useState(false);
  const [resources, setResources] = useState<readonly WebsiteResource[]>([]);

  const generateNewResources = (count: number): void => {
    const newResources = generateResources(count);
    setResources(newResources);
  };

  // Not super happy with this, but this is a relatively painless way to avoid
  // hydration errors. Those are going to be super common with super-randomized
  // output
  const onMount = () => generateNewResources(initialResourceCount);
  const onMountRef = useRef(onMount);
  useLayoutEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);
  useLayoutEffect(() => {
    onMountRef.current();
  }, []);

  return {
    isThrottled,
    resources,
    regenerateResources: () => generateNewResources(resources.length),
    onThrottleChange: (newValue) => setIsThrottled(newValue),
    onResourceSizeChange: (newSize) => {
      const noUpdatePossible =
        !Number.isInteger(newSize) ||
        newSize < 0 ||
        newSize === resources.length;

      if (noUpdatePossible) {
        return;
      }

      // A lot of the updates are going to try preserving the existing
      // generated resources as much as possible, so there aren't any jarring
      // UI jumps
      if (newSize < resources.length) {
        const shrunken = resources.slice(0, newSize);
        setResources(shrunken);
        return;
      }

      const diff = generateResources(newSize - resources.length);
      setResources([...resources, ...diff]);
    },
  };
}
