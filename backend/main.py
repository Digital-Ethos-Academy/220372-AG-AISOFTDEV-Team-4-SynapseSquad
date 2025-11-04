from fastapi import FastAPI

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

# To run:
# cd backend
# uvicorn main:app --reload