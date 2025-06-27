#!/usr/bin/env python3
"""
Test script to verify all package imports work correctly
"""

def test_imports():
    print("Testing package imports...")
    
    try:
        from PIL import Image
        print("✅ PIL/Pillow imported successfully")
    except ImportError as e:
        print(f"❌ PIL/Pillow import failed: {e}")
    
    try:
        from pix2tex.cli import LatexOCR
        print("✅ pix2tex imported successfully")
    except ImportError as e:
        print(f"❌ pix2tex import failed: {e}")
    
    try:
        from pdf2image import convert_from_path
        print("✅ pdf2image imported successfully")
    except ImportError as e:
        print(f"❌ pdf2image import failed: {e}")
    
    try:
        import numpy as np
        print(f"✅ NumPy imported successfully (version: {np.__version__})")
    except ImportError as e:
        print(f"❌ NumPy import failed: {e}")
    
    try:
        import torch
        print(f"✅ PyTorch imported successfully (version: {torch.__version__})")
    except ImportError as e:
        print(f"❌ PyTorch import failed: {e}")
    
    try:
        import transformers
        print(f"✅ Transformers imported successfully (version: {transformers.__version__})")
    except ImportError as e:
        print(f"❌ Transformers import failed: {e}")
    
    try:
        import openai
        print(f"✅ OpenAI imported successfully (version: {openai.__version__})")
    except ImportError as e:
        print(f"❌ OpenAI import failed: {e}")
    
    print("\n🎉 All imports completed!")

if __name__ == "__main__":
    test_imports() 