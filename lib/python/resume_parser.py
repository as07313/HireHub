# lib/python/resume_parser.py
import google.generativeai as genai
import json
import os
from pathlib import Path
import pdfplumber
from docx import Document

class ResumeParser:
    def __init__(self):
        # Initialize Gemini
        genai.configure(api_key="AIzaSyD1siboaFHL_m1kRS4XR7FOWkzq0eVd8qo")
        self.model = genai.GenerativeModel("gemini-1.5-pro")
        
        # Load skills dictionary
        with open('skills.json', 'r') as f:
            self.skills_dict = json.load(f)

    def extract_text(self, file_path: str) -> str:
        """Extract text from PDF or DOCX file"""
        file_extension = Path(file_path).suffix.lower()
        
        try:
            if file_extension == ".pdf":
                text = ""
                with pdfplumber.open(file_path) as pdf:
                    print(f"\nExtracting text from PDF ({len(pdf.pages)} pages)")
                    for page in pdf.pages:
                        text += page.extract_text()
                return text.strip()
                
            elif file_extension in [".docx", ".doc"]:
                doc = Document(file_path)
                return "\n".join(paragraph.text for paragraph in doc.paragraphs).strip()
                
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            return None

    def parse_with_gemini(self, text: str) -> dict:
        """Parse resume text using Gemini API"""
        print(f"\nParsing text length: {len(text)}")
        print(f"First 200 chars:\n{text[:200]}")
        
        prompt = f"""
        Extract structured information from this resume in JSON format.
        
        Resume Text:
        {text}

        Return ONLY the JSON object with this exact structure, remove unwanted characters and make sure text follows case:
        {{
            "Name": "candidate name",
            "Contact Information": "email and phone",
            "Education": [
                {{
                    "Degree": "degree name",
                    "Institution": "school name",
                    "Year": "graduation year"
                }}
            ],
            "Work Experience": [
                {{
                    "Job Title": "position",
                    "Company": "company name",
                    "Duration": "timeframe",
                    "Description": "responsibilities"
                }}
            ],
            "Skills": ["skill1", "skill2", "etc"]
        }}
        """

        try:
        # Generate response
            response = self.model.generate_content(prompt)
            print("\nRaw Gemini response:")
            print(response.text)
            
            # Clean and validate response
            cleaned_response = response.text.strip()
            if not cleaned_response.startswith('{'):
                # Try to find JSON in the response
                start_idx = cleaned_response.find('{')
                end_idx = cleaned_response.rfind('}') + 1
                if start_idx != -1 and end_idx != -1:
                    cleaned_response = cleaned_response[start_idx:end_idx]
                else:
                    raise ValueError("No valid JSON found in response")
                    
            # Parse JSON
            try:
                parsed = json.loads(cleaned_response)
                # Validate required fields
                required_fields = ["Name", "Contact Information", "Education", "Work Experience", "Skills"]
                for field in required_fields:
                    if field not in parsed:
                        parsed[field] = [] if field in ["Education", "Work Experience", "Skills"] else ""
                return parsed
                
            except json.JSONDecodeError as je:
                print(f"JSON parsing error: {je}")
                print(f"Attempted to parse: {cleaned_response}")
                raise
                
        except Exception as e:
            print(f"Error in Gemini parsing: {e}")
            return None

    def parse_resume(self, file_path: str) -> dict:
        """Main method to parse resume"""
        try:
            # Extract text
            text = self.extract_text(file_path)
            if not text:
                raise ValueError("Failed to extract text from resume")

            # Parse with Gemini
            parsed_data = self.parse_with_gemini(text)
            if not parsed_data:
                raise ValueError("Failed to parse resume with Gemini")

            # Add metadata
            parsed_data["metadata"] = {
                "file_name": Path(file_path).name,
                "text_length": len(text),
                "has_contact": bool(parsed_data.get("Contact Information")),
                "education_count": len(parsed_data.get("Education", [])),
                "experience_count": len(parsed_data.get("Work Experience", [])),
                "skills_count": len(parsed_data.get("Skills", []))
            }

            return parsed_data

        except Exception as e:
            print(f"Error parsing resume: {str(e)}")
            return {
                "error": str(e),
                "Name": "",
                "Contact Information": "",
                "Education": [],
                "Work Experience": [],
                "Skills": []
            }