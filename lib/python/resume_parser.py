import json
import os
import re
from pathlib import Path
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional
import pdfplumber
from docx import Document
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ResumeParser:
    """
    Main ResumeParser class that handles text extraction and parsing with different models
    """
    def __init__(self, model_type="openai"):
        """
        Initialize the parser with the specified model type
        
        Args:
            model_type (str): Type of model to use ('openai' or 'llama')
        """
        self.model_type = model_type.lower()

        
        # Initialize the appropriate model
        if self.model_type == "openai":
            self._initialize_openai()
        elif self.model_type == "llama":
            self._initialize_llama()
        else:
            raise ValueError(f"Unsupported model type: {self.model_type}. Use 'openai' or 'llama'")

    def _initialize_openai(self):
        """Set up OpenAI API for parsing"""
        try:
            import openai
            
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")
                
            openai.api_key = api_key
            self.openai = openai
            print("OpenAI model initialized successfully")
            
        except ImportError:
            raise ImportError("OpenAI package not installed. Install with: pip install openai")

    def _initialize_llama(self):
        """Set up Llama model for parsing"""
        try:
            from llama_cpp import Llama
            
            model_path = os.getenv("LLAMA_MODEL_PATH", r"C:\Users\Ahmed Shoaib\Meta-Llama-3.1-8B-Instruct-AWQ-INT4")
            if not os.path.exists(model_path):
                raise ValueError(f"Llama model not found at: {model_path}")
                
            # Configure GPU layers based on environment variable or default to CPU
            n_gpu_layers = int(os.getenv("LLAMA_GPU_LAYERS", "0"))
            
            self.llama = Llama(
                model_path=model_path,
                n_ctx=8192,  # Large context window for full resumes
                n_gpu_layers=n_gpu_layers
            )
            print(f"Llama model initialized successfully (GPU layers: {n_gpu_layers})")
            
        except ImportError:
            raise ImportError("llama-cpp-python package not installed. Install with: pip install llama-cpp-python")

    def extract_text(self, file_path: str) -> str:
        """
        Extract text from PDF or DOCX file
        
        Args:
            file_path (str): Path to the resume file
            
        Returns:
            str: Extracted text content
        """
        file_extension = Path(file_path).suffix.lower()
        
        try:
            # Handle PDF files
            if file_extension == ".pdf":
                text = ""
                with pdfplumber.open(file_path) as pdf:
                    print(f"\nExtracting text from PDF ({len(pdf.pages)} pages)")
                    for page in pdf.pages:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text
                return text.strip()
            
            # Handle Word documents
            elif file_extension in [".docx", ".doc"]:
                doc = Document(file_path)
                return "\n".join(paragraph.text for paragraph in doc.paragraphs).strip()
            
            # Reject unsupported formats
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
                
        except Exception as e:
            print(f"Error extracting text: {e}")
            return None

    def parse_with_openai(self, text: str) -> Dict[str, Any]:
        """
        Parse resume text using OpenAI API
        
        Args:
            text (str): Resume text content to parse
            
        Returns:
            dict: Structured resume data
        """
        print(f"\nParsing text with OpenAI (length: {len(text)})")
        
        # Define system and user prompts
        system_prompt = """You are a resume parsing assistant. Extract structured information from resumes and return it in JSON format."""
        
        user_prompt = f"""
        Extract structured information from this resume and return ONLY a JSON object.
        
        Resume Text:
        {text}

        Return the JSON object with this exact structure:
        {{
            "Name": "candidate name",
            "Summary": "brief summary of the resume maximum 2 lines",
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
            # Make API call to OpenAI
            response = self.openai.ChatCompletion.create(
                model="gpt-4",  # Can be configured via env var in a production implementation
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.2,
                response_format={"type": "json_object"}
            )
            
            # Extract the response text
            cleaned_response = response.choices[0].message.content.strip()
            
            # Parse and validate JSON
            try:
                parsed = json.loads(cleaned_response)
                self._validate_fields(parsed)
                return parsed
                
            except json.JSONDecodeError as je:
                print(f"JSON parsing error: {je}")
                print(f"Attempted to parse: {cleaned_response}")
                raise
                
        except Exception as e:
            print(f"Error in OpenAI parsing: {e}")
            return self._get_empty_resume()

    def parse_with_llama(self, text: str) -> Dict[str, Any]:
        """
        Parse resume text using Llama model
        
        Args:
            text (str): Resume text content to parse
            
        Returns:
            dict: Structured resume data
        """
        print(f"\nParsing text with Llama (length: {len(text)})")
        
        # Careful prompt engineering for Llama
        prompt = f"""<|system|>
You are a resume parsing assistant. Extract structured information from resumes and return it in JSON format.
<|user|>
Extract structured information from this resume and return ONLY a JSON object.

Resume Text:
{text}

Return the JSON object with this exact structure:
{{
    "Name": "candidate name",
    "Summary": "brief summary of the resume maximum 2 lines",
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
<|assistant|>
"""

        try:
            # Generate output using Llama model
            output = self.llama(
                prompt=prompt,
                max_tokens=4096,
                temperature=0.1,
                stop=["<|user|>", "</s>"]
            )
            
            # Extract JSON from response text
            response_text = output['choices'][0]['text']
            
            # Find the JSON part using regex
            json_pattern = r'\{.*\}'
            json_match = re.search(json_pattern, response_text, re.DOTALL)
            
            if json_match:
                json_str = json_match.group(0)
                parsed = json.loads(json_str)
                self._validate_fields(parsed)
                return parsed
            else:
                print("Could not extract JSON from model output")
                return self._get_empty_resume()
                
        except Exception as e:
            print(f"Error in Llama parsing: {e}")
            return self._get_empty_resume()

    def _validate_fields(self, data: Dict[str, Any]) -> None:
        """
        Validate and ensure all required fields exist in parsed data
        
        Args:
            data (dict): Parsed resume data to validate
        """
        required_fields = ["Name", "Summary", "Contact Information", "Education", "Work Experience", "Skills"]
        list_fields = ["Education", "Work Experience", "Skills"]
        
        for field in required_fields:
            if field not in data:
                data[field] = [] if field in list_fields else ""
            elif data[field] is None:
                data[field] = [] if field in list_fields else ""

    def _get_empty_resume(self) -> Dict[str, Any]:
        """
        Return an empty resume structure for error cases
        
        Returns:
            dict: Empty resume data structure
        """
        return {
            "error": "Failed to parse resume",
            "Name": "",
            "Summary": "",
            "Contact Information": "",
            "Education": [],
            "Work Experience": [],
            "Skills": []
        }

    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Main method to parse a resume file
        
        Args:
            file_path (str): Path to the resume file
            
        Returns:
            dict: Structured resume data
        """
        try:
            # Extract text from file
            text = self.extract_text(file_path)
            if not text:
                raise ValueError("Failed to extract text from resume")

            # Parse with selected model
            if self.model_type == "openai":
                parsed_data = self.parse_with_openai(text)
            else:  # llama
                parsed_data = self.parse_with_llama(text)
                
            if "error" in parsed_data and parsed_data["error"]:
                raise ValueError(f"Failed to parse resume: {parsed_data['error']}")

            # Add metadata
            parsed_data["metadata"] = {
                "file_name": Path(file_path).name,
                "text_length": len(text),
                "parser_type": self.model_type,
                "has_contact": bool(parsed_data.get("Contact Information")),
                "education_count": len(parsed_data.get("Education", [])),
                "experience_count": len(parsed_data.get("Work Experience", [])),
                "skills_count": len(parsed_data.get("Skills", []))
            }

            return parsed_data

        except Exception as e:
            print(f"Error parsing resume: {str(e)}")
            result = self._get_empty_resume()
            result["error"] = str(e)
            return result


# Example usage
if __name__ == "__main__":
    # Use the parser with OpenAI
    # openai_parser = ResumeParser(model_type="openai")
    # result = openai_parser.parse_resume("sample_resume.pdf")
    # print(json.dumps(result, indent=2))
    
    # Use the parser with Llama
    llama_parser = ResumeParser(model_type="llama")
    result = llama_parser.parse_resume("ahmedshoaib_resume_fse.pdf")
    print(json.dumps(result, indent=2))