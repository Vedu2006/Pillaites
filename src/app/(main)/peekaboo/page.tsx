import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SearchResult {
  url: string;
  snippet: string;
}

interface ImageResult {
  url: string;
}

interface GroqResponse {
  choices: Array<{ message: { content: string } }>;
  error?: { message: string };
}

const PeeKaboo: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<ImageResult[]>([]);
  const [summary, setSummary] = useState<string>('');
  const [metadata, setMetadata] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const questions = [
    "What is today's breaking news?",
    "Trends in computer science technology",
    "Software Testing Methods",
    "Why is interstellar the best movie?"
  ];

  useEffect(() => {
    const loadFont = async () => {
      await document.fonts.load('12px "VT323"');
    };
    loadFont();
  }, []);

  const typeWriterEffect = (content: string, element: HTMLElement, speed: number = 5) => {
    const sentences = content.split('\n\n');
    element.innerHTML = '';

    let sentenceIndex = 0;
    let charIndex = 0;

    const typeChar = () => {
      if (sentenceIndex < sentences.length) {
        const currentSentence = sentences[sentenceIndex];
        
        if (charIndex === 0) {
          const p = document.createElement('p');
          element.appendChild(p);
        }

        const p = element.lastElementChild as HTMLParagraphElement;
        p.innerHTML += currentSentence[charIndex];
        charIndex++;

        if (charIndex >= currentSentence.length) {
          charIndex = 0;
          sentenceIndex++;
          setTimeout(typeChar, speed * 2);
        } else {
          setTimeout(typeChar, speed);
        }
      }
    };

    typeChar();
  };

  const searchWithGoogle = async (query: string, numSources: number = 15): Promise<SearchResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numSources}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google search failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.items?.map((item: any) => ({
      url: item.link,
      snippet: item.snippet || '',
    })) || [];
  };

  const searchImagesWithGoogle = async (query: string, numImages: number = 4): Promise<ImageResult[]> => {
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&cx=${process.env.NEXT_PUBLIC_GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&num=${numImages}&searchType=image`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Google image search failed: ${response.statusText}`);
    
    const data = await response.json();
    return data.items?.map((item: any) => ({ url: item.link })) || [];
  };

  const getPromptContext = (snippets: SearchResult[], images: ImageResult[]): string => {
    const snippetsText = snippets.map((s, i) => `[citation:${i + 1}] ${s.snippet}`).join('\n\n');
    const imagesText = images.map((_, i) => `Image ${i + 1}: [Brief description and relevance to the topic]`).join('\n');

    return `Answer the following based on the provided information:

1. Provide a detailed, paragraphed, comprehensive answer to the question. It must be accurate, high-quality, and expertly written in a positive, interesting, and engaging manner. The answer should be informative and in the same language as the user question. Aim for at least 300 words in your response.

2. After your main answer, provide a section titled "Image Descriptions" where you describe how each of the provided images relates to the topic. Use the format: "Image X: [Brief description and relevance to the topic]"

Always use the related citations and cite them at the end of each sentence in the format [citation:x]. If a sentence comes from multiple citations, list all applicable citations, like [citation:2][citation:3].

Here are the provided citations:

${snippetsText}

Here are descriptions of relevant images:
${imagesText}

Use the provided information to create a comprehensive and engaging response.`;
  };

  const requestGroq = async (query: string, context: string): Promise<GroqResponse> => {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          { role: "system", content: context },
          { role: "user", content: query }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      }),
    });

    if (!response.ok) throw new Error(`Groq API request failed: ${response.statusText}`);
    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResults([]);
    setSummary('Processing query...');
    setMetadata('');

    try {
      console.log('Fetching search results and images...');
      const [snippets, images] = await Promise.all([
        searchWithGoogle(query),
        searchImagesWithGoogle(query)
      ]);
      console.log(`Found ${snippets.length} snippets and ${images.length} images`);

      setResults(images);

      console.log('Preparing prompt context...');
      const promptContext = getPromptContext(snippets, images);

      console.log('Requesting summary from Groq...');
      const data = await requestGroq(query, promptContext);

      const content = data.choices?.[0]?.message?.content || 'No summary available.';
      console.log('Received summary from Groq');

      setSummary(content);
      setMetadata(`Query: ${query}\nModel: mixtral-8x7b-32768`);

      const summaryElement = document.getElementById('summary');
      if (summaryElement) {
        typeWriterEffect(content, summaryElement);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(`An error occurred: ${(error as Error).message}`);
      setSummary('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>PeeKaboo?</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query..."
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'EXECUTE'}
        </button>
      </form>
      <div id="suggestions">
        {questions.map((q, index) => (
          <span key={index} className="question" onClick={() => setQuery(q)}>
            {q}
          </span>
        ))}
      </div>
      {error && <div className="error">{error}</div>}
      <div id="results">
        {results.length > 0 ? (
          results.map((image, index) => (
            <Image key={index} src={image.url} alt={`Image ${index + 1}`} width={200} height={200} />
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
      <div id="summary">
        <h2>{query}</h2>
        <div dangerouslySetInnerHTML={{ __html: summary }} />
      </div>
      <div id="metadata">
        <h2>Metadata</h2>
        <pre>{metadata}</pre>
      </div>
      <footer>
        &copy; 2024 PeeKaboo | Powered by Illuminati
      </footer>
    </div>
  );
};

export default PeeKaboo;
