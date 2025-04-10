// src/api.ts
export const sendGuess = async (name: string, image: string, guess: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/submit-guess/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image, guess }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending guess:', error);
      return null;
    }
  };
  