import React, { useState, useEffect } from 'react'
import { ChevronLeft, Download, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import Plot from 'react-plotly.js'

function SimulationResults({ results, modelConfig, businessContext, onBack }) {
  const [customThreshold, setCustomThreshold] = useState('')
  const [thresholdProbability, setThresholdProbability] = useState(null)
  const [selectedCI, setSelectedCI] = useState(90)

  useEffect(() => {
    if (results.statistics.mean) {
      setCustomThreshold(results.statistics.mean.toFixed(2))
    }
  }, [results])

  const calculateThresholdProbability = () => {
    const threshold = parseFloat(customThreshold)
    if (isNaN(threshold)) return
    
    const exceedCount = results.outcomes.filter(val => val >= threshold).length
    const probability = (exceedCount / results.outcomes.length) * 100
    setThresholdProbability(probability.toFixed(2))
  }

  const getRiskLevel = () => {
    const cv = results.statistics.std / Math.abs(results.statistics.mean)
    if (cv < 0.1) return { level: 'Low', color: 'green', description: 'Low variability in outcomes' }
    if (cv < 0.3) return { level: 'Medium', color: 'yellow', description: 'Moderate variability in outcomes' }
    return { level: 'High', color: 'red', description: 'High variability in outcomes' }
  }

  const getRecommendation = () => {
    const risk = getRiskLevel()
    const mean = results.statistics.mean
    const ci90Lower = results.statistics.percentiles.p5
    const ci90Upper = results.statistics.percentiles.p95
    
    // Incorporate business context into recommendations
    let contextualAction = ''
    if (businessContext.decisionSupported) {
      contextualAction = `For ${businessContext.decisionSupported}: `
    }
    
    const baseAction = risk.level === 'High' 
      ? 'Consider strategies to reduce uncertainty in key input variables. Focus on improving data quality or reducing variability in uncertain factors.'
      : risk.level === 'Medium'
      ? 'Monitor key variables and prepare contingency plans. The outcome range is manageable but requires attention.'
      : 'Proceed with confidence, but continue monitoring. The low variability suggests stable and predictable outcomes.'
    
    // Add stakeholder-specific guidance
    let stakeholderNote = ''
    if (businessContext.stakeholders) {
      stakeholderNote = ` Key stakeholders (${businessContext.stakeholders}) should be informed of the ${risk.level.toLowerCase()} risk level.`
    }
    
    return {
      summary: `Based on ${modelConfig.numSimulations.toLocaleString()} simulations, the expected ${modelConfig.targetVariable} is ${mean.toFixed(2)}.`,
      range: `With 90% confidence, the outcome will be between ${ci90Lower.toFixed(2)} and ${ci90Upper.toFixed(2)}.`,
      risk: `Risk Level: ${risk.level} - ${risk.description}`,
      action: contextualAction + baseAction + stakeholderNote
    }
  }

  const recommendation = getRecommendation()
  const risk = getRiskLevel()

  // Calculate color scale based on min/max values
  const getColorScale = (value, min, max) => {
    const normalized = (value - min) / (max - min)
    // Green (low) to Yellow (mid) to Red (high)
    if (normalized < 0.5) {
      const ratio = normalized * 2
      return `rgb(${Math.round(34 + ratio * 221)}, ${Math.round(197 + ratio * 58)}, ${Math.round(94 - ratio * 94)})`
    } else {
      const ratio = (normalized - 0.5) * 2
      return `rgb(${Math.round(255)}, ${Math.round(255 - ratio * 92)}, ${Math.round(0 - ratio * 0)})`
    }
  }

  // Histogram data with color gradient
  const histogramData = [{
    x: results.outcomes,
    type: 'histogram',
    nbinsx: 50,
    marker: { 
      color: results.outcomes.map(val => 
        getColorScale(val, results.statistics.min, results.statistics.max)
      ),
      line: { color: '#0369a1', width: 0.5 }
    },
    name: 'Frequency'
  }]

  const histogramLayout = {
    title: 'Distribution of Simulation Outcomes',
    xaxis: { title: modelConfig.targetVariable },
    yaxis: { title: 'Frequency' },
    shapes: [
      {
        type: 'line',
        x0: results.statistics.mean,
        x1: results.statistics.mean,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: { color: 'red', width: 2, dash: 'dash' }
      },
      {
        type: 'line',
        x0: results.statistics.median,
        x1: results.statistics.median,
        y0: 0,
        y1: 1,
        yref: 'paper',
        line: { color: 'green', width: 2, dash: 'dash' }
      }
    ],
    annotations: [
      {
        x: results.statistics.mean,
        y: 1,
        yref: 'paper',
        text: `Mean: ${results.statistics.mean.toFixed(2)}`,
        showarrow: true,
        arrowhead: 2,
        ax: 40,
        ay: -40
      }
    ],
    autosize: true,
    height: 400
  }

  // CDF data with gradient coloring
  const sortedOutcomes = [...results.outcomes].sort((a, b) => a - b)
  const cdfData = [{
    x: sortedOutcomes,
    y: sortedOutcomes.map((_, i) => (i + 1) / sortedOutcomes.length * 100),
    type: 'scatter',
    mode: 'lines',
    line: { 
      color: sortedOutcomes.map(val => 
        getColorScale(val, results.statistics.min, results.statistics.max)
      ),
      width: 3
    },
    name: 'Cumulative Probability'
  }]

  const cdfLayout = {
    title: 'Cumulative Distribution Function (CDF)',
    xaxis: { title: modelConfig.targetVariable },
    yaxis: { title: 'Cumulative Probability (%)', range: [0, 100] },
    autosize: true,
    height: 400
  }

  // Box plot data with gradient coloring
  const boxPlotData = [{
    y: results.outcomes,
    type: 'box',
    marker: { 
      color: results.outcomes.map(val => 
        getColorScale(val, results.statistics.min, results.statistics.max)
      )
    },
    name: modelConfig.targetVariable,
    boxmean: 'sd',
    fillcolor: 'rgba(14, 165, 233, 0.3)'
  }]

  const boxPlotLayout = {
    title: 'Statistical Summary (Box Plot)',
    yaxis: { title: modelConfig.targetVariable },
    autosize: true,
    height: 400
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Mean</p>
          <p className="text-2xl font-bold text-gray-900">{results.statistics.mean.toFixed(2)}</p>
        </div>
        <div className="card bg-green-50 border-green-200">
          <p className="text-sm text-gray-600 mb-1">Median</p>
          <p className="text-2xl font-bold text-gray-900">{results.statistics.median.toFixed(2)}</p>
        </div>
        <div className="card bg-yellow-50 border-yellow-200">
          <p className="text-sm text-gray-600 mb-1">Std Deviation</p>
          <p className="text-2xl font-bold text-gray-900">{results.statistics.std.toFixed(2)}</p>
        </div>
        <div className={`card bg-${risk.color}-50 border-${risk.color}-200`}>
          <p className="text-sm text-gray-600 mb-1">Risk Level</p>
          <p className="text-2xl font-bold text-gray-900">{risk.level}</p>
        </div>
      </div>

      {/* Decision Guidance - Enhanced with Business Context */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-start space-x-3 mb-4">
          <TrendingUp className="h-6 w-6 text-primary-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Decision Guidance</h3>
            
            {/* Business Context Display */}
            {(businessContext.problemStatement || businessContext.decisionSupported || businessContext.stakeholders) && (
              <div className="mb-3 p-3 bg-white rounded-lg border border-primary-200">
                <p className="text-xs font-semibold text-primary-700 mb-2">Business Context Applied:</p>
                {businessContext.problemStatement && (
                  <p className="text-xs text-gray-700 mb-1">
                    <strong>Problem:</strong> {businessContext.problemStatement}
                  </p>
                )}
                {businessContext.decisionSupported && (
                  <p className="text-xs text-gray-700 mb-1">
                    <strong>Decision:</strong> {businessContext.decisionSupported}
                  </p>
                )}
                {businessContext.stakeholders && (
                  <p className="text-xs text-gray-700">
                    <strong>Stakeholders:</strong> {businessContext.stakeholders}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-800"><strong>Summary:</strong> {recommendation.summary}</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-800"><strong>Confidence Range:</strong> {recommendation.range}</p>
          </div>
          <div className="p-3 bg-white rounded-lg">
            <p className="text-sm text-gray-800"><strong>Risk Assessment:</strong> {recommendation.risk}</p>
          </div>
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800"><strong>Contextual Recommendation:</strong> {recommendation.action}</p>
          </div>
        </div>
      </div>

      {/* Statistical Metrics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistical Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Minimum</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.min.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">5th Percentile</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.percentiles.p5.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">25th Percentile</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.percentiles.p25.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">50th Percentile</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.percentiles.p50.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">75th Percentile</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.percentiles.p75.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">95th Percentile</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.percentiles.p95.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Maximum</p>
            <p className="text-lg font-semibold text-gray-900">{results.statistics.max.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">Simulations</p>
            <p className="text-lg font-semibold text-gray-900">{results.outcomes.length.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Confidence Intervals - Enhanced */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Intervals</h3>
        
        {/* CI Selector */}
        <div className="mb-4">
          <label className="label text-gray-900">Select Confidence Level</label>
          <div className="flex flex-wrap gap-2">
            {[80, 90, 95, 99].map(ci => (
              <button
                key={ci}
                onClick={() => setSelectedCI(ci)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCI === ci
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {ci}%
              </button>
            ))}
          </div>
        </div>

        {/* Display all confidence intervals */}
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            selectedCI === 99 ? 'bg-purple-100 border-2 border-purple-400' : 'bg-purple-50'
          }`}>
            <span className="text-sm font-medium text-gray-900">99% Confidence Interval</span>
            <span className="text-sm text-gray-700">
              [{results.statistics.percentiles.p5.toFixed(2)}, {results.statistics.percentiles.p95.toFixed(2)}]
            </span>
          </div>
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            selectedCI === 95 ? 'bg-blue-100 border-2 border-blue-400' : 'bg-blue-50'
          }`}>
            <span className="text-sm font-medium text-gray-900">95% Confidence Interval</span>
            <span className="text-sm text-gray-700">
              [{results.statistics.percentiles.p5.toFixed(2)}, {results.statistics.percentiles.p95.toFixed(2)}]
            </span>
          </div>
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            selectedCI === 90 ? 'bg-green-100 border-2 border-green-400' : 'bg-green-50'
          }`}>
            <span className="text-sm font-medium text-gray-900">90% Confidence Interval</span>
            <span className="text-sm text-gray-700">
              [{results.statistics.percentiles.p5.toFixed(2)}, {results.statistics.percentiles.p95.toFixed(2)}]
            </span>
          </div>
          <div className={`flex items-center justify-between p-3 rounded-lg ${
            selectedCI === 80 ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-yellow-50'
          }`}>
            <span className="text-sm font-medium text-gray-900">80% Confidence Interval</span>
            <span className="text-sm text-gray-700">
              [{results.statistics.percentiles.p10.toFixed(2)}, {results.statistics.percentiles.p90.toFixed(2)}]
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-900">50% Confidence Interval (IQR)</span>
            <span className="text-sm text-gray-700">
              [{results.statistics.percentiles.p25.toFixed(2)}, {results.statistics.percentiles.p75.toFixed(2)}]
            </span>
          </div>
        </div>
        
        {/* Interpretation */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Interpretation:</strong> There is a {selectedCI}% probability that the actual outcome will fall within the highlighted interval. Higher confidence levels provide wider ranges.
          </p>
        </div>
      </div>

      {/* Custom Threshold Calculator */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Threshold Probability Calculator</h3>
        <p className="text-sm text-gray-600 mb-3">
          Calculate the probability of meeting or exceeding a specific target value.
        </p>
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label className="label text-gray-900">Target Threshold</label>
            <input
              type="number"
              step="0.01"
              value={customThreshold}
              onChange={(e) => setCustomThreshold(e.target.value)}
              className="input-field"
              placeholder="Enter target value"
            />
          </div>
          <button onClick={calculateThresholdProbability} className="btn-primary">
            Calculate
          </button>
        </div>
        {thresholdProbability !== null && (
          <div className="mt-3 p-3 bg-white rounded-lg border border-yellow-300">
            <p className="text-sm text-gray-800">
              <strong>Probability of reaching or exceeding {customThreshold}:</strong> {thresholdProbability}%
            </p>
          </div>
        )}
      </div>

      {/* Visualizations */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Visualizations</h3>
        
        {/* Color Legend */}
        <div className="mb-4 p-4 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-lg">
          <div className="flex items-center justify-between text-white text-xs font-semibold">
            <span className="bg-black bg-opacity-50 px-2 py-1 rounded">Low Values (Min: {results.statistics.min.toFixed(2)})</span>
            <span className="bg-black bg-opacity-50 px-2 py-1 rounded">Mid Range</span>
            <span className="bg-black bg-opacity-50 px-2 py-1 rounded">High Values (Max: {results.statistics.max.toFixed(2)})</span>
          </div>
          <p className="text-center text-xs text-white mt-2 bg-black bg-opacity-50 py-1 rounded">
            Charts are color-coded: Green = Lower values, Yellow = Mid-range, Red = Higher values
          </p>
        </div>
        
        <div className="space-y-6">
          {/* Histogram */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Plot
              data={histogramData}
              layout={histogramLayout}
              config={{ responsive: true }}
              style={{ width: '100%' }}
            />
          </div>

          {/* CDF */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Plot
              data={cdfData}
              layout={cdfLayout}
              config={{ responsive: true }}
              style={{ width: '100%' }}
            />
          </div>

          {/* Box Plot */}
          <div className="bg-gray-50 rounded-lg p-4">
            <Plot
              data={boxPlotData}
              layout={boxPlotLayout}
              config={{ responsive: true }}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Configuration</span>
        </button>
        <button 
          onClick={() => {
            const dataStr = JSON.stringify(results, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })
            const url = URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = 'monte_carlo_results.json'
            link.click()
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export Results</span>
        </button>
      </div>
    </div>
  )
}

export default SimulationResults
