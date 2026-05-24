export type Banner = {
  id: number;

  title: string | null;

  imageUrl: string;

  link: string | null;

  isActive: boolean;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
};
