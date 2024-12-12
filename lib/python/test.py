# lib/python/test.py
from resume_parser import ResumeParser
from pathlib import Path
import json

def test_parser():
    parser = ResumeParser()
    
    # Get PDF path
    pdf_path = Path(__file__).parent / "ahmedshoaib_resume_fse.pdf"
    print(f"Processing: {pdf_path}")
    
    # Parse resume
    result = parser.parse_resume(str(pdf_path))
    
    # Save result
    output_file = pdf_path.stem + "_parsed.json"
    with open(output_file, 'w') as f:
        json.dump(result, f, indent=2)
    
    print(f"\nParsed Resume Data saved to: {output_file}")
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    test_parser()