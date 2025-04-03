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

  // Inject buttons into the Storyblok story list
  useEffect(() => {
    const injectButtons = () => {
      const storyRows = document.querySelectorAll(
        '[data-testid="list-stories-table-header-list-column"]'
      );

      storyRows.forEach((row) => {
        if (!row.querySelector(".story-info-btn")) {
          const button = document.createElement("button");
          button.innerText = "Show Info";
          button.classList.add("story-info-btn");
          button.style.cssText = `
            margin-left: 10px;
            padding: 5px 10px;
            font-size: 14px;
            cursor: pointer;
            border-radius: 4px;
            background: #007bff;
            color: white;
            border: none;
          `;

          // Extract story name or slug from the row
          const storySlug = row.textContent.trim(); 

          button.onclick = () => {
            alert(`Story: ${storySlug}`);
          };

          row.appendChild(button);
        }
      });
    };

    // Run once and observe DOM changes
    injectButtons();
    const observer = new MutationObserver(injectButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Storyblok Tool Plugin</h2>
      {story ? (
        <>
          <p>
            <strong>Name:</strong> {story.name}
          </p>
          <p>
            <strong>Slug:</strong> {story.slug}
          </p>
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
