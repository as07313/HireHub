# lib/python/api.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from resume_parser import ResumeParser
import tempfile
import os
from typing import Dict, Any

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser = ResumeParser()

# lib/python/api.py
@app.post("/parse-resume")
async def parse_resume(file: UploadFile = File(...)) -> Dict[str, Any]:
    print(f"Received file: {file.filename}, content-type: {file.content_type}")
    
    # result = parser.parse_resume(file.filename)
    # if "error" in result:
    #     raise HTTPException(status_code=422, detail=result["error"])
    
    # metadata = result.get("metadata", {})
    # has_experience = bool(metadata.get("Work Experience")) or metadata.get("experience_count",0) > 0
    # has_skills = bool(result.get("Skills")) or metadata.get("skills_count", 0) > 0


    # if not has_experience and not has_skills:
    #     raise HTTPException(
    #         status_code=422,
    #         detail="File parsed, but does not appear to contain resume content (e.g., missing Work Experience or Skills)."
    #     )
    # Validate file type
    allowed_types = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ]
    
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid file type: {file.content_type}. Allowed types: PDF, DOC, DOCX"
        )

    try:
        with tempfile.TemporaryDirectory() as temp_dir:
            temp_path = os.path.join(temp_dir, file.filename)
            
            # Save and read file content
            content = await file.read()
            if not content:
                raise HTTPException(status_code=422, detail="Empty file")
                
            with open(temp_path, "wb") as temp_file:
                temp_file.write(content)
            
            result = parser.parse_resume(temp_path)
            
            if "error" in result:
                raise HTTPException(status_code=422, detail=result["error"])
                
            return result
            
    except Exception as e:
        print(f"Error processing file: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))