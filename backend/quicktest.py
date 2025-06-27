import os
import sys
from pdf2image import convert_from_path
from PIL import Image
from pix2tex.cli import LatexOCR

PDF_FILE = 'Hw 2.pdf'
IMG_PREFIX = 'page_'
IMG_FORMAT = 'png'

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

model = LatexOCR()
for img_path in image_files:
    print(f"\n--- OCR for {img_path} ---")
    try:
        img = Image.open(img_path)
        latex = model(img)
        print(latex)
    except Exception as e:
        print(f"Error processing {img_path}: {e}")

# Clean up image files
def cleanup():
    for img_path in image_files:
        try:
            os.remove(img_path)
        except Exception:
            pass
    print("Temporary images removed.")

cleanup()