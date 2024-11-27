To run:
Compose JSON string as:
{
    "question": "How do I write a function that adds two numbers?"
}

I have used POSTMAN
https://blink6.postman.co/workspace/Blink-Workspace~ecfbfa3e-54e7-4acc-8dbf-463d0ac05918/collection/40044673-0b42bb82-3d97-48f6-9792-5f4810064280?action=share&creator=40044673
One can write a CURL query as: 
curl -X POST http://52.66.211.181:8000/api/generate-code \
     -H "Content-Type: application/json" \
     -d '{"question": "How do I write a function that adds two numbers?"}'

