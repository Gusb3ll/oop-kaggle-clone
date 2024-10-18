/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
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
        value =>
          !isNaN(parseFloat(value as string)) && isFinite(value as number),
      )
      if (values.length - 1 > 10) {
        if (!numericValues.length && values.length) {
          newChartData[header] = {
            type: 'count',
            totalCount: values.length - 1,
          }
        } else {
          const counts = numericValues.reduce((acc, value) => {
            // @ts-expect-error
            acc[value] = (acc[value] || 0) + 1

            return acc
          }, {})

          newChartData[header] = {
            type: 'chart',
            labels: Object.keys(counts),
            datasets: [
              {
                label: 'count',
                data: Object.values(counts),
                backgroundColor: '#027BA8',
                barPercentage: 1,
                categoryPercentage: 1,
              },
            ],
          }
        }
      } else if (values.length - 1 < 10 && values.length - 1 > 0) {
        newChartData[header] = {
          type: 'count',
          totalCount: values.length - 1,
        }
      }

      if (values.length - 1 > 100) {
        if (numericValues.length && values.length) {
          const maxvalue = Math.max(...numericValues.map(Number))
          const minvalue = Math.min(...numericValues.map(Number))
          const binSize = Math.ceil((maxvalue - minvalue) / 10)

          const bins = {}

          numericValues.forEach(value => {
            const binIndex =
              Math.floor((Number(value) - minvalue) / binSize) * binSize +
              minvalue
            //@ts-expect-error
            bins[binIndex] = (bins[binIndex] || 0) + 1
          })

          newChartData[header] = {
            type: 'chart',
            labels: Object.keys(bins).map(bin => {
              return `${Number(bin)}-${Number(bin) + binSize}`
            }),
            datasets: [
              {
                label: 'count',
                data: Object.values(bins),
                backgroundColor: '#027BA8',
                barPercentage: 1,
                categoryPercentage: 1,
              },
            ],
          }
        } else {
          const counts = values.reduce((acc, value) => {
            // @ts-expect-error
            acc[value] = (acc[value] || 0) + 1

            return acc
          }, {})

          const sortedCounts = Object.entries(counts).sort(
            // @ts-expect-error
            (a, b) => b[1] - a[1],
          )
          const totalCount = values.length - 1

          const stringData = sortedCounts.slice(0, 2).map(([label, count]) => ({
            label,
            count,
            percentage: (((count as number) / totalCount) * 100).toFixed(0),
          }))

          const otherCount =
            totalCount -
            stringData.reduce((sum, item) => sum + (item.count as number), 0)
          if (otherCount > 0) {
            stringData.push({
              label: `Other (${otherCount})`,
              count: otherCount,
              percentage: ((otherCount / totalCount) * 100).toFixed(0),
            })
          }

          newChartData[header] = {
            type: 'string',
            stringData,
          }
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

  const options: ChartOptions<'bar'> = {
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
      x: {
        ticks: { display: false },
      },
      y: {
        beginAtZero: false,
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
                    <div className="flex h-32 w-[180px] items-center justify-center">
                      <span className="text-lg">
                        {chartData[header]
                          ? chartData[header].stringData.map(
                              (v: { label: string; percentage: string }) => (
                                <div
                                  key={v.label}
                                  className="flex w-full flex-row justify-between gap-8 py-1 text-sm"
                                >
                                  <p className="line-clamp-1">
                                    {v.label ? v.label : 'Undefined'}
                                  </p>
                                  <p>{v.percentage}%</p>
                                </div>
                              ),
                            )
                          : ''}
                      </span>
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
