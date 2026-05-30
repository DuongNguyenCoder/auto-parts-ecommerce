"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

type PostFilterEngineProps = {
  defaultSearch?: string;
  defaultSort?: string;
  onSearch: (value: string) => void;
  onSortChange: (sortBy: string, orderBy: string) => void;
};

export function PostFilterEngine({
  defaultSearch = "",
  defaultSort = "publishedAt-desc",
  onSearch,
  onSortChange,
}: PostFilterEngineProps) {
  const [search, setSearch] = useState(defaultSearch ?? "");

  // sync khi back/forward browser
  useEffect(() => {
    setSearch(defaultSearch ?? "");
  }, [defaultSearch]);

  const handleSearch = (value: string) => {
    onSearch(value.trim());
  };

  const handleSortChange = (value: string) => {
    const [sortBy, orderBy] = value.split("-") as [string, string];
    onSortChange(sortBy, orderBy);
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          placeholder="Search articles..."
          value={search ?? ""}
          className="pl-10"
          onChange={(e) => {
            const value = e.target.value;

            // update UI instantly
            setSearch(value);

            // update URL state
            handleSearch(value);
          }}
        />
      </div>

      {/* Sort */}
      <Select value={defaultSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-full sm:w-55">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="publishedAt-desc">Newest</SelectItem>
          <SelectItem value="publishedAt-asc">Oldest</SelectItem>
          <SelectItem value="title-asc">Title A-Z</SelectItem>
          <SelectItem value="title-desc">Title Z-A</SelectItem>
          <SelectItem value="updatedAt-desc">Recently Updated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
