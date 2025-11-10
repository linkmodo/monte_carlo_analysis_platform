import React, { useState } from 'react'
import { Upload, FileSpreadsheet, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'

function DataUpload({ onDataUpload }) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (file) => {
    setLoading(true)
    setError(null)

    // Check file size (warn if > 10MB)
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > 10) {
      console.warn(`Large file detected: ${fileSizeMB.toFixed(2)}MB. Processing may take longer.`)
    }

    const fileExtension = file.name.split('.').pop().toLowerCase()

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError('Error parsing CSV file')
            setLoading(false)
            return
          }
          
          // Warn if dataset is very large
          if (results.data.length > 50000) {
            console.warn(`Large dataset: ${results.data.length} rows. Visualizations will use sampling for performance.`)
          }
          
          onDataUpload({
            data: results.data,
            columns: results.meta.fields,
            fileName: file.name
          })
          setLoading(false)
        },
        error: (error) => {
          setError(`Error reading file: ${error.message}`)
          setLoading(false)
        }
      })
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { defval: null })
          const columns = Object.keys(jsonData[0] || {})
          
          onDataUpload({
            data: jsonData,
            columns: columns,
            fileName: file.name
          })
          setLoading(false)
        } catch (err) {
          setError(`Error reading Excel file: ${err.message}`)
          setLoading(false)
        }
      }
      reader.onerror = () => {
        setError('Error reading file')
        setLoading(false)
      }
      reader.readAsArrayBuffer(file)
    } else {
      setError('Unsupported file format. Please upload CSV or Excel files.')
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const loadSampleData = () => {
    // Sample sales data for demonstration
    const sampleData = [
      { Month: 'Jan', Sales: 45000, Marketing: 5000, Season: 'Winter', Region: 'North' },
      { Month: 'Feb', Sales: 48000, Marketing: 5200, Season: 'Winter', Region: 'North' },
      { Month: 'Mar', Sales: 52000, Marketing: 5500, Season: 'Spring', Region: 'North' },
      { Month: 'Apr', Sales: 55000, Marketing: 6000, Season: 'Spring', Region: 'South' },
      { Month: 'May', Sales: 58000, Marketing: 6200, Season: 'Spring', Region: 'South' },
      { Month: 'Jun', Sales: 62000, Marketing: 6500, Season: 'Summer', Region: 'South' },
      { Month: 'Jul', Sales: 68000, Marketing: 7000, Season: 'Summer', Region: 'West' },
      { Month: 'Aug', Sales: 65000, Marketing: 6800, Season: 'Summer', Region: 'West' },
      { Month: 'Sep', Sales: 60000, Marketing: 6300, Season: 'Fall', Region: 'West' },
      { Month: 'Oct', Sales: 57000, Marketing: 6000, Season: 'Fall', Region: 'East' },
      { Month: 'Nov', Sales: 54000, Marketing: 5800, Season: 'Fall', Region: 'East' },
      { Month: 'Dec', Sales: 70000, Marketing: 7500, Season: 'Winter', Region: 'East' },
      { Month: 'Jan', Sales: 46000, Marketing: 5100, Season: 'Winter', Region: 'North' },
      { Month: 'Feb', Sales: 49000, Marketing: 5300, Season: 'Winter', Region: 'North' },
      { Month: 'Mar', Sales: 53000, Marketing: 5600, Season: 'Spring', Region: 'North' },
      { Month: 'Apr', Sales: 56000, Marketing: 6100, Season: 'Spring', Region: 'South' },
      { Month: 'May', Sales: 59000, Marketing: 6300, Season: 'Spring', Region: 'South' },
      { Month: 'Jun', Sales: 63000, Marketing: 6600, Season: 'Summer', Region: 'South' },
      { Month: 'Jul', Sales: 69000, Marketing: 7100, Season: 'Summer', Region: 'West' },
      { Month: 'Aug', Sales: 66000, Marketing: 6900, Season: 'Summer', Region: 'West' },
    ]

    onDataUpload({
      data: sampleData,
      columns: Object.keys(sampleData[0]),
      fileName: 'sample_sales_data.csv'
    })
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Dataset</h2>
        <p className="text-gray-600 mb-6">
          Upload a CSV or Excel file containing your historical data for analysis.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div
          className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".csv,.xlsx,.xls"
            onChange={handleChange}
            disabled={loading}
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {loading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
              ) : (
                <FileSpreadsheet className="h-16 w-16 text-gray-400" />
              )}
            </div>
            
            {!loading && (
              <>
                <div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center space-x-2 btn-primary"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Choose File</span>
                  </label>
                  <p className="mt-2 text-sm text-gray-600">or drag and drop</p>
                </div>
                
                <p className="text-xs text-gray-500">
                  Supported formats: CSV, XLSX, XLS
                </p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">Don't have data? Try our sample dataset:</p>
          <button
            onClick={loadSampleData}
            className="btn-secondary"
            disabled={loading}
          >
            Load Sample Sales Data
          </button>
        </div>
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Data Requirements</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Your dataset should contain historical data with at least one numerical target variable</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Include relevant input variables that may influence your target outcome</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Minimum 10 rows recommended for meaningful analysis</span>
          </li>
          <li className="flex items-start">
            <span className="text-primary-600 mr-2">•</span>
            <span>Column headers should be in the first row</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default DataUpload
