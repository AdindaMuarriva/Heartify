// app/test-campaigns/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function TestCampaigns() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/debug/campaigns")
      .then(res => res.json())
      .then(data => {
        console.log("Debug data:", data);
        setCampaigns(data.campaigns || []);
        setLoading(false);
      });
  }, []);

  const testCampaign = (id: string) => {
    console.log(`Testing campaign with ID: ${id}`);
    fetch(`/api/campaign/${encodeURIComponent(id)}`)
      .then(res => res.json())
      .then(data => console.log("Result:", data))
      .catch(err => console.error("Error:", err));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "monospace" }}>
      <h1>Test Campaign IDs</h1>
      <p>Total campaigns: {campaigns.length}</p>
      
      <table border={1} cellPadding={5} style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>No</th>
            <th>Title</th>
            <th>_id (String)</th>
            <th>_id Type</th>
            <th>Length</th>
            <th>Has Collected</th>
            <th>Has Deadline</th>
            <th>Test</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{campaign.title}</td>
              <td style={{ fontSize: "10px", wordBreak: "break-all" }}>
                {campaign._idString}
              </td>
              <td>{campaign._idType}</td>
              <td>{campaign._idString?.length}</td>
              <td>{campaign.hasCollected ? "✅" : "❌"}</td>
              <td>{campaign.hasDeadline ? "✅" : "❌"}</td>
              <td>
                <button 
                  onClick={() => testCampaign(campaign._idString)}
                  style={{ fontSize: "10px", padding: "2px 5px" }}
                >
                  Test API
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div style={{ marginTop: "20px" }}>
        <h3>Sample URLs to Test:</h3>
        {campaigns.slice(0, 3).map((campaign, index) => (
          <div key={index} style={{ margin: "5px 0" }}>
            <a 
              href={`/informasi/${campaign._idString}`}
              target="_blank"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              {campaign.title} - {campaign._idString.substring(0, 20)}...
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}