import React, { useEffect, useState } from "react";
import Storyblok from "@storyblok/js"; // Install via npm: npm install @storyblok/js

const StoryblokPlugin = () => {
  const [storyData, setStoryData] = useState(null);

  useEffect(() => {
    const fetchStoryData = async () => {
      // Replace with your Storyblok Space ID and Access Token
      const STORYBLOK_SPACE_ID = "1021485"; 
      const ACCESS_TOKEN = "gk09GGED7Vzy4r7I8rTqVQtt-256793-WWo1zBy7CnUDDqxFEBmQ"; 

      const storyblokApi = new Storyblok({
        accessToken: ACCESS_TOKEN,
      });

      try {
        // Get current story details
        const response = await storyblokApi.get(`cdn/stories`, {
          version: "draft",
        });

        if (response.data.stories.length > 0) {
          setStoryData(response.data.stories);
        }
      } catch (error) {
        console.error("Error fetching Storyblok data:", error);
      }
    };

    fetchStoryData();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Story Details</h2>
      {storyData ? (
        <ul>
          {storyData.map((story) => (
            <li key={story.uuid}>
              <strong>{story.name}</strong> <br />
              Slug: {story.slug}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading stories...</p>
      )}
    </div>
  );
};

export default StoryblokPlugin;
