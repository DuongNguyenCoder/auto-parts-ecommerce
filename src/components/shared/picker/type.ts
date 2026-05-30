export type EntityKey = string | number;

export type Entity = {
  id: EntityKey;
  name: string;
};

export type EntityPickerProps<T extends Entity> = {
  value: T["id"][];
  onChange: (ids: T["id"][]) => void;

  fetcher: (keyword: string) => Promise<T[]>;

  label?: string;
  placeholder?: string;
  hint?: string;
  className?: string;

  getLabel?: (item: T) => string;
  renderSelected?: (item: T, remove: () => void) => React.ReactNode;
  renderOption?: (item: T, meta: { selected: boolean }) => React.ReactNode;
};
