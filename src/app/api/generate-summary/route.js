import { groq } from "@/lib/groq";
import { NextResponse } from "next/server";
import { marked } from "marked";
export async function POST(request) {
    const {transcript,prompt}=await request.json();

    if(!transcript || !prompt){
        return NextResponse.json({ error: 'Transcript and prompt both are required' }, { status: 400 })
    }
    const completion=await getGroqChatCompletion(transcript,prompt)
    const responseFromGroq=completion.choices[0]?.message?.content || ""
    if(!responseFromGroq){
        return NextResponse.json({error:"Internal Server error"},{status:500})
    }
    const htmlResponse=marked.parse(responseFromGroq)
    return NextResponse.json({Summary:htmlResponse,message:'Response fetched successfully'},{status:200})
}
const getGroqChatCompletion = async (transcript,prompt) => {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that helps to generate summary for transcript.",
      },
      {
        role: "user",
        content: `${prompt}\n\n Transcript:\n${transcript}`,
      },
    ],
    model: "openai/gpt-oss-20b",
  });
};