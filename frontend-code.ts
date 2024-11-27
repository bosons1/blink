// pages/index.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define the response type from our AI backend
interface AIResponse {
  function: string;
  explanation: string;
  isRelevant: boolean;
}

export default function CodingTutor() {
  // State management for the application
  const [question, setQuestion] = useState<string>('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [output, setOutput] = useState<string>('');

  // Function to handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      
      const data: AIResponse = await res.json();
      setResponse(data);
      
      // Reset output when getting new function
      setOutput('');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to execute the generated code
  const executeCode = () => {
    if (response?.function) {
      try {
        // Create a new function from the generated code
        const generatedFunction = new Function(response.function);
        const result = generatedFunction();
        setOutput(String(result));
      } catch (error) {
        setOutput(`Error executing function: ${error}`);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>JavaScript Coding Tutor</CardTitle>
          <CardDescription>
            Ask questions about how to write JavaScript functions!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Question input area */}
          <Textarea
            placeholder="Example: How do I write a function that returns the sum of two numbers?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[100px]"
          />
          
          <Button 
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            className="w-full"
          >
            {isLoading ? 'Generating...' : 'Get Solution'}
          </Button>

          {/* Display response */}
          {response && (
            <div className="mt-4 space-y-4">
              {!response.isRelevant ? (
                <Alert variant="destructive">
                  <AlertDescription>
                    Sorry, your question isn't relevant to JavaScript function writing. 
                    Please ask about creating JavaScript functions!
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="bg-slate-100 p-4 rounded-md">
                    <h3 className="font-semibold mb-2">Generated Function:</h3>
                    <pre className="bg-slate-200 p-2 rounded">
                      <code>{response.function}</code>
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Explanation:</h3>
                    <p>{response.explanation}</p>
                  </div>

                  <Button onClick={executeCode} className="w-full">
                    Try It Out
                  </Button>

                  {output && (
                    <div className="bg-slate-100 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Output:</h3>
                      <pre className="bg-slate-200 p-2 rounded">
                        <code>{output}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
