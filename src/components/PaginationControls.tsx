import { PaginationControlsProps } from "../types/types";

export function PaginationControls({ itemLabel, currentPage, pageSize, totalPages, onPageSizeChange, onPreviousPage, onNextPage }: PaginationControlsProps) {
  return (
    <div className="pagination" aria-label={`${itemLabel} pages`}>
      <label>
        {itemLabel} per page:
        <select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
          {[10, 25, 50, 100].map((option) => <option value={option} key={option}>{option}</option>)}
        </select>
      </label>
      <button type="button" onClick={onPreviousPage} disabled={currentPage === 1}>Previous</button>
      <span>Page {currentPage} of {totalPages}</span>
      <button type="button" onClick={onNextPage} disabled={currentPage === totalPages}>Next</button>
    </div>
  );
}