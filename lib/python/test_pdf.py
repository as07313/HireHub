# lib/python/test_pdf.py
from pathlib import Path
import pdfplumber

def test_pdf_extraction():
    # Get PDF path
    current_dir = Path(__file__).parent
    test_file = current_dir / "ahmedshoaib_resume_fse.pdf"
    
    print(f"PDF path: {test_file}")
    print(f"File exists: {test_file.exists()}")
    
    try:
        # Extract text using pdfplumber
        with pdfplumber.open(test_file) as pdf:
            # Print PDF metadata
            print(f"\nPDF Info:")
            print(f"Number of pages: {len(pdf.pages)}")
            
            # Extract and print text from each page
            all_text = ""
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                all_text += text
                print(f"\nPage {i+1} text length: {len(text)}")
                print(f"First 200 chars of page {i+1}:")
                print("-" * 50)
                print(text[:200])
                print("-" * 50)
            
            print(f"\nTotal text length: {len(all_text)}")
            return all_text
            
    except Exception as e:
        print(f"Error extracting PDF: {str(e)}")
        return None

if __name__ == "__main__":
    extracted_text = test_pdf_extraction()