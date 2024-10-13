/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

type CSVTableProps = {
  csv: { [key: string]: number | string }[]
}

const CSVTable: React.FC<CSVTableProps> = ({ csv }) => {
  const [chartData, setChartData] = useState<any>({})

  useEffect(() => {
    if (csv.length === 0) {
      return
    }

    const newChartData: any = {}
    const headers = Object.keys(csv[0])

    headers.forEach(header => {
      const values = csv.map(row => row[header])
      const numericValues = values.filter(
        value => !isNaN(parseFloat(value as any)) && isFinite(value as any),
      )
      const valueCount = values.length - 1

      if (valueCount > 10) {
        if (numericValues.length > 0) {
          const counts = numericValues.reduce((acc: any, value) => {
            acc[value] = (acc[value] || 0) + 1

            return acc
          }, {})

          newChartData[header] = {
            type: 'chart',
            labels: Object.keys(counts),
            datasets: [
              {
                label: header,
                data: Object.values(counts),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
              },
            ],
          }
        } else if (values.length) {
          newChartData[header] = {
            type: 'count',
            totalCount: valueCount,
          }
        }
      } else if (valueCount > 0) {
        newChartData[header] = {
          type: 'count',
          totalCount: valueCount,
        }
      }
    })

    setChartData(newChartData)
    setCurrentPage(1)
  }, [csv])

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

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
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
            <tr className="sticky top-0 z-10 h-32 bg-white">
              {Object.keys(csv[0]).map((header, index) => (
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
            </tr>
            {currentRows.map((row, i) => (
              <tr key={`r_${i}`}>
                {Object.values(row).map((cell, i) => (
                  <td key={`c_${i}`} className="border px-4 py-2">
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
