import type { ReactNode } from "react";

export interface Column<T> {
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  keyField: (row: T) => string;
  emptyMessage?: string;
}

export function DataTable<T>({ columns, rows, keyField, emptyMessage = "Nothing to show yet." }: Props<T>) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-brand-sky/60 bg-white p-10 text-center text-sm text-brand-ink/60">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-sky/40 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="bg-brand-sky-light text-xs font-semibold uppercase tracking-wide text-brand-blue-dark">
          <tr>
            {columns.map((col) => (
              <th key={col.header} scope="col" className="px-4 py-3">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-sky/20">
          {rows.map((row) => (
            <tr key={keyField(row)} className="hover:bg-brand-sky-light/40">
              {columns.map((col) => (
                <td key={col.header} className={`px-4 py-3 align-middle ${col.className ?? ""}`}>
                  {col.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
