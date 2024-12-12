# lib/python/main.py
from api import app

# This allows running as "uvicorn main:app"
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", reload=True)