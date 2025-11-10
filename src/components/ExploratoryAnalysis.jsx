import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Info } from 'lucide-react'
import Plot from 'react-plotly.js'

function ExploratoryAnalysis({ data, onComplete, onBack }) {
  const [numericColumns, setNumericColumns] = useState([])
  const [categoricalColumns, setCategoricalColumns] = useState([])
  const [targetVariable, setTargetVariable] = useState('')
  const [inputVariables, setInputVariables] = useState([])
  const [correlationMatrix, setCorrelationMatrix] = useState(null)
  const [statistics, setStatistics] = useState({})
  const isLargeDataset = data.data.length > 10000

  useEffect(() => {
    categorizeColumns()
    calculateStatistics()
  }, [])

  useEffect(() => {
    if (numericColumns.length > 0) {
      calculateCorrelation()
    }
  }, [numericColumns])

  const categorizeColumns = () => {
    const numeric = []
    const categorical = []

    data.columns.forEach(col => {
      const sample = data.data.find(row => row[col] !== null && row[col] !== undefined)
      if (sample && typeof sample[col] === 'number') {
        numeric.push(col)
      } else {
        categorical.push(col)
      }
    })

    setNumericColumns(numeric)
    setCategoricalColumns(categorical)
    if (numeric.length > 0 && !targetVariable) {
      setTargetVariable(numeric[0])
    }
  }

  const calculateStatistics = () => {
    const stats = {}
    
    data.columns.forEach(col => {
      const values = data.data
        .map(row => row[col])
        .filter(val => val !== null && val !== undefined && !isNaN(val))
      
      if (values.length > 0 && typeof values[0] === 'number') {
        // For large datasets, limit to first 10000 rows for statistics
        const sampleValues = values.length > 10000 ? values.slice(0, 10000) : values
        const sorted = [...sampleValues].sort((a, b) => a - b)
        const sum = sampleValues.reduce((a, b) => a + b, 0)
        const mean = sum / sampleValues.length
        const variance = sampleValues.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sampleValues.length
        const std = Math.sqrt(variance)
        
        // Find min/max without spread operator to avoid stack overflow
        let min = sampleValues[0]
        let max = sampleValues[0]
        for (let i = 1; i < sampleValues.length; i++) {
          if (sampleValues[i] < min) min = sampleValues[i]
          if (sampleValues[i] > max) max = sampleValues[i]
        }
        
        stats[col] = {
          count: values.length,
          mean: mean.toFixed(2),
          std: std.toFixed(2),
          min: min.toFixed(2),
          q25: sorted[Math.floor(sampleValues.length * 0.25)].toFixed(2),
          median: sorted[Math.floor(sampleValues.length * 0.5)].toFixed(2),
          q75: sorted[Math.floor(sampleValues.length * 0.75)].toFixed(2),
          max: max.toFixed(2)
        }
      }
    })
    
    setStatistics(stats)
  }

  const calculateCorrelation = () => {
    const n = numericColumns.length
    const matrix = Array(n).fill(0).map(() => Array(n).fill(0))
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) {
          matrix[i][j] = 1
        } else {
          const col1 = numericColumns[i]
          const col2 = numericColumns[j]
          matrix[i][j] = calculatePearsonCorrelation(col1, col2)
        }
      }
    }
    
    setCorrelationMatrix(matrix)
  }

  const calculatePearsonCorrelation = (col1, col2) => {
    const pairs = data.data
      .map(row => [row[col1], row[col2]])
      .filter(([a, b]) => a !== null && b !== null && !isNaN(a) && !isNaN(b))
    
    if (pairs.length === 0) return 0
    
    const n = pairs.length
    const sum1 = pairs.reduce((a, [x]) => a + x, 0)
    const sum2 = pairs.reduce((a, [, y]) => a + y, 0)
    const sum1Sq = pairs.reduce((a, [x]) => a + x * x, 0)
    const sum2Sq = pairs.reduce((a, [, y]) => a + y * y, 0)
    const pSum = pairs.reduce((a, [x, y]) => a + x * y, 0)
    
    const num = pSum - (sum1 * sum2 / n)
    const den = Math.sqrt((sum1Sq - sum1 * sum1 / n) * (sum2Sq - sum2 * sum2 / n))
    
    return den === 0 ? 0 : num / den
  }

  const toggleInputVariable = (col) => {
    if (inputVariables.includes(col)) {
      setInputVariables(inputVariables.filter(v => v !== col))
    } else {
      setInputVariables([...inputVariables, col])
    }
  }

  const handleComplete = () => {
    if (!targetVariable || inputVariables.length === 0) {
      alert('Please select a target variable and at least one input variable')
      return
    }
    onComplete(targetVariable, inputVariables, data.columns)
  }

  const getHistogramData = (column) => {
    const values = data.data
      .map(row => row[column])
      .filter(val => val !== null && val !== undefined && !isNaN(val))
    
    // Sample data for large datasets to improve performance
    const sampleValues = values.length > 5000 ? 
      values.filter((_, i) => i % Math.ceil(values.length / 5000) === 0) : 
      values
    
    return [{
      x: sampleValues,
      type: 'histogram',
      marker: { color: '#0ea5e9' },
      name: column
    }]
  }

  const getBoxPlotData = (column) => {
    const values = data.data
      .map(row => row[column])
      .filter(val => val !== null && val !== undefined && !isNaN(val))
    
    // Sample data for large datasets to improve performance
    const sampleValues = values.length > 5000 ? 
      values.filter((_, i) => i % Math.ceil(values.length / 5000) === 0) : 
      values
    
    return [{
      y: sampleValues,
      type: 'box',
      marker: { color: '#0ea5e9' },
      name: column
    }]
  }

  const getBarChartData = (column) => {
    const counts = {}
    data.data.forEach(row => {
      const val = row[column]
      if (val !== null && val !== undefined) {
        counts[val] = (counts[val] || 0) + 1
      }
    })
    
    // Limit to top 50 categories for large datasets
    const sortedEntries = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
    
    return [{
      x: sortedEntries.map(e => e[0]),
      y: sortedEntries.map(e => e[1]),
      type: 'bar',
      marker: { color: '#0ea5e9' }
    }]
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Exploratory Data Analysis</h2>
        <p className="text-gray-600 mb-4">
          Analyze your data distribution, correlations, and select variables for modeling.
        </p>

        {/* Large Dataset Warning */}
        {isLargeDataset && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Large Dataset Detected ({data.data.length.toLocaleString()} rows)</p>
              <p className="mt-1">For optimal performance, statistics use a sample of 10,000 rows and visualizations use a sample of 5,000 data points. This provides accurate insights while maintaining responsiveness.</p>
            </div>
          </div>
        )}

        {/* Statistical Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Statistical Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Column</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Count</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Mean</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Std</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Min</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">25%</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">50%</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">75%</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Max</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(statistics).map(([col, stats]) => (
                  <tr key={col} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-900">{col}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.count}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.mean}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.std}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.min}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.q25}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.median}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.q75}</td>
                    <td className="px-4 py-2 text-right text-gray-600">{stats.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Correlation Heatmap */}
        {correlationMatrix && numericColumns.length > 1 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Correlation Matrix</h3>
            <div className="bg-white rounded-lg">
              <Plot
                data={[{
                  z: correlationMatrix,
                  x: numericColumns,
                  y: numericColumns,
                  type: 'heatmap',
                  colorscale: 'RdBu',
                  zmid: 0,
                  zmin: -1,
                  zmax: 1,
                  text: correlationMatrix.map(row => row.map(val => val.toFixed(2))),
                  texttemplate: '%{text}',
                  textfont: { size: 10 },
                  hoverongaps: false
                }]}
                layout={{
                  autosize: true,
                  height: 400,
                  margin: { l: 100, r: 50, t: 50, b: 100 },
                  xaxis: { side: 'bottom' },
                  yaxis: { side: 'left' }
                }}
                config={{ responsive: true }}
                style={{ width: '100%' }}
              />
            </div>
          </div>
        )}

        {/* Univariate Analysis - Histograms */}
        {numericColumns.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Distribution Analysis (Histograms)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numericColumns.slice(0, 4).map(col => (
                <div key={col} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{col}</h4>
                  <Plot
                    data={getHistogramData(col)}
                    layout={{
                      autosize: true,
                      height: 250,
                      margin: { l: 50, r: 20, t: 20, b: 40 },
                      showlegend: false
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Box Plots */}
        {numericColumns.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Box Plots (Outlier Detection)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {numericColumns.slice(0, 4).map(col => (
                <div key={col} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{col}</h4>
                  <Plot
                    data={getBoxPlotData(col)}
                    layout={{
                      autosize: true,
                      height: 250,
                      margin: { l: 50, r: 20, t: 20, b: 40 },
                      showlegend: false
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categorical Analysis */}
        {categoricalColumns.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Categorical Variables</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoricalColumns.slice(0, 4).map(col => (
                <div key={col} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{col}</h4>
                  <Plot
                    data={getBarChartData(col)}
                    layout={{
                      autosize: true,
                      height: 250,
                      margin: { l: 50, r: 20, t: 20, b: 80 },
                      showlegend: false,
                      xaxis: { tickangle: -45 }
                    }}
                    config={{ responsive: true }}
                    style={{ width: '100%' }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variable Selection */}
        <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Variables for Modeling</h3>
          
          <div className="mb-4">
            <label className="label text-gray-900">Target Variable (What are you predicting?)</label>
            <select
              value={targetVariable}
              onChange={(e) => setTargetVariable(e.target.value)}
              className="input-field"
            >
              <option value="">Select target variable...</option>
              {numericColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label text-gray-900 mb-2">Input Variables (Select factors that influence the target)</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {data.columns.filter(col => col !== targetVariable).map(col => (
                <label key={col} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputVariables.includes(col)}
                    onChange={() => toggleInputVariable(col)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{col}</span>
                </label>
              ))}
            </div>
          </div>

          {targetVariable && inputVariables.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <p className="text-sm text-green-800">
                <strong>Selected:</strong> Predicting <strong>{targetVariable}</strong> using {inputVariables.length} input variable(s)
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button 
            onClick={handleComplete}
            disabled={!targetVariable || inputVariables.length === 0}
            className="btn-primary flex items-center space-x-2"
          >
            <span>Configure Model</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ExploratoryAnalysis
