import os
import sys
import base64
from pathlib import Path
from anthropic import Anthropic
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure Anthropic client
client = Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY'))

def generate_latex_from_pdf(pdf_path):
    """Generate LaTeX code from PDF using Anthropic Claude Sonnet 4"""
    
    try:
        # Load and base64-encode the PDF file
        with open(pdf_path, "rb") as f:
            pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")
        
        # Create the prompt text
        prompt_text = """
Please convert this mathematical document to clean, compilable LaTeX code.

CRITICAL REQUIREMENTS:
- Output ONLY the LaTeX code - no markdown code blocks, no ```latex tags, no explanations
- Start directly with \\documentclass{article}
- End directly with \\end{document}
- The output must be ready to compile as-is

FORMATTING STANDARDS:
- Use proper LaTeX document structure with amsmath, amssymb, amsfonts packages
- Use align environments for multi-line equations with proper alignment
- Use cases environment for piecewise functions
- Format fractions with \\frac{}{} 
- Use \\textbf{} for bold text like problem labels
- Use \\newpage for page breaks where appropriate
- Include proper spacing and indentation
- Use \\quad or \\qquad for spacing within equations where needed

MATHEMATICAL CONTENT:
- Convert all equations to proper LaTeX syntax
- Preserve all mathematical symbols and notation exactly
- Maintain the logical flow and structure of problems
- Use proper mathematical operators (\\cap, \\cup, \\neq, etc.)
- Format integrals, summations, and limits correctly
- Use proper subscripts and superscripts

DOCUMENT STRUCTURE:
- Use \\section* or \\subsection* for headers as appropriate
- Organize content clearly with proper problem numbering
- Maintain readability with appropriate line breaks
- Ensure all mathematical expressions are properly enclosed

The output should be publication-quality LaTeX that compiles without errors.
        """
        
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=8000,  # Increased for longer documents
            temperature=0,    # Set to 0 for more consistent formatting
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "document",
                            "source": {
                                "type": "base64",
                                "media_type": "application/pdf",
                                "data": pdf_data
                            }
                        },
                        {
                            "type": "text",
                            "text": prompt_text
                        }
                    ]
                }
            ]
        )
        
        # Clean up the response to remove any markdown artifacts
        latex_content = response.content[0].text.strip()
        
        # Remove markdown code blocks if they appear
        if latex_content.startswith("```latex"):
            latex_content = latex_content[8:]  # Remove ```latex
        if latex_content.startswith("```"):
            latex_content = latex_content[3:]   # Remove ```
        if latex_content.endswith("```"):
            latex_content = latex_content[:-3]  # Remove trailing ```
            
        return latex_content.strip()
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        return f"% Error processing PDF: {e}"

def process_pdf_to_latex(pdf_path, output_dir="outputs_test"):
    """Process PDF and generate LaTeX output"""
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    print("\n=== Generating LaTeX from PDF ===")
    
    # Generate LaTeX from PDF
    print(f"Processing PDF: {pdf_path}")
    latex_content = generate_latex_from_pdf(pdf_path)
    
    # Add metadata header
    metadata_header = [
        f"% LaTeX output generated from {pdf_path}",
        f"% Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
        ""
    ]
    
    # Combine metadata with generated LaTeX
    final_document = '\n'.join(metadata_header) + '\n' + latex_content
    
    # Save the LaTeX document
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_file = os.path.join(output_dir, f"anthropic_latex_{timestamp}.tex")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(final_document)
    
    print(f"\n✅ LaTeX output saved to: {output_file}")
    
    return output_file, final_document

if __name__ == "__main__":
    # Default PDF file
    pdf_file = "Hw2.pdf"
    
    # Check if PDF exists
    if not os.path.exists(pdf_file):
        print(f"PDF file '{pdf_file}' not found.")
        sys.exit(1)
    
    # Check if Anthropic API key is set
    if not os.getenv('ANTHROPIC_API_KEY'):
        print("Error: ANTHROPIC_API_KEY not found in environment variables.")
        print("Please set your Anthropic API key in the .env file.")
        sys.exit(1)
    
    print("🚀 Starting LaTeX generation with Anthropic Claude Sonnet 4...")
    
    # Process the PDF
    output_file, final_document = process_pdf_to_latex(pdf_file)
    print(f"\n🎉 Processing complete! LaTeX saved to: {output_file}")