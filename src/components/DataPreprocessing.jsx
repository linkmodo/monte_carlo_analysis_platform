import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'

function DataPreprocessing({ data, onComplete, onBack }) {
  const [missingValues, setMissingValues] = useState({})
  const [dataTypes, setDataTypes] = useState({})
  const [selectedColumns, setSelectedColumns] = useState([])
  const [imputationMethods, setImputationMethods] = useState({})
  const [processedData, setProcessedData] = useState(data.data)

  useEffect(() => {
    analyzeMissingValues()
    detectDataTypes()
    setSelectedColumns(data.columns)
  }, [])

  const analyzeMissingValues = () => {
    const missing = {}
    data.columns.forEach(col => {
      const nullCount = data.data.filter(row => 
        row[col] === null || row[col] === undefined || row[col] === ''
      ).length
      missing[col] = {
        count: nullCount,
        percentage: ((nullCount / data.data.length) * 100).toFixed(2)
      }
    })
    setMissingValues(missing)
  }

  const detectDataTypes = () => {
    const types = {}
    data.columns.forEach(col => {
      const sample = data.data.find(row => row[col] !== null && row[col] !== undefined)
      if (sample) {
        const value = sample[col]
        if (typeof value === 'number') {
          types[col] = 'numeric'
        } else if (!isNaN(Date.parse(value))) {
          types[col] = 'datetime'
        } else {
          types[col] = 'categorical'
        }
      } else {
        types[col] = 'unknown'
      }
    })
    setDataTypes(types)
  }

  const handleImputationChange = (column, method) => {
    setImputationMethods({
      ...imputationMethods,
      [column]: method
    })
  }

  const handleDataTypeChange = (column, newType) => {
    setDataTypes({
      ...dataTypes,
      [column]: newType
    })
  }

  const toggleColumnSelection = (column) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(col => col !== column))
    } else {
      setSelectedColumns([...selectedColumns, column])
    }
  }

  const applyPreprocessing = () => {
    let cleaned = [...data.data]

    // Apply imputation
    Object.entries(imputationMethods).forEach(([column, method]) => {
      if (method === 'drop') {
        cleaned = cleaned.filter(row => 
          row[column] !== null && row[column] !== undefined && row[column] !== ''
        )
      } else if (method === 'mean') {
        const values = cleaned
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(val))
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        cleaned = cleaned.map(row => ({
          ...row,
          [column]: (row[column] === null || row[column] === undefined || row[column] === '') ? mean : row[column]
        }))
      } else if (method === 'median') {
        const values = cleaned
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(val))
          .sort((a, b) => a - b)
        const median = values[Math.floor(values.length / 2)]
        cleaned = cleaned.map(row => ({
          ...row,
          [column]: (row[column] === null || row[column] === undefined || row[column] === '') ? median : row[column]
        }))
      } else if (method === 'mode') {
        const values = cleaned
          .map(row => row[column])
          .filter(val => val !== null && val !== undefined && val !== '')
        const mode = values.sort((a, b) =>
          values.filter(v => v === a).length - values.filter(v => v === b).length
        ).pop()
        cleaned = cleaned.map(row => ({
          ...row,
          [column]: (row[column] === null || row[column] === undefined || row[column] === '') ? mode : row[column]
        }))
      }
    })

    // Filter selected columns
    cleaned = cleaned.map(row => {
      const filtered = {}
      selectedColumns.forEach(col => {
        filtered[col] = row[col]
      })
      return filtered
    })

    setProcessedData(cleaned)
  }

  const handleComplete = () => {
    applyPreprocessing()
    onComplete({
      data: processedData,
      columns: selectedColumns,
      fileName: data.fileName
    })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Data Preprocessing</h2>
        <p className="text-gray-600 mb-6">
          Clean and prepare your data for analysis. Handle missing values, adjust data types, and select relevant columns.
        </p>

        {/* Dataset Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">{data.data.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Columns</p>
              <p className="text-2xl font-bold text-gray-900">{data.columns.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Selected Columns</p>
              <p className="text-2xl font-bold text-primary-600">{selectedColumns.length}</p>
            </div>
          </div>
        </div>

        {/* Missing Values Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Missing Values Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Missing</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handle Missing</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Include</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.columns.map(column => (
                  <tr key={column} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{column}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={dataTypes[column] || 'unknown'}
                        onChange={(e) => handleDataTypeChange(column, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="numeric">Numeric</option>
                        <option value="categorical">Categorical</option>
                        <option value="datetime">DateTime</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {missingValues[column]?.count || 0}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(missingValues[column]?.percentage || 0) > 10
                          ? 'bg-red-100 text-red-800'
                          : parseFloat(missingValues[column]?.percentage || 0) > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {missingValues[column]?.percentage || 0}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {parseFloat(missingValues[column]?.percentage || 0) > 0 ? (
                        <select
                          value={imputationMethods[column] || 'none'}
                          onChange={(e) => handleImputationChange(column, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="none">None</option>
                          <option value="drop">Drop Rows</option>
                          {dataTypes[column] === 'numeric' && (
                            <>
                              <option value="mean">Mean</option>
                              <option value="median">Median</option>
                            </>
                          )}
                          <option value="mode">Mode</option>
                        </select>
                      ) : (
                        <span className="text-gray-400 text-xs">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(column)}
                        onChange={() => toggleColumnSelection(column)}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Preview (First 5 Rows)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {selectedColumns.map(col => (
                    <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    {selectedColumns.map(col => (
                      <td key={col} className="px-4 py-2 text-gray-900">
                        {row[col] !== null && row[col] !== undefined ? String(row[col]) : (
                          <span className="text-red-400 italic">null</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button 
            onClick={handleComplete}
            disabled={selectedColumns.length === 0}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Continue to Analysis</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DataPreprocessing
