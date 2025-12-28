import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { skill } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating roadmap for skill:", skill);

    const systemPrompt = `You are SkillPilot, an AI-powered learning guidance platform. Generate a comprehensive learning roadmap for the given skill.

Return a JSON object with this exact structure:
{
  "skill": "The skill name",
  "level": "beginner",
  "estimatedTotalTime": "X-Y months",
  "steps": [
    {
      "id": 1,
      "title": "Step title",
      "description": "Step description",
      "duration": "X weeks",
      "completed": false,
      "resources": [
        { "title": "Resource name", "url": "https://example.com", "type": "documentation|course|video|article", "free": true }
      ],
      "tasks": [
        { "id": 1, "title": "Task title", "description": "Task description", "difficulty": "beginner|intermediate|advanced", "completed": false }
      ]
    }
  ],
  "projects": [
    {
      "id": 1,
      "title": "Project title",
      "description": "Project description",
      "difficulty": "beginner|intermediate|advanced",
      "estimatedTime": "X weeks",
      "skills": ["skill1", "skill2"]
    }
  ]
}

Guidelines:
- Create 4-6 learning steps with progressive difficulty
- Include 2-4 free resources per step (use real URLs when possible)
- Add 2-3 practice tasks per step
- Suggest 2-3 capstone projects
- Be encouraging and supportive in descriptions
- Tailor content to beginners by default`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a detailed learning roadmap for: ${skill}` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received, parsing roadmap...");
    
    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }
    
    const roadmap = JSON.parse(jsonStr.trim());

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Failed to generate roadmap" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
