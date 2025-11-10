# Master Prompt: Monte Carlo Analysis Portal Development

This document serves as the comprehensive specification for an agentic coder to develop a **Monte Carlo Analysis Portal**. The goal is to create a full-stack web application that allows users to upload a dataset, perform exploratory data analysis (EDA), define a predictive model, run a Monte Carlo simulation, and visualize the results to support a business decision.

The final application will be a single-page application (SPA) or a multi-page application (MPA) deployed on **Netlify** and managed via **GitHub**.

## 1. Project Goal

Develop a professional, interactive, and mobile-responsive web application that implements a Monte Carlo simulation for a user-defined business problem, providing clear decision support and actionable insights based on the simulation's output.

## 2. Technology Stack

The agentic coder should select a modern, lightweight, and Netlify-compatible stack. **Python** is required for the core data analysis and Monte Carlo simulation logic.

| Component | Recommended Technology | Notes |
| :--- | :--- | :--- |
| **Frontend** | React, Vue, or Svelte (or a lightweight framework like Streamlit/Panel if a Python-only approach is preferred) | Must be easily deployable as a static site on Netlify. |
| **Backend/Analysis** | Python (Pandas, NumPy, SciPy, Scikit-learn) | Required for data processing, distribution fitting, and the Monte Carlo engine. |
| **Visualization** | Plotly.js, Chart.js, or a Python-based library with interactive export (e.g., Plotly Dash, Altair) | Charts must be interactive and clearly display statistical results. |
| **Deployment** | GitHub for source control, Netlify for hosting. | The build process must be configured for Netlify's continuous deployment. |

## 3. Application Features and Workflow

The application must guide the user through the following high-level workflow:

### Phase 1: Data Upload and Exploration (Input)

1.  **Data Upload:** A clear interface to upload a dataset (CSV or Excel format).

2.  **Data Cleaning & Pre-processing (User-Guided):**
    *   **Missing Value Handling:** Display a table showing the count and percentage of missing values per column. Provide user options for handling missing values in selected columns:
        *   Drop rows with missing values.
        *   Impute with Mean/Median (for numerical data).
        *   Impute with Mode (for categorical data).
        *   Impute with a constant value (user-defined).
    *   **Data Type Conversion:** Allow the user to manually override inferred data types (e.g., converting an integer column to a categorical factor, or a string column to a datetime object).
    *   **Outlier Detection & Handling:** For numerical columns, display box plots and allow the user to select a method for handling extreme outliers (e.g., capping at the 5th and 95th percentiles, or flagging for exclusion).
    *   **Feature Selection:** Allow the user to explicitly select or deselect columns to be included in the subsequent analysis phases.

3.  **Exploratory Data Analysis (EDA):**
    *   **Data Summary:** Display the first 5 rows, column names, data types, and a statistical summary (`describe()`) for all numerical columns.
    *   **Univariate Analysis:**
        *   **Numerical:** Interactive Histograms and Box Plots for all numerical columns.
        *   **Categorical:** Interactive Bar Charts showing frequency counts for all categorical columns.
    *   **Bivariate Analysis:**
        *   **Correlation Matrix:** A heatmap visualization of the correlation matrix for all numerical variables.
        *   **Target Variable Relationship:** Visualizations (e.g., scatter plots, violin plots) showing the relationship between the selected **target variable** and the primary **input variables**.
    *   **Variable Selection:** The user must finalize the selection of the **target variable** and the **input variables** for the model, based on the EDA results.

### Phase 2: Model Definition and Customization (Configuration)

1.  **Problem Context:** A dedicated section to input and display the **Business Context** (Problem Statement, Decision Supported, Stakeholders). This should be a persistent element on the landing page.
2.  **Model Equation Definition:**
    *   Allow the user to define the predictive equation/model (e.g., a simple linear equation or a selection from pre-defined models like linear regression).
    *   The user must be able to specify which input variables are **uncertain** (i.e., will be simulated).
3.  **Distribution Identification:**
    *   For each selected uncertain variable, the application must analyze the historical data and suggest the best-fit probability distribution (e.g., Normal, Uniform, Triangular, Beta).
    *   The user must have the option to **override** the suggested distribution and manually input parameters (e.g., mean, standard deviation, min/max).
4.  **Simulation Parameters:**
    *   Input field for the number of simulations (minimum 10,000).
    *   Input fields/sliders to adjust key parameters for re-running the simulation (e.g., a "growth rate" or "worst-case scenario" multiplier).

### Phase 3: Monte Carlo Simulation and Analysis (Processing)

1.  **Simulation Engine:** A robust Python-based engine that:
    *   Runs the specified number of iterations.
    *   Samples random values for the uncertain variables based on their defined distributions.
    *   Calculates the outcome (target variable) for each iteration using the defined model equation.
2.  **Statistical Analysis:** Automatically calculate and display:
    *   Mean, Median, and Standard Deviation of the simulation outcomes.
    *   Confidence Intervals (e.g., 90%, 50%).
    *   Probability of key outcomes (e.g., probability of exceeding a user-defined target threshold).
    *   Risk Metrics (e.g., Value at Risk - VaR, Best/Worst Case percentiles).

### Phase 4: Visualization and Decision Support (Output)

1.  **Interactive Visualizations (Minimum 3):**
    *   **Distribution Histogram:** A histogram of the simulation outcomes, clearly marking the mean, median, and user-specified percentiles (e.g., 5th, 50th, 95th).
    *   **Cumulative Probability Curve (CDF):** A curve showing the probability of the outcome being less than or equal to a given value.
    *   **Statistical Summary Dashboard:** A clean display of key metrics (mean, confidence intervals, probability gauges).
2.  **Interactive Elements:** The user must be able to:
    *   Adjust input parameters (e.g., via sliders) and **re-run the simulation** instantly.
    *   Toggle between different visualization types.
    *   Input a custom target/threshold to calculate the probability of meeting or exceeding it.
3.  **Decision Guidance:** A dedicated section providing:
    *   A clear, concise **recommendation** based on the results (e.g., "The optimal reorder point is between X and Y units to maintain a 95% service level").
    *   An explanation of the key metrics and their meaning.
    *   A Risk Level Indicator (Low/Medium/High) based on the spread of the results (Standard Deviation).

## 4. Design and Deployment Requirements

1.  **Professional Design:** The application must have a clean, intuitive, and professional user interface.
2.  **Responsiveness:** The layout must be fully mobile-responsive.
3.  **Deployment:**
    *   The entire project must be structured for easy deployment via **Netlify**.
    *   The agent must ensure all necessary build scripts and configuration files (e.g., `netlify.toml` if needed) are correctly set up.
    *   The final codebase must be ready for a single push to a **GitHub repository**.

## 5. Deliverables

The agentic coder's final output must be a complete, functional codebase, including:

1.  All source code for the frontend and backend/analysis logic.
2.  A clear `README.md` file with:
    *   Project description and goal.
    *   Instructions on how to run the application locally.
    *   Instructions for deployment on Netlify.
3.  A sample dataset for demonstration purposes.
4.  All necessary configuration files (e.g., `package.json`, `requirements.txt`, `netlify.toml`).

**Crucially, the agent must prioritize modularity and clean separation of concerns, ensuring the core Monte Carlo simulation logic is distinct from the UI/presentation layer.**
