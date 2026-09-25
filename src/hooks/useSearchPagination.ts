import { useEffect, useMemo, useState } from "react";
import { PAGE_SIZE_OPTIONS } from "../utils/Constants";
import type { SearchPaginationOptions } from "../types/types";

export function useSearchPagination<T>(items: T[], options: SearchPaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => setSearchTerm(searchInput), 300);
    return () => window.clearTimeout(debounceTimer);
  }, [searchInput]);

  const filteredItems = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    return [...items]
      .sort(options.compareItems)
      .filter((item) => options.getSearchText(item).toLowerCase().includes(normalizedSearchTerm));
  }, [items, options, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleItems = filteredItems.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  useEffect(() => setCurrentPage(1), [items.length, pageSize, searchTerm]);
  useEffect(() => setCurrentPage((page) => Math.min(page, totalPages)), [totalPages]);

  return { currentPage: safeCurrentPage, pageSize, searchInput, setCurrentPage, setPageSize, setSearchInput, totalPages, visibleItems };
}