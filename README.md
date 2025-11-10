# Monte Carlo Analysis Portal

A professional, interactive web application for performing Monte Carlo simulations to support business decision-making. Built with React and modern web technologies, this portal guides users through data upload, exploratory analysis, model configuration, and simulation results visualization.

## 🎯 Project Goal

Develop a comprehensive decision support system that implements Monte Carlo simulation for user-defined business problems, providing clear insights and actionable recommendations based on probabilistic analysis.

## ✨ Features

### Phase 1: Data Upload and Exploration
- **Easy Data Upload**: Drag-and-drop or click to upload CSV/Excel files
- **Large Dataset Support**: Handles datasets up to 100,000+ rows with automatic optimization
- **Sample Dataset**: Built-in sample sales data for demonstration
- **Data Preview**: View first rows and column information

### Phase 2: Data Preprocessing
- **Missing Value Analysis**: Automatic detection with count and percentage
- **Flexible Imputation**: Multiple methods (mean, median, mode, drop rows)
- **Data Type Management**: Override inferred types (numeric, categorical, datetime)
- **Column Selection**: Choose relevant features for analysis

### Phase 3: Exploratory Data Analysis (EDA)
- **Statistical Summary**: Comprehensive descriptive statistics
- **Correlation Matrix**: Interactive heatmap visualization
- **Distribution Analysis**: Histograms and box plots for all numeric variables
- **Categorical Analysis**: Bar charts for categorical variables
- **Variable Selection**: Choose target and input variables for modeling

### Phase 4: Model Configuration
- **Model Types**: Linear (weighted sum) or multiplicative models
- **Distribution Fitting**: Automatic suggestion of probability distributions
- **Custom Distributions**: Normal, Uniform, and Triangular distributions
- **Coefficient Estimation**: Automatic estimation with manual override
- **Simulation Parameters**: Configurable number of iterations (min 10,000)

### Phase 5: Results and Decision Support
- **Interactive Visualizations**:
  - Distribution histogram with mean/median markers
  - Cumulative Distribution Function (CDF)
  - Box plot with statistical summary
- **Statistical Metrics**: Mean, median, std dev, percentiles, confidence intervals
- **Risk Assessment**: Automatic risk level calculation (Low/Medium/High)
- **Decision Guidance**: Clear recommendations based on simulation results
- **Threshold Calculator**: Calculate probability of meeting specific targets
- **Export Results**: Download simulation results as JSON

## 🛠️ Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: TailwindCSS with custom components
- **Visualizations**: Plotly.js for interactive charts
- **Data Processing**: PapaParse (CSV), XLSX (Excel)
- **Icons**: Lucide React
- **Deployment**: Netlify (static site hosting)
- **Version Control**: Git/GitHub

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git (for version control)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "Monte Carlo Analysis Portal"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 🌐 Deployment on Netlify

### Method 1: Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize and deploy**
   ```bash
   netlify init
   netlify deploy --prod
   ```

### Method 2: GitHub Integration (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

3. **Automatic Deployments**
   - Every push to `main` branch triggers automatic deployment
   - Pull requests create deploy previews

### Method 3: Manual Deploy

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy via Netlify Drop**
   - Go to [Netlify Drop](https://app.netlify.com/drop)
   - Drag and drop the `dist` folder

## 📊 Using the Application

### 1. Upload Data
- Click "Choose File" or drag-and-drop a CSV/Excel file
- Or use the "Load Sample Sales Data" button to try the demo

### 2. Preprocess Data
- Review missing values and choose imputation methods
- Adjust data types if needed
- Select columns to include in analysis

### 3. Explore Data
- Review statistical summaries and visualizations
- Examine correlations between variables
- Select target variable (what you're predicting)
- Choose input variables (factors that influence the target)

### 4. Configure Model
- Review and adjust model coefficients
- Select which variables are uncertain (to be simulated)
- Configure probability distributions for uncertain variables
- Set number of simulations (minimum 10,000)

### 5. Run Simulation
- Click "Run Monte Carlo Simulation"
- Wait for processing (typically 1-3 seconds)
- Review results and recommendations

### 6. Analyze Results
- Examine distribution of outcomes
- Review confidence intervals and percentiles
- Check risk level assessment
- Use threshold calculator for specific targets
- Export results for further analysis

## 📁 Project Structure

```
Monte Carlo Analysis Portal/
├── src/
│   ├── components/
│   │   ├── DataUpload.jsx
│   │   ├── DataPreprocessing.jsx
│   │   ├── ExploratoryAnalysis.jsx
│   │   ├── ModelConfiguration.jsx
│   │   └── SimulationResults.jsx
│   ├── utils/
│   │   └── monteCarloEngine.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── netlify.toml
└── README.md
```

## 🔧 Configuration Files

- **package.json**: Dependencies and scripts
- **vite.config.js**: Vite build configuration
- **tailwind.config.js**: TailwindCSS customization
- **netlify.toml**: Netlify deployment settings
- **postcss.config.js**: PostCSS plugins

## 🎨 Customization

### Changing Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Adding New Distribution Types
Edit `src/utils/monteCarloEngine.js` and add to `randomGenerators` object.

### Modifying Model Types
Edit `src/components/ModelConfiguration.jsx` to add new model equations.

## 📈 Sample Dataset

The application includes a sample sales dataset with the following columns:
- **Month**: Month name
- **Sales**: Monthly sales figures
- **Marketing**: Marketing spend
- **Season**: Seasonal category
- **Region**: Geographic region

This dataset demonstrates:
- Numeric variables (Sales, Marketing)
- Categorical variables (Season, Region)
- Time-series patterns
- Correlation between variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Build Errors
- Ensure Node.js version is 16 or higher
- Delete `node_modules` and `package-lock.json`, then run `npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Deployment Issues
- Verify `netlify.toml` is in the root directory
- Check build command and publish directory settings
- Review Netlify build logs for specific errors

### Data Upload Issues
- Ensure CSV files have headers in the first row
- Check that Excel files are in .xlsx or .xls format
- Verify data contains at least one numeric column

### Large Dataset Issues
- For datasets > 100,000 rows, see [LARGE_DATASETS.md](LARGE_DATASETS.md)
- Application automatically samples data for performance
- "Maximum call stack size exceeded" error has been fixed
- Close other browser tabs to free memory

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review sample dataset usage

## 🎓 Learning Resources

- [Monte Carlo Simulation Basics](https://en.wikipedia.org/wiki/Monte_Carlo_method)
- [React Documentation](https://react.dev)
- [Plotly.js Documentation](https://plotly.com/javascript/)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [Netlify Documentation](https://docs.netlify.com)

---

**Built with ❤️ for data-driven decision making**
