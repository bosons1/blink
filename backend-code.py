# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from typing import Optional
import re
import os

app = FastAPI()

# Model for the request body
class CodeRequest(BaseModel):
    question: str

# Model for the response
class CodeResponse(BaseModel):
    function: str
    explanation: str
    isRelevant: bool

# Initialize OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.post("/api/generate-code")
async def generate_code(request: CodeRequest) -> CodeResponse:
    """
    Generate JavaScript code based on the user's question.
    """
    # First check if the question is relevant
    return CodeResponse(
        function="",
        explanation="",
        isRelevant=False
    )

    try:
        # Prepare the prompt for the AI
        prompt = f"""
        Create a simple JavaScript function based on this question: {request.question}
        
        Provide your response in the following format:
        FUNCTION:
        [The JavaScript function code]
        EXPLANATION:
        [A one-line explanation of what the function does]
        
        Keep the function simple and focused on teaching basic concepts.
        """

        # Get response from OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a JavaScript coding tutor. Keep explanations simple and concise."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=300,
            temperature=0.7
        )

        # Extract function and explanation from the response
        content = response.choices[0].message.content
        
        # Parse the response
        function_match = re.search(r'FUNCTION:\n(.*?)\nEXPLANATION:', content, re.DOTALL)
        explanation_match = re.search(r'EXPLANATION:\n(.*?)$', content, re.DOTALL)
        
        if not function_match or not explanation_match:
            raise ValueError("Failed to parse AI response")

        return CodeResponse(
            function=function_match.group(1).strip(),
            explanation=explanation_match.group(1).strip(),
            isRelevant=True
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
