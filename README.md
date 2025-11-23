# ML Health Claim Risk Predictor

ML Health Claim Risk Predictor is a web application with a survey powered by machine learning that allows users to predict their risk for health claims and estimated annual medical costs based on demographic, socioeconomic, and health related features.

## Features 🌟

- **Interactive Survey**: Users input demographics, health conditions, and socioeconomic features
- **Risk Prediction**: ML model predicts probability of filing a medical claim
- **Cost Estimation**: Provides an estimated annual healthcare expenditure
- **What If?**: Users can toggle features and adjust their age using a slider to see its impact on their risk prediction and cost estimation

## Tech Stack 💻

- **Frontend**: React.js
- **Backend**: Flask
- **Database**: Firebase
- **Machine Learning**: Python, Scikit-learn, Pandas, numpy
- **Styling**: CSS
- **Model Storage**: joblib
- **Package Manager**: npm, pip
- **Version Control**: Git

## Getting Started 🚀

### Prerequisites

- Python
- pip
- npm
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/Health-Claim-Risk-Prediction.git
```

2. Navigate to the backend directory
```bash
cd Health-Claim-Risk-Prediction/backend
```
3. Activate virtual environment
```bash
Scripts/activate
```
4. Install dependencies
```bash
pip install -r requirements.txt
```
5. Run the backend server
```bash
python server.py
```
6. Open new terminal and navigate to frontend directory
```bash
cd Health-Claim-Risk-Prediction/frontend
```
7. Install dependencies
```bash
npm install
```

8. Start the development server
```bash
npm run dev
```

The application will open in your default browser at `http://localhost:5173`

## Project Structure 📁

Health-Claim-Risk-Prediction/
├── backend/      
│   ├── server.py
│   ├── model.pkl
│   └── requirements.txt
│
├── frontend/      
│   ├── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│   └── App.jsx
│
├── notebook/       
│   └── ml_model.ipynb
│
└── README.md       
---


