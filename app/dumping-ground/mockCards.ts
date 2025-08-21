import { useLayoutEffect, useRef, useState } from "react";

// There's no triangle because those are a pain to make in CSS
const iconStyles = [
  "square",
  "circle",
  "diamond",
] as const satisfies readonly string[];

export type IconStyle = (typeof iconStyles)[number];

export type CardData = Readonly<{
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
  "orange",
  "yellow",
  "green",
  "blue",
  "indigo",
  "violet",
  "pink",
  "black",

  "handsome gold",
  "handsome purple",
  "handsome light brown",
  "handsome white pearl",
  "handsome dead",
];

function shuffleInPlace(input: unknown[]): void {
  for (let i = input.length - 1; i >= 1; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    const elementToSwap = input[i];
    input[i] = input[randomIndex];
    input[randomIndex] = elementToSwap;
  }
}

function generateCardData(size: number): readonly CardData[] {
  const cards: CardData[] = [];
  if (!Number.isInteger(size) || size <= 0) {
    return cards;
  }

  for (let i = 0; i < size; i++) {
    const cardType = Math.random() < 0.5 ? "thingy" : "whatcha-ma-call-it";
    const descriptionBase =
      mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)] ??
      "";

    let tags: string[] = [...mockTags];
    shuffleInPlace(tags);
    tags = tags.slice(0, 5);

    const newCard: CardData = {
      tags,
      id: crypto.randomUUID(),
      author: mockAuthors[Math.floor(Math.random() * mockAuthors.length)] ?? "",
      description: `A ${cardType} that does the following: ${descriptionBase}`,
      displayName:
        mockDisplayNames[Math.floor(Math.random() * mockDisplayNames.length)] ??
        "",
      iconStyle:
        iconStyles[Math.floor(Math.random() * iconStyles.length)] ?? "circle",
    };

    cards.push(newCard);
  }

  return cards;
}

// This is definitely inefficient. One, that made it easier to write. Two, that
// makes the performance problems more obvious for the demo
export function filterCards<T extends CardData>(
  cards: readonly T[],
  query: string,
  artificiallyThrottle: boolean
): readonly T[] {
  if (cards.length === 0 || query.length === 0) {
    return cards;
  }

  const terms = query.split(" ").map((term) => new RegExp(term, "i"));
  return cards.filter((r) => {
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

export function sliceCards(
  cards: readonly CardData[],
  sliceCap: number
): readonly CardData[] {
  const normalized = Math.trunc(sliceCap);
  if (!Number.isFinite(normalized) || normalized <= 0) {
    return cards;
  }
  return cards.slice(0, normalized);
}

type UseMockCardsResult = Readonly<{
  cards: readonly CardData[];
  onCardCountChange: (newSize: number) => void;
  regenerateCards: () => void;
}>;

// Normally we would want to add some debouncing for some of the core state
// transitions, but considering the topic of the talk, we actually want to lean
// into the jank as much as humanly possible
export function useMockCards(initialCardCount: number): UseMockCardsResult {
  const [cards, setCards] = useState<readonly CardData[]>([]);

  const generateNewCards = (count: number): void => {
    const newCards = generateCardData(count);
    setCards(newCards);
  };

  // Not super happy with this, but this is a relatively painless way to avoid
  // hydration errors. Those are going to be super common with super-randomized
  // output
  const onMount = () => generateNewCards(initialCardCount);
  const onMountRef = useRef(onMount);
  useLayoutEffect(() => {
    onMountRef.current = onMount;
  }, [onMount]);
  useLayoutEffect(() => {
    onMountRef.current();
  }, []);

  return {
    cards: cards,
    regenerateCards: () => generateNewCards(cards.length),
    onCardCountChange: (newSize) => {
      const noUpdatePossible =
        !Number.isInteger(newSize) || newSize < 0 || newSize === cards.length;

      if (noUpdatePossible) {
        return;
      }

      // A lot of the updates are going to try preserving the existing
      // generated cards as much as possible, so there aren't any jarring UI
      // jumps
      if (newSize < cards.length) {
        const shrunken = cards.slice(0, newSize);
        setCards(shrunken);
        return;
      }

      const diff = generateCardData(newSize - cards.length);
      setCards([...cards, ...diff]);
    },
  };
}
