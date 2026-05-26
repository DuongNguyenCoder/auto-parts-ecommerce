export type Banner = {
  id: number;

  title: string | undefined;

  imageUrl: string;

  link: string | undefined;

  isActive: boolean;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};
