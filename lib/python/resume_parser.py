import json
import os
from pathlib import Path
import pdfplumber
from docx import Document
from dotenv import load_dotenv
import openai

load_dotenv()

class ResumeParser:
    def __init__(self):
        # Initialize OpenAI
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")

        openai.api_key = api_key
        
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

    def parse_with_openai(self, text: str) -> dict:
        """Parse resume text using OpenAI API"""
        print(f"\nParsing text length: {len(text)}")
        print(f"First 200 chars:\n{text[:200]}")
        
        system_prompt = """You are a resume parsing assistant. Extract structured information from resumes and return it in JSON format."""
        
        user_prompt = f"""
        Extract structured information from this resume and return ONLY a JSON object.
        
        Resume Text:
        {text}

        Return the JSON object with this exact structure:
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
            response = openai.ChatCompletion.create(
                model="gpt-4",  # or "gpt-3.5-turbo" for a cheaper alternative
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,  # Lower temperature for more consistent outputs
                response_format={ "type": "json_object" }  # Ensure JSON response
            )
            
            # Extract the response text
            cleaned_response = response.choices[0].message.content.strip()
            
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
            print(f"Error in OpenAI parsing: {e}")
            return None

    def parse_resume(self, file_path: str) -> dict:
        """Main method to parse resume"""
        try:
            # Extract text
            text = self.extract_text(file_path)
            if not text:
                raise ValueError("Failed to extract text from resume")

            # Parse with OpenAI instead of Gemini
            parsed_data = self.parse_with_openai(text)
            if not parsed_data:
                raise ValueError("Failed to parse resume with OpenAI")

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