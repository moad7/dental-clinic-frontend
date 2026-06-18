import { useEffect, useMemo, useState } from 'react';
import './DataTable.css';

const DataTable = ({
  columns = [],
  data = [],
  rowKey = '_id',
  classPrefix = 'data-table',
  emptyText = 'אין תוצאות',
  pageSizeOptions = [5, 15, 50, 100],
  defaultPageSize = 5,
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const total = data.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    setPage(1);
  }, [data, pageSize]);

  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  const paginatedData = useMemo(() => {
    return data.slice(startIndex, endIndex);
  }, [data, startIndex, endIndex]);

  const rangeText =
    total === 0
      ? 'מציג 0 מתוך 0'
      : `מציג ${startIndex + 1}-${endIndex} מתוך ${total}`;

  const gridColumns = columns.map((col) => col.width || '1fr').join(' ');

  return (
    <div className={classPrefix}>
      <div
        className={`${classPrefix}-header`}
        style={{ gridTemplateColumns: gridColumns }}
      >
        {columns.map((col) => (
          <div key={col.key}>{col.title}</div>
        ))}
      </div>

      <div className={`${classPrefix}-body`}>
        {paginatedData.length > 0 ? (
          paginatedData.map((item, idx) => (
            <div
              className={`${classPrefix}-row`}
              key={`${item[rowKey] || 'row'}-${idx}`}
              style={{ gridTemplateColumns: gridColumns }}
            >
              {columns.map((col) => (
                <div className={`${classPrefix}-cell`} key={col.key}>
                  {col.render ? col.render(item, idx) : item[col.key]}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className={`${classPrefix}-empty`}>{emptyText}</div>
        )}
      </div>

      <div className={`${classPrefix}-pagination`}>
        <div className={`${classPrefix}-pagination-left`}>
          <button
            className={`${classPrefix}-page-btn`}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            הקודם
          </button>

          <span className={`${classPrefix}-page-current`}>
            {page} / {totalPages}
          </span>

          <button
            className={`${classPrefix}-page-btn`}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            הבא
          </button>
        </div>

        <div className={`${classPrefix}-pagination-right`}>
          <select
            className={`${classPrefix}-page-size`}
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((size) => (
              <option value={size} key={size}>
                {size} בעמוד
              </option>
            ))}
          </select>

          <span className={`${classPrefix}-range-text`}>{rangeText}</span>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
