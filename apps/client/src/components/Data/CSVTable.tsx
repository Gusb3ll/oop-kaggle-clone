import React, { useState } from 'react'

type CSVTableProps = {
  csv: any
}

const CSVTable: React.FC<CSVTableProps> = ({ csv }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 20

  const totalPages = Math.ceil(csv.length / rowsPerPage)

  const lastIndex = currentPage * rowsPerPage
  const firstIndex = lastIndex - rowsPerPage
  const currentRows = csv.slice(firstIndex, lastIndex)

  const getNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Scrollable Table Container */}
      <div className="flex-grow overflow-y-auto">
        <table className="min-w-full table-fixed border-collapse">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {Object.keys(csv[0]).map((header, index) => (
                <th key={index} className="border bg-gray-100 px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* <tr className="sticky top-0 z-10 h-32 bg-white">
            {Object.keys(csvData[0]).map((header, index) => (
              <td key={index} className="border px-4 py-2">
                {chartData[header]?.type === 'count' ? (
                  <div className="flex h-32 items-center justify-center">
                    <span className="text-1xl font-bold">
                      {chartData[header].totalCount} total values
                    </span>
                  </div>
                ) : chartData[header]?.type === 'chart' ? (
                  <div className="h-32">
                    <Bar options={options} data={chartData[header]} />
                  </div>
                ) : (
                  <div className="flex h-32 items-center justify-center">
                    <span className="text-lg">Data column</span>
                  </div>
                )}
              </td>
            ))}
          </tr> */}
            {currentRows.map((row: any, rowIndex: number) => (
              <tr key={rowIndex}>
                {Object.values(row).map((cell: any, cellIndex: number) => (
                  <td key={cellIndex} className="border px-4 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="sticky bottom-0 flex items-center justify-between bg-white p-4 shadow-md">
        <button
          onClick={getPrevPage}
          disabled={currentPage === 1}
          className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={getNextPage}
          disabled={currentPage === totalPages}
          className="rounded bg-gray-300 px-4 py-2 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default CSVTable
