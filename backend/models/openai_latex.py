import os
import sys
import base64
from pathlib import Path
from pdf2image import convert_from_path
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def pdf_to_images(pdf_path, output_dir="temp_images"):
    """Convert PDF pages to images"""
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Converting '{pdf_path}' to images...")
    pages = convert_from_path(pdf_path)
    
    image_paths = []
    for i, page in enumerate(pages):
        img_path = os.path.join(output_dir, f"page_{i+1}.png")
        page.save(img_path, "PNG")
        image_paths.append(img_path)
    
    print(f"Saved {len(image_paths)} images to {output_dir}/")
    return image_paths

def encode_image_to_base64(image_path):
    """Convert image to base64 string for OpenAI API"""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def improve_entire_latex_document(latex_content, total_pages):
    """Second pass: Improve formatting for the entire LaTeX document"""
    
    prompt = f"""
    You are an expert LaTeX formatter. Please review and improve the following LaTeX document that was generated from {total_pages} pages of a mathematical document.
    
    The code was generated from mathematical document images. Please:
    
    1. Fix any syntax errors or malformed LaTeX commands
    2. Improve spacing and alignment throughout the document
    3. Ensure proper use of mathematical environments (equation, align, array, etc.)
    4. Fix any broken or incomplete mathematical expressions
    5. Ensure proper nesting of brackets and parentheses
    6. Add appropriate line breaks and spacing for readability
    7. Fix any missing or incorrect mathematical symbols
    8. Ensure consistent formatting throughout the entire document
    9. Maintain the page-by-page structure with clear page separators
    10. Optimize the overall document flow and presentation
    
    Original LaTeX document:
    {latex_content}
    
    Please return only the improved LaTeX document, no explanations:
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt}
                    ],
                }
            ],
            max_tokens=4000,
            temperature=0.1
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error improving document formatting: {e}")
        return latex_content  # Return original if improvement fails

def generate_latex_from_image(image_path, page_num):
    """Generate LaTeX code from a single image using OpenAI GPT-4o"""
    
    # Encode image to base64
    base64_image = encode_image_to_base64(image_path)
    data_url = f"data:image/png;base64,{base64_image}"
    
    # Create the prompt
    prompt = f"""
    You are an expert at converting mathematical equations and expressions from images to LaTeX code.
    
    Please analyze the image on page {page_num} and convert all mathematical content to clean, properly formatted LaTeX code.
    
    Requirements:
    1. Convert all mathematical expressions, equations, formulas, and symbols to LaTeX
    2. Use appropriate LaTeX environments (equation, align, array, etc.)
    3. Ensure proper mathematical notation and symbols
    4. Maintain the structure and layout of the original content
    5. Only return the LaTeX code, no explanations or additional text
    6. If there are multiple equations, separate them appropriately
    
    Return only the LaTeX code:
    """
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": data_url}},
                    ],
                }
            ],
            max_tokens=2000,
            temperature=0.1
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error processing page {page_num}: {e}")
        return f"% Error processing page {page_num}: {e}"

def process_pdf_to_latex(pdf_path, output_dir="outputs_test", save_both_versions=False):
    """Process entire PDF and generate LaTeX output with two-pass improvement"""
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Convert PDF to images
    temp_dir = "temp_images"
    image_paths = pdf_to_images(pdf_path, temp_dir)
    
    print("\n=== PASS 1: Generating LaTeX from images ===")
    
    # Initialize LaTeX document
    latex_content = []
    latex_content.append(f"% LaTeX output generated from {pdf_path}")
    latex_content.append(f"% Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    latex_content.append(f"% Total pages: {len(image_paths)}")
    latex_content.append("")
    latex_content.append("\\documentclass{article}")
    latex_content.append("\\usepackage{amsmath}")
    latex_content.append("\\usepackage{amssymb}")
    latex_content.append("\\usepackage{graphicx}")
    latex_content.append("\\begin{document}")
    latex_content.append("")
    
    # Process each page - generate initial LaTeX
    for i, image_path in enumerate(image_paths):
        page_num = i + 1
        print(f"Processing page {page_num}/{len(image_paths)}...")
        
        initial_latex = generate_latex_from_image(image_path, page_num)
        
        latex_content.append(f"% Page {page_num}")
        latex_content.append(initial_latex)
        latex_content.append("")
    
    # Close the LaTeX document
    latex_content.append("\\end{document}")
    
    # Save initial version if requested
    if save_both_versions:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        initial_output_file = os.path.join(output_dir, f"openai_latex_initial_{timestamp}.tex")
        with open(initial_output_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(latex_content))
        print(f"✅ Initial LaTeX output saved to: {initial_output_file}")
    
    print("\n=== PASS 2: Improving document formatting ===")
    
    # Convert list to string for the improvement pass
    initial_document = '\n'.join(latex_content)
    
    # Second pass: Improve the entire document
    print("Sending entire document for formatting improvement...")
    improved_document = improve_entire_latex_document(initial_document, len(image_paths))
    
    # Save improved version
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    improved_output_file = os.path.join(output_dir, f"openai_latex_improved_{timestamp}.tex")
    
    with open(improved_output_file, 'w', encoding='utf-8') as f:
        f.write(improved_document)
    
    print(f"\n✅ Improved LaTeX output saved to: {improved_output_file}")
    
    # Clean up temporary images
    import shutil
    shutil.rmtree(temp_dir, ignore_errors=True)
    print("Temporary images removed.")
    
    return improved_output_file

if __name__ == "__main__":
    # Default PDF file
    pdf_file = "Hw 2.pdf"
    
    # Check if PDF exists
    if not os.path.exists(pdf_file):
        print(f"PDF file '{pdf_file}' not found.")
        sys.exit(1)
    
    # Check if OpenAI API key is set
    if not os.getenv('OPENAI_API_KEY'):
        print("Error: OPENAI_API_KEY not found in environment variables.")
        print("Please set your OpenAI API key in the .env file.")
        sys.exit(1)
    
    print("🚀 Starting two-pass LaTeX generation...")
    print("Pass 1: Convert PDF images to LaTeX")
    print("Pass 2: Improve formatting and fix issues")
    
    # Process the PDF with two-pass improvement
    # Set save_both_versions=True to save both initial and improved versions
    output_file = process_pdf_to_latex(pdf_file, save_both_versions=False)
    print(f"\n🎉 Processing complete! Improved LaTeX saved to: {output_file}") 