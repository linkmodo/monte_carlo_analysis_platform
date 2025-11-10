// Monte Carlo Simulation Engine

// Random number generators for different distributions
const randomGenerators = {
  normal: (mean, std) => {
    // Box-Muller transform for normal distribution
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + std * z0
  },

  uniform: (min, max) => {
    return min + Math.random() * (max - min)
  },

  triangular: (min, mode, max) => {
    const u = Math.random()
    const f = (mode - min) / (max - min)
    
    if (u < f) {
      return min + Math.sqrt(u * (max - min) * (mode - min))
    } else {
      return max - Math.sqrt((1 - u) * (max - min) * (max - mode))
    }
  }
}

// Generate random value based on distribution configuration
const generateRandomValue = (distribution) => {
  const { type, params } = distribution

  switch (type) {
    case 'normal':
      return randomGenerators.normal(params.mean, params.std)
    
    case 'uniform':
      return randomGenerators.uniform(params.min, params.max)
    
    case 'triangular':
      return randomGenerators.triangular(params.min, params.mean, params.max)
    
    default:
      return params.mean || 0
  }
}

// Calculate outcome based on model type
const calculateOutcome = (inputs, coefficients, modelType) => {
  if (modelType === 'linear') {
    // Linear model: sum of (coefficient * input)
    return Object.entries(inputs).reduce((sum, [variable, value]) => {
      return sum + (coefficients[variable] || 1) * value
    }, 0)
  } else if (modelType === 'multiplicative') {
    // Multiplicative model: product of (input ^ coefficient)
    return Object.entries(inputs).reduce((product, [variable, value]) => {
      return product * Math.pow(value, coefficients[variable] || 1)
    }, 1)
  }
  
  return 0
}

// Calculate statistics from outcomes
const calculateStatistics = (outcomes) => {
  const sorted = [...outcomes].sort((a, b) => a - b)
  const n = sorted.length
  
  const mean = outcomes.reduce((a, b) => a + b, 0) / n
  const variance = outcomes.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n
  const std = Math.sqrt(variance)
  
  const getPercentile = (p) => {
    const index = Math.floor(n * p)
    return sorted[Math.min(index, n - 1)]
  }
  
  return {
    mean,
    median: getPercentile(0.5),
    std,
    min: sorted[0],
    max: sorted[n - 1],
    percentiles: {
      p5: getPercentile(0.05),
      p10: getPercentile(0.10),
      p25: getPercentile(0.25),
      p50: getPercentile(0.50),
      p75: getPercentile(0.75),
      p90: getPercentile(0.90),
      p95: getPercentile(0.95)
    },
    confidenceIntervals: {
      ci90: {
        lower: getPercentile(0.05),
        upper: getPercentile(0.95)
      },
      ci50: {
        lower: getPercentile(0.25),
        upper: getPercentile(0.75)
      }
    }
  }
}

// Main Monte Carlo simulation function
export const runMonteCarloSimulation = async (historicalData, config) => {
  return new Promise((resolve, reject) => {
    try {
      const {
        inputVariables,
        uncertainVariables,
        distributions,
        coefficients,
        modelType,
        numSimulations
      } = config

      const outcomes = []
      
      // Get baseline values for non-uncertain variables from historical data
      const baselineValues = {}
      inputVariables.forEach(variable => {
        if (!uncertainVariables.includes(variable)) {
          // Use mean of historical data for non-uncertain variables
          const values = historicalData
            .map(row => row[variable])
            .filter(val => val !== null && val !== undefined && !isNaN(val))
          
          if (values.length > 0) {
            baselineValues[variable] = values.reduce((a, b) => a + b, 0) / values.length
          } else {
            baselineValues[variable] = 0
          }
        }
      })

      // Run simulations
      for (let i = 0; i < numSimulations; i++) {
        const inputs = { ...baselineValues }
        
        // Generate random values for uncertain variables
        uncertainVariables.forEach(variable => {
          if (distributions[variable]) {
            inputs[variable] = generateRandomValue(distributions[variable])
          }
        })
        
        // Calculate outcome
        const outcome = calculateOutcome(inputs, coefficients, modelType)
        outcomes.push(outcome)
      }

      // Calculate statistics
      const statistics = calculateStatistics(outcomes)

      // Return results
      resolve({
        outcomes,
        statistics,
        config
      })
    } catch (error) {
      reject(error)
    }
  })
}

// Calculate Value at Risk (VaR)
export const calculateVaR = (outcomes, confidenceLevel = 0.95) => {
  const sorted = [...outcomes].sort((a, b) => a - b)
  const index = Math.floor(sorted.length * (1 - confidenceLevel))
  return sorted[index]
}

// Calculate Conditional Value at Risk (CVaR)
export const calculateCVaR = (outcomes, confidenceLevel = 0.95) => {
  const sorted = [...outcomes].sort((a, b) => a - b)
  const cutoffIndex = Math.floor(sorted.length * (1 - confidenceLevel))
  const tailValues = sorted.slice(0, cutoffIndex)
  return tailValues.reduce((a, b) => a + b, 0) / tailValues.length
}

// Calculate probability of exceeding threshold
export const calculateExceedanceProbability = (outcomes, threshold) => {
  const exceedCount = outcomes.filter(val => val >= threshold).length
  return (exceedCount / outcomes.length) * 100
}

export default {
  runMonteCarloSimulation,
  calculateVaR,
  calculateCVaR,
  calculateExceedanceProbability
}
