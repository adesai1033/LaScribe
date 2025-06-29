# LaTeXify - PDF to LaTeX Converter

A fullstack web application that converts handwritten PDF documents to clean LaTeX code using Anthropic's Claude Sonnet 4 AI model.

## Features

- 📄 **PDF Upload**: Drag and drop or browse to upload PDF files
- 🤖 **AI-Powered Conversion**: Uses Anthropic Claude Sonnet 4 for accurate mathematical text recognition
- ⚡ **Real-time Processing**: Fast conversion with live progress updates
- 📊 **Mathematical Support**: Excellent handling of equations, formulas, and mathematical notation
- 🎨 **Modern UI**: Beautiful, responsive interface with split-screen PDF and LaTeX viewing
- 🔒 **Secure**: Files are processed securely and not stored permanently

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Anthropic API key

## Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd latexify
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp env.example .env  # Create .env file
```

Edit the `.env` file and add your Anthropic API key:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## Running the Application

### Option 1: Using the startup script (Recommended)
```bash
# Make the script executable (Unix/Mac)
chmod +x start_dev.sh

# Run both servers
./start_dev.sh
```

### Option 2: Manual startup

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Usage

1. **Upload PDF**: Drag and drop a PDF file or click "Browse Files" to select one
2. **Processing**: The AI will analyze your document and convert it to LaTeX
3. **View Results**: See your original PDF on the left and the generated LaTeX code on the right
4. **Edit**: Modify the LaTeX code directly in the editor if needed
5. **Download**: Copy the LaTeX code for use in your documents

## API Endpoints

- `POST /api/upload-pdf` - Upload and convert PDF to LaTeX
- `GET /api/health` - Health check endpoint

## Project Structure

```
latexify/
├── backend/
│   ├── app.py                 # Flask server
│   ├── models/
│   │   └── anthropic_latex.py # Anthropic LaTeX conversion
│   ├── requirements.txt       # Python dependencies
│   └── uploads/              # Temporary upload directory
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/           # Page components
│   │   └── App.tsx          # Main app component
│   ├── package.json         # Node.js dependencies
│   └── vite.config.ts       # Vite configuration
├── start_dev.sh             # Development startup script
└── README.md               # This file
```

## Technologies Used

### Backend
- **Flask**: Web framework
- **Anthropic Claude**: AI model for PDF to LaTeX conversion
- **Flask-CORS**: Cross-origin resource sharing
- **Werkzeug**: File handling utilities

### Frontend
- **React 19**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations

## Troubleshooting

### Common Issues

1. **"Network error" message**
   - Ensure the backend server is running on port 5000
   - Check that CORS is properly configured

2. **"ANTHROPIC_API_KEY not found"**
   - Verify your `.env` file exists in the backend directory
   - Ensure your API key is correctly set

3. **PDF upload fails**
   - Check file size (max 16MB)
   - Ensure file is a valid PDF
   - Verify file permissions

4. **Port already in use**
   - Change the port in `backend/app.py` or kill the process using the port

### Getting Help

If you encounter issues:
1. Check the browser console for frontend errors
2. Check the terminal running the backend for server errors
3. Verify all dependencies are installed correctly
4. Ensure your Anthropic API key is valid and has sufficient credits

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License. 