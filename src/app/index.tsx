import { lookupClipAsync } from "@/components/lookup-clip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export { ErrorBoundary } from "expo-router";

const suggestedUrls = ["pillarvalley.expo.app", "yelp.com", "joinswsh.com"];

export default function ClipFinder() {
  const [url, setUrl] = useState("");
  const [clipIds, setClipIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleLookup = async (input = url) => {
    setLoading(true);
    console.log("lookup", input);
    try {
      const ids = await lookupClipAsync(input);
      setClipIds(ids);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img
            src="/expo.svg"
            alt="Expo Logo"
            className="h-8 w-8 mr-3 dark:filter dark:invert"
          />
          <div>
            <h1 className="text-2xl font-bold">App Clip Lookup</h1>
          </div>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        <Input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
          onSubmit={() => handleLookup()}
        />
        <Button onClick={() => handleLookup()} disabled={loading}>
          {loading ? "Loading..." : "Lookup"}
        </Button>
      </div>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      <div>
        {clipIds.length > 0 && (
          <ul className="list-disc pl-5 mb-6">
            {clipIds.map((id) => (
              <li key={id}>
                <a
                  href={`https://appclip.apple.com/id?p=${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {`https://appclip.apple.com/id?p=${id}`}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Suggested</h2>
        <div className="flex flex-wrap gap-2">
          {suggestedUrls.map((suggestedUrl) => (
            <button
              key={suggestedUrl}
              onClick={() => {
                setUrl(suggestedUrl);
                handleLookup(suggestedUrl);
              }}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
            >
              {suggestedUrl}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
