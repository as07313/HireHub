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
    Main ResumeParser class that handles text extraction and parsing using OpenAI
    """
    def __init__(self):
        """
        Initialize the parser with the OpenAI model
        """
        self._initialize_openai()


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


    def extract_text(self, file_path: str) -> str:
        """
        Extract text from PDF or DOCX file

        Args:
            file_path (str): Path to the resume file

        Returns:
            str: Extracted text content or None if extraction fails
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

# ...existing code...

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
        system_prompt = """You are an expert resume parser. Your sole task is to extract structured information from the provided resume text and return it *only* as a valid JSON object.

**Strict Rules:**
1.  **Output Format:** Respond *only* with the JSON object. No introductory text, explanations, markdown, or comments.
2.  **JSON Structure:** Adhere strictly to the JSON structure shown in the user prompt examples. All specified top-level keys ("Name", "Summary", "Contact Information", "Education", "Work Experience", "Skills") MUST be present.
3.  **Empty Values:**
    - If a top-level string field ("Name","Contact Information") is missing, use `""`.
    - If a top-level string field ("Summary") is missing, summarize the resume content in 1-2 sentences for the "Summary" field.
    - If a top-level list field ("Skills") is missing extract the skills from the resume text. If no skills are found, use `[]`.
    - If a top-level list field ("Education", "Work Experience") is empty, use `[]`.
    - Within "Education" or "Work Experience" objects, use `""` for any missing string values (Degree, Institution, Year, Job Title, Company, Duration, Description).
    - Do NOT use `null` or `None`.
4.  **Field Specifics:**
    - **Summary:** Keep concise (1-2 sentences).
    - **Education Year:** Extract as a four-digit year (e.g., "2018") if clearly identifiable. If it's a range or includes text like "Expected", extract the text as found (e.g., "2019 - 2021", "Expected May 2025"). If no year/date is found, use `""`.
    - **Work Experience Duration:** Use the format "Month-Year - Month-Year" (e.g., "Jan-2020 - Dec-2022") or "Month-Year - Present" (e.g., "Mar-2021 - Present"). If only years are available, use "YYYY - YYYY" or "YYYY - Present". If the format is significantly different or unclear, extract the duration text as found. If no duration is found, use `""`.
    - **Skills:** Keep the top 5 to 6 relevant skills. If no skills are found, use `[]`.
"""

        user_prompt = f"""
        Here are examples of the desired input/output format:

        **Example 1:**

        Input Text:
        "Jane Doe - jane.doe@email.com - 555-1234. Experienced Software Engineer. B.S. Computer Science, Tech University, 2018. Software Engineer at ABC Corp (Jan 2019 - Present). Skills: Python, Java."

        Output JSON:
        {{
            "Name": "Jane Doe",
            "Summary": "Experienced Software Engineer.",
            "Contact Information": "jane.doe@email.com, 555-1234",
            "Education": [
                {{
                    "Degree": "B.S. Computer Science",
                    "Institution": "Tech University",
                    "Year": "2018"
                }}
            ],
            "Work Experience": [
                {{
                    "Job Title": "Software Engineer",
                    "Company": "ABC Corp",
                    "Duration": "Jan-2019 - Present",
                    "Description": ""
                }}
            ],
            "Skills": ["Python", "Java"]
        }}

        **Example 2 (Missing Info & Different Date Format):**

        Input Text:
        "John Smith | Project Manager. Graduated 2015. PM at XYZ Inc (2020-2022). Skills: Agile."

        Output JSON:
        {{
            "Name": "John Smith",
            "Summary": "Project Manager.",
            "Contact Information": "",
            "Education": [
                 {{
                    "Degree": "",
                    "Institution": "",
                    "Year": "2015"
                 }}
            ],
            "Work Experience": [
                 {{
                    "Job Title": "PM",
                    "Company": "XYZ Inc",
                    "Duration": "2020 - 2022",
                    "Description": ""
                 }}
            ],
            "Skills": ["Agile"]
        }}
        
        **Now, parse the following resume text according to the rules and examples:**

        Resume Text:
        ```
        {text}
        ```

        Return ONLY the JSON object.        
        """

        try:
            # Make API call to OpenAI
            model_name = os.getenv("OPENAI_MODEL", "gpt-4o") # Use environment variable or default
            print(f"Using OpenAI model: {model_name}")

            # Ensure you are using the correct method based on your openai library version
            # For openai >= 1.0.0
            if hasattr(self.openai, 'chat') and hasattr(self.openai.chat, 'completions'):
                    response = self.openai.chat.completions.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.1, # Lower temperature for more deterministic JSON
                    # response_format={"type": "json_object"} # Keep commented if model doesn't support
                )
                    cleaned_response = response.choices[0].message.content.strip()
            # For openai < 1.0.0
            else:
                response = self.openai.ChatCompletion.create(
                    model=model_name,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    temperature=0.1, # Lower temperature for more deterministic JSON
                    # response_format might not be supported in older versions
                )
                cleaned_response = response.choices[0].message.content.strip()

            # Parse and validate JSON
            try:
                # Attempt to find JSON within the response, as it might include explanations
                json_match = re.search(r'\{.*\}', cleaned_response, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    # Ensure outer braces are correctly handled if regex is too greedy
                    try:
                        parsed = json.loads(json_str)
                    except json.JSONDecodeError:
                        # Fallback: try removing potential leading/trailing non-JSON chars if regex failed
                        json_str_cleaned = cleaned_response.strip().lstrip('```json').rstrip('```')
                        parsed = json.loads(json_str_cleaned)

                    self._validate_fields(parsed)
                    print(f"Parsed JSON: {json.dumps(parsed, indent=2)}")
                    return parsed
                else:
                    # If no JSON object is found in the response, try parsing the whole response
                    try:
                        json_str_cleaned = cleaned_response.strip().lstrip('```json').rstrip('```')
                        parsed = json.loads(json_str_cleaned)
                        self._validate_fields(parsed)
                        return parsed
                    except json.JSONDecodeError:
                         print(f"No JSON object found or response is not valid JSON: {cleaned_response}")
                         return self._get_empty_resume("No JSON object found or response is not valid JSON")


            except json.JSONDecodeError as je:
                print(f"JSON parsing error: {je}")
                print(f"Attempted to parse: {cleaned_response}")
                # Return empty structure on JSON parse error, but log the error
                return self._get_empty_resume("JSON parsing error")

        except Exception as e:
            print(f"Error in OpenAI parsing: {e}")
            # Check if the error is an APIError and extract details if possible
            if hasattr(e, 'status_code') and hasattr(e, 'body'):
                    error_detail = f"Error code: {e.status_code} - {e.body}"
                    return self._get_empty_resume(error_detail)
            else:
                    return self._get_empty_resume(str(e))

# ... rest of the class ...

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

    def _get_empty_resume(self, error_message: str = "Failed to parse resume") -> Dict[str, Any]:
        """
        Return an empty resume structure for error cases

        Args:
            error_message (str): The error message to include

        Returns:
            dict: Empty resume data structure with error key
        """
        return {
            "error": error_message,
            "Name": "",
            "Summary": "",
            "Contact Information": "",
            "Education": [],
            "Work Experience": [],
            "Skills": []
        }

    def parse_resume(self, file_path: str) -> Dict[str, Any]:
        """
        Main method to parse a resume file using OpenAI

        Args:
            file_path (str): Path to the resume file

        Returns:
            dict: Structured resume data
        """
        try:
            # Extract text from file
            text = self.extract_text(file_path)
            if not text:
                # Return error structure if text extraction fails
                return self._get_empty_resume("Failed to extract text from resume")

            # Parse with OpenAI model
            parsed_data = self.parse_with_openai(text)

            # Check if parsing itself returned an error
            if "error" in parsed_data and parsed_data["error"]:
                 # The error is already set in parsed_data by parse_with_openai or _get_empty_resume
                return parsed_data

            # Add metadata if parsing was successful (no error key or error is None/empty)
            if not parsed_data.get("error"):
                parsed_data["metadata"] = {
                    "file_name": Path(file_path).name,
                    "text_length": len(text),
                    "parser_type": "openai",
                    "has_contact": bool(parsed_data.get("Contact Information")),
                    "education_count": len(parsed_data.get("Education", [])),
                    "experience_count": len(parsed_data.get("Work Experience", [])),
                    "skills_count": len(parsed_data.get("Skills", []))
                }

            return parsed_data

        except Exception as e:
            # Catch any unexpected errors during the process
            print(f"Unexpected error parsing resume: {str(e)}")
            return self._get_empty_resume(f"Unexpected error: {str(e)}")


# ...existing code...

# Example usage
if __name__ == "__main__":
    # Use the parser with OpenAI
    openai_parser = ResumeParser()
    # Make sure you have a sample resume file (e.g., sample_resume.pdf)
    # and your OPENAI_API_KEY is set in a .env file
    try:
        # Construct path relative to the script's directory
        script_dir = Path(__file__).parent
        test_file_name = "Vaniaimran-Resume-.pdf"
        test_file_path = script_dir / test_file_name

        if test_file_path.exists():
             print(f"Parsing test file: {test_file_path}")
             result = openai_parser.parse_resume(str(test_file_path)) # Pass the full path as string
             print(json.dumps(result, indent=2))
        else:
             print(f"Test file '{test_file_name}' not found in directory: {script_dir}")
    except Exception as e:
        print(f"An error occurred during example usage: {e}")

