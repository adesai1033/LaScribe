from flask import Flask, request, jsonify, send_from_directory, send_file
from flask_cors import CORS
import os
import tempfile
import subprocess
import io
from werkzeug.utils import secure_filename
from models.anthropic_latex import generate_latex_from_pdf
import base64

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='')
CORS(app)

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['OUTPUT_FOLDER'] = 'outputs'

# Ensure directories exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs(app.config['OUTPUT_FOLDER'], exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-pdf', methods=['POST'])
def upload_pdf():
    try:
        # Check if file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        # Check if file was selected
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Check if file type is allowed
        if not allowed_file(file.filename):
            return jsonify({'error': 'Only PDF files are allowed'}), 400
        
        # Save the uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Generate LaTeX from PDF using Anthropic
        print(f"Processing PDF: {filepath}")
        latex_content = generate_latex_from_pdf(filepath)
        
        # Clean up the uploaded file
        os.remove(filepath)
        
        return jsonify({
            'success': True,
            'latex': latex_content,
            'filename': filename
        })
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/compile-latex', methods=['POST'])
def compile_latex():
    """Compile LaTeX code to PDF using pdflatex"""
    try:
        data = request.get_json()
        if not data or 'latex' not in data:
            return jsonify({'error': 'No LaTeX code provided'}), 400
        
        latex_code = data['latex']
        print(f"Received LaTeX code length: {len(latex_code)}")
        print(f"First 500 characters: {latex_code[:500]}")
        
        # Create temporary directory for compilation
        with tempfile.TemporaryDirectory() as temp_dir:
            print(f"Using temp directory: {temp_dir}")
            
            # Create .tex file
            tex_file = os.path.join(temp_dir, 'document.tex')
            with open(tex_file, 'w', encoding='utf-8') as f:
                f.write(latex_code)
            
            print(f"Created .tex file: {tex_file}")
            
            # Compile with pdflatex
            try:
                print("Starting pdflatex compilation...")
                result = subprocess.run(
                    ['pdflatex', '-interaction=nonstopmode', '-output-directory', temp_dir, tex_file],
                    capture_output=True,
                    text=True,
                    timeout=30  # 30 second timeout
                )
                
                print(f"pdflatex return code: {result.returncode}")
                print(f"pdflatex stdout: {result.stdout}")
                print(f"pdflatex stderr: {result.stderr}")
                
                # Check if PDF was generated
                pdf_file = os.path.join(temp_dir, 'document.pdf')
                if os.path.exists(pdf_file):
                    print(f"PDF generated successfully: {pdf_file}")
                    # Read and return the PDF
                    with open(pdf_file, 'rb') as f:
                        pdf_data = f.read()
                    
                    return send_file(
                        io.BytesIO(pdf_data),
                        mimetype='application/pdf',
                        as_attachment=False
                    )
                else:
                    # Compilation failed - provide detailed error
                    error_msg = result.stderr if result.stderr else 'Unknown compilation error'
                    print(f"LaTeX compilation failed: {error_msg}")
                    return jsonify({'error': f'LaTeX compilation failed: {error_msg}'}), 500
                    
            except subprocess.TimeoutExpired:
                print("LaTeX compilation timed out")
                return jsonify({'error': 'Compilation timed out (30 seconds). Try with a simpler document.'}), 500
            except FileNotFoundError:
                print("pdflatex not found")
                return jsonify({'error': 'pdflatex not found. Please install LaTeX distribution.'}), 500
                
    except Exception as e:
        print(f"Error compiling LaTeX: {e}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'LaScribe API is running'})

# Serve frontend routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5001) 