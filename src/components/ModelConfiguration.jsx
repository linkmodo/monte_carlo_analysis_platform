import React, { useState, useEffect } from 'react'
import { ChevronLeft, Play, Settings2 } from 'lucide-react'
import { runMonteCarloSimulation } from '../utils/monteCarloEngine'

function ModelConfiguration({ data, targetVariable, inputVariables, onConfigured, onSimulate, onBack }) {
  const [uncertainVariables, setUncertainVariables] = useState([])
  const [distributions, setDistributions] = useState({})
  const [modelType, setModelType] = useState('linear')
  const [numSimulations, setNumSimulations] = useState(10000)
  const [coefficients, setCoefficients] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Initialize all input variables as uncertain by default
    setUncertainVariables(inputVariables)
    fitDistributions()
    estimateCoefficients()
  }, [])

  const fitDistributions = () => {
    const fitted = {}
    
    inputVariables.forEach(variable => {
      const values = data.data
        .map(row => row[variable])
        .filter(val => val !== null && val !== undefined && !isNaN(val))
      
      if (values.length === 0) return
      
      // Calculate statistics
      const mean = values.reduce((a, b) => a + b, 0) / values.length
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
      const std = Math.sqrt(variance)
      const min = Math.min(...values)
      const max = Math.max(...values)
      
      // Simple distribution fitting logic
      // Check if data looks normal (using coefficient of variation)
      const cv = std / Math.abs(mean)
      
      let suggestedDist = 'normal'
      if (cv < 0.1) {
        suggestedDist = 'normal'
      } else if (min >= 0 && (max - min) / std < 4) {
        suggestedDist = 'uniform'
      } else {
        suggestedDist = 'normal'
      }
      
      fitted[variable] = {
        type: suggestedDist,
        params: {
          mean: mean,
          std: std,
          min: min,
          max: max
        }
      }
    })
    
    setDistributions(fitted)
  }

  const estimateCoefficients = () => {
    // Simple linear regression coefficient estimation
    const coef = {}
    
    // Get target values
    const targetValues = data.data
      .map(row => row[targetVariable])
      .filter(val => val !== null && val !== undefined && !isNaN(val))
    
    const targetMean = targetValues.reduce((a, b) => a + b, 0) / targetValues.length
    
    inputVariables.forEach(variable => {
      const inputValues = data.data
        .map(row => row[variable])
        .filter(val => val !== null && val !== undefined && !isNaN(val))
      
      if (inputValues.length === 0) {
        coef[variable] = 1
        return
      }
      
      const inputMean = inputValues.reduce((a, b) => a + b, 0) / inputValues.length
      
      // Calculate correlation-based coefficient
      let numerator = 0
      let denominator = 0
      
      for (let i = 0; i < Math.min(data.data.length, targetValues.length); i++) {
        const targetVal = data.data[i][targetVariable]
        const inputVal = data.data[i][variable]
        
        if (targetVal !== null && inputVal !== null && !isNaN(targetVal) && !isNaN(inputVal)) {
          numerator += (inputVal - inputMean) * (targetVal - targetMean)
          denominator += Math.pow(inputVal - inputMean, 2)
        }
      }
      
      coef[variable] = denominator !== 0 ? numerator / denominator : 1
    })
    
    setCoefficients(coef)
  }

  const toggleUncertainVariable = (variable) => {
    if (uncertainVariables.includes(variable)) {
      setUncertainVariables(uncertainVariables.filter(v => v !== variable))
    } else {
      setUncertainVariables([...uncertainVariables, variable])
    }
  }

  const updateDistribution = (variable, field, value) => {
    setDistributions({
      ...distributions,
      [variable]: {
        ...distributions[variable],
        [field]: field === 'type' ? value : distributions[variable][field],
        params: field === 'type' ? distributions[variable].params : {
          ...distributions[variable].params,
          [field]: parseFloat(value)
        }
      }
    })
  }

  const updateCoefficient = (variable, value) => {
    setCoefficients({
      ...coefficients,
      [variable]: parseFloat(value)
    })
  }

  const handleRunSimulation = async () => {
    setLoading(true)
    
    const config = {
      targetVariable,
      inputVariables,
      uncertainVariables,
      distributions,
      coefficients,
      modelType,
      numSimulations
    }
    
    onConfigured(config)
    
    try {
      const results = await runMonteCarloSimulation(data.data, config)
      onSimulate(results)
    } catch (error) {
      alert(`Simulation error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Model Configuration</h2>
        <p className="text-gray-600 mb-6">
          Configure your predictive model and define probability distributions for uncertain variables.
        </p>

        {/* Model Type Selection */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <label className="label text-gray-900">Model Type</label>
          <select
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
            className="input-field"
          >
            <option value="linear">Linear Model (Weighted Sum)</option>
            <option value="multiplicative">Multiplicative Model</option>
          </select>
          <p className="text-xs text-gray-600 mt-2">
            {modelType === 'linear' 
              ? `Formula: ${targetVariable} = ${inputVariables.map(v => `(${coefficients[v]?.toFixed(2) || 1} × ${v})`).join(' + ')}`
              : `Formula: ${targetVariable} = ${inputVariables.map(v => `${v}^${coefficients[v]?.toFixed(2) || 1}`).join(' × ')}`
            }
          </p>
        </div>

        {/* Coefficients */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Coefficients</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputVariables.map(variable => (
              <div key={variable} className="p-4 bg-gray-50 rounded-lg">
                <label className="label text-gray-900">{variable}</label>
                <input
                  type="number"
                  step="0.01"
                  value={coefficients[variable] || 1}
                  onChange={(e) => updateCoefficient(variable, e.target.value)}
                  className="input-field"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Uncertain Variables */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Uncertain Variables</h3>
          <p className="text-sm text-gray-600 mb-3">
            Select which variables should be treated as uncertain (simulated with probability distributions)
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {inputVariables.map(variable => (
              <label key={variable} className="flex items-center space-x-2 p-2 bg-white rounded border border-gray-200 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={uncertainVariables.includes(variable)}
                  onChange={() => toggleUncertainVariable(variable)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{variable}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Distribution Configuration */}
        {uncertainVariables.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Probability Distributions</h3>
            <div className="space-y-4">
              {uncertainVariables.map(variable => (
                <div key={variable} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">{variable}</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Distribution Type</label>
                      <select
                        value={distributions[variable]?.type || 'normal'}
                        onChange={(e) => updateDistribution(variable, 'type', e.target.value)}
                        className="input-field"
                      >
                        <option value="normal">Normal (Gaussian)</option>
                        <option value="uniform">Uniform</option>
                        <option value="triangular">Triangular</option>
                      </select>
                    </div>

                    {distributions[variable]?.type === 'normal' && (
                      <>
                        <div>
                          <label className="label">Mean</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.mean || 0}
                            onChange={(e) => updateDistribution(variable, 'mean', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label">Standard Deviation</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.std || 1}
                            onChange={(e) => updateDistribution(variable, 'std', e.target.value)}
                            className="input-field"
                          />
                        </div>
                      </>
                    )}

                    {distributions[variable]?.type === 'uniform' && (
                      <>
                        <div>
                          <label className="label">Minimum</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.min || 0}
                            onChange={(e) => updateDistribution(variable, 'min', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label">Maximum</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.max || 1}
                            onChange={(e) => updateDistribution(variable, 'max', e.target.value)}
                            className="input-field"
                          />
                        </div>
                      </>
                    )}

                    {distributions[variable]?.type === 'triangular' && (
                      <>
                        <div>
                          <label className="label">Minimum</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.min || 0}
                            onChange={(e) => updateDistribution(variable, 'min', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label">Mode (Most Likely)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.mean || 0.5}
                            onChange={(e) => updateDistribution(variable, 'mean', e.target.value)}
                            className="input-field"
                          />
                        </div>
                        <div>
                          <label className="label">Maximum</label>
                          <input
                            type="number"
                            step="0.01"
                            value={distributions[variable]?.params?.max || 1}
                            onChange={(e) => updateDistribution(variable, 'max', e.target.value)}
                            className="input-field"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-800">
                    <strong>Suggested:</strong> {distributions[variable]?.type} distribution based on historical data
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simulation Parameters */}
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Simulation Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label text-gray-900">Number of Simulations</label>
              <input
                type="number"
                min="1000"
                step="1000"
                value={numSimulations}
                onChange={(e) => setNumSimulations(parseInt(e.target.value))}
                className="input-field"
              />
              <p className="text-xs text-gray-600 mt-1">Minimum: 10,000 recommended for accuracy</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button onClick={onBack} className="btn-secondary flex items-center space-x-2">
            <ChevronLeft className="h-4 w-4" />
            <span>Back</span>
          </button>
          <button 
            onClick={handleRunSimulation}
            disabled={loading || uncertainVariables.length === 0 || numSimulations < 1000}
            className="btn-primary flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Running Simulation...</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Run Monte Carlo Simulation</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModelConfiguration
