import { useEffect, useState } from "react";

function App() {
  const [story, setStory] = useState(null);

  useEffect(() => {
    // Function to handle messages from Storyblok
    const handleMessage = (event) => {
      if (event.data?.action === "get-context") {
        const storyData = event.data.story;
        if (storyData) {
          setStory({
            name: storyData.name,
            slug: storyData.slug,
          });
        }
      }
    };

    // Listen for messages from Storyblok
    window.addEventListener("message", handleMessage, false);

    // Request story context from Storyblok
    window.parent.postMessage(
      {
        action: "tool-changed",
        tool: "story-info-plugin",
        event: "getContext",
      },
      "*"
    );

    return () => {
      window.removeEventListener("message", handleMessage, false);
    };
  }, []);

  // Adjust the height of the iframe dynamically
  useEffect(() => {
    const handleResize = () => {
      const height = document.body.clientHeight;
      window.parent.postMessage(
        {
          action: "tool-changed",
          tool: "story-info-plugin",
          event: "heightChange",
          height,
        },
        "*"
      );
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(document.body);

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
      <h2>Storyblok Tool Plugin</h2>
      {story ? (
        <>
          <p><strong>Name:</strong> {story.name}</p>
          <p><strong>Slug:</strong> {story.slug}</p>
          <button
            onClick={() => alert(`Story: ${story.name} \nSlug: ${story.slug}`)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              background: "#007bff",
              color: "white",
              border: "none",
              marginTop: "10px",
            }}
          >
            Show Story Info
          </button>
        </>
      ) : (
        <p>Loading story details...</p>
      )}
    </div>
  );
}

export default App;
