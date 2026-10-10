import type { ReactNode } from 'react';

export function TokenTable({ columns, children }: { columns: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-container border border-line-default">
      <table className="w-full border-collapse">
        <thead className="bg-surface-sunken">
          <tr>
            {columns.map((c) => (
              <th
                key={c}
                scope="col"
                className="border-b border-line-default px-3 py-2 text-start text-label-sm text-fg-secondary"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, nowrap = false }: { children: ReactNode; nowrap?: boolean }) {
  return (
    <td
      className={`border-b border-line-subtle px-3 py-2 align-top ${nowrap ? 'whitespace-nowrap' : ''}`}
    >
      {children}
    </td>
  );
}
