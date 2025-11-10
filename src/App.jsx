import React, { useState } from 'react'
import { BarChart3, Upload, Settings, Play, TrendingUp } from 'lucide-react'
import DataUpload from './components/DataUpload'
import DataPreprocessing from './components/DataPreprocessing'
import ExploratoryAnalysis from './components/ExploratoryAnalysis'
import ModelConfiguration from './components/ModelConfiguration'
import SimulationResults from './components/SimulationResults'

function App() {
  const [currentPhase, setCurrentPhase] = useState(0)
  const [data, setData] = useState(null)
  const [processedData, setProcessedData] = useState(null)
  const [selectedColumns, setSelectedColumns] = useState([])
  const [targetVariable, setTargetVariable] = useState('')
  const [inputVariables, setInputVariables] = useState([])
  const [modelConfig, setModelConfig] = useState(null)
  const [simulationResults, setSimulationResults] = useState(null)
  const [businessContext, setBusinessContext] = useState({
    problemStatement: '',
    decisionSupported: '',
    stakeholders: ''
  })

  const phases = [
    { id: 0, name: 'Upload Data', icon: Upload },
    { id: 1, name: 'Preprocess', icon: Settings },
    { id: 2, name: 'Explore', icon: BarChart3 },
    { id: 3, name: 'Configure Model', icon: Settings },
    { id: 4, name: 'Results', icon: TrendingUp }
  ]

  const handleDataUpload = (uploadedData) => {
    setData(uploadedData)
    setProcessedData(uploadedData)
    setCurrentPhase(1)
  }

  const handlePreprocessingComplete = (cleaned) => {
    setProcessedData(cleaned)
    setCurrentPhase(2)
  }

  const handleEDAComplete = (target, inputs, selected) => {
    setTargetVariable(target)
    setInputVariables(inputs)
    setSelectedColumns(selected)
    setCurrentPhase(3)
  }

  const handleModelConfigured = (config) => {
    setModelConfig(config)
  }

  const handleSimulationComplete = (results) => {
    setSimulationResults(results)
    setCurrentPhase(4)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Monte Carlo Analysis Portal</h1>
            </div>
            <div className="text-sm text-gray-600">
              Decision Support System
            </div>
          </div>
        </div>
      </header>

      {/* Business Context Section */}
      {currentPhase > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="card bg-primary-50 border-primary-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Context</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="label text-gray-700">Problem Statement</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={businessContext.problemStatement}
                  onChange={(e) => setBusinessContext({...businessContext, problemStatement: e.target.value})}
                  placeholder="What problem are we solving?"
                />
              </div>
              <div>
                <label className="label text-gray-700">Decision Supported</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={businessContext.decisionSupported}
                  onChange={(e) => setBusinessContext({...businessContext, decisionSupported: e.target.value})}
                  placeholder="What decision does this support?"
                />
              </div>
              <div>
                <label className="label text-gray-700">Stakeholders</label>
                <input
                  type="text"
                  className="input-field text-sm"
                  value={businessContext.stakeholders}
                  onChange={(e) => setBusinessContext({...businessContext, stakeholders: e.target.value})}
                  placeholder="Who are the stakeholders?"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {phases.map((phase, index) => {
            const Icon = phase.icon
            const isActive = currentPhase === phase.id
            const isCompleted = currentPhase > phase.id
            
            return (
              <React.Fragment key={phase.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-lg scale-110'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary-600' : 'text-gray-600'}`}>
                    {phase.name}
                  </span>
                </div>
                {index < phases.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentPhase === 0 && (
          <DataUpload onDataUpload={handleDataUpload} />
        )}
        
        {currentPhase === 1 && (
          <DataPreprocessing
            data={data}
            onComplete={handlePreprocessingComplete}
            onBack={() => setCurrentPhase(0)}
          />
        )}
        
        {currentPhase === 2 && (
          <ExploratoryAnalysis
            data={processedData}
            onComplete={handleEDAComplete}
            onBack={() => setCurrentPhase(1)}
          />
        )}
        
        {currentPhase === 3 && (
          <ModelConfiguration
            data={processedData}
            targetVariable={targetVariable}
            inputVariables={inputVariables}
            onConfigured={handleModelConfigured}
            onSimulate={handleSimulationComplete}
            onBack={() => setCurrentPhase(2)}
          />
        )}
        
        {currentPhase === 4 && simulationResults && (
          <SimulationResults
            results={simulationResults}
            modelConfig={modelConfig}
            businessContext={businessContext}
            onBack={() => setCurrentPhase(3)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-600">
            Monte Carlo Analysis Portal - Professional Decision Support System
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
