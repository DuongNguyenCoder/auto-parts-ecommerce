export const ensureArray = <T>(value: T[] | undefined): T[] => {
  return value ?? [];
};

export const createTimestamp = () => new Date().toISOString();

export const mergeUniqueByKey = <T>(
  existing: T[],
  incoming: T[],
  comparator: (left: T, right: T) => boolean,
): T[] => {
  return incoming.reduce(
    (acc, next) => {
      const matchIndex = acc.findIndex((item) => comparator(item, next));
      if (matchIndex >= 0) {
        acc[matchIndex] = next;
        return acc;
      }
      acc.push(next);
      return acc;
    },
    [...existing],
  );
};

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);
