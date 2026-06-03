// src/components/admin/DataTable.jsx
export default function DataTable({ headers, data, renderRow, emptyMessage }) {
  return (
    <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/5 border border-amber-900/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse"> {/* table-fixed is mandatory */}
          <thead>
            <tr className="bg-[#fffcf8]/50">
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className={`py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-amber-900/40 border-b border-amber-900/5 text-left ${header.className || ""}`}
                >
                  {header.label || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-900/5">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-[#fffcf8] transition-colors group">
                  {renderRow(item, index)}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="py-20 text-center text-[10px] font-bold uppercase tracking-widest text-amber-900/20">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}