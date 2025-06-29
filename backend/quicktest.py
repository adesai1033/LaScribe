import os
import sys
from pdf2image import convert_from_path
from PIL import Image
from pix2tex.cli import LatexOCR
from datetime import datetime

PDF_FILE = 'Hw 2.pdf'
IMG_PREFIX = 'page_'
IMG_FORMAT = 'png'
OUTPUT_DIR = 'outputs_test'
OUTPUT_FILE = f'latex_output_{datetime.now().strftime("%Y%m%d_%H%M%S")}.tex'

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Check for PDF file
if not os.path.exists(PDF_FILE):
    print(f"PDF file '{PDF_FILE}' not found.")
    sys.exit(1)

# Convert PDF to images
print(f"Converting '{PDF_FILE}' to images...")
try:
    pages = convert_from_path(PDF_FILE)
except Exception as e:
    print(f"Error converting PDF: {e}")
    print("If you see a poppler error, install it with: brew install poppler")
    sys.exit(1)

image_files = []
for i, page in enumerate(pages):
    img_path = f"{IMG_PREFIX}{i+1}.{IMG_FORMAT}"
    page.save(img_path, IMG_FORMAT.upper())
    image_files.append(img_path)

print(f"Saved {len(image_files)} image(s). Running OCR...")

# Initialize LaTeX output
latex_content = []
latex_content.append(f"% LaTeX output generated from {PDF_FILE}")
latex_content.append(f"% Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
latex_content.append(f"% Total pages: {len(image_files)}")
latex_content.append("")
latex_content.append("\\documentclass{article}")
latex_content.append("\\usepackage{amsmath}")
latex_content.append("\\usepackage{amssymb}")
latex_content.append("\\usepackage{graphicx}")
latex_content.append("\\begin{document}")
latex_content.append("")

model = LatexOCR()
for i, img_path in enumerate(image_files):
    print(f"\n--- OCR for {img_path} ---")
    try:
        img = Image.open(img_path)
        latex = model(img)
        print(f"Page {i+1}: {latex}")
        
        # Add page separator and LaTeX content
        latex_content.append(f"% Page {i+1}")
        latex_content.append(f"{latex}")
        latex_content.append("")
        
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        latex_content.append(f"% Page {i+1} - ERROR: {e}")
        latex_content.append("")

# Close the LaTeX document
latex_content.append("\\end{document}")

# Save to file
output_path = os.path.join(OUTPUT_DIR, OUTPUT_FILE)
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(latex_content))

print(f"\n✅ LaTeX output saved to: {output_path}")

# Clean up image files
def cleanup():
    for img_path in image_files:
        try:
            os.remove(img_path)
        except Exception:
            pass
    print("Temporary images removed.")

cleanup()