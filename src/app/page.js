"use client";
import axios from "axios";
import { useState,useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

export default function TranscriptForm() {
  
  const editorRef = useRef(null);
  const [mailSent,setMailSent]=useState(false)
  const [data, setData] = useState({
    transcript: "",
    prompt: "",
  });
  const [mail,setMail]=useState({
    to:'',
    subject:'',
    content:''
  })
  const [response, setResponse] = useState("");
  const getData = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/generate-summary", data);
      setResponse(res.data.Summary);
      setMailSent(false)
    } catch (error) {
      console.log(error.message);
    }
  };
  const sendMail=async()=>{
    try {
      const res = await axios.post("/api/send-mail", mail);
      console.log(res)
      setMailSent(true)
    } catch (error) {
      console.log(error.message)
    }
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      
    {response && (<h1 className="text-black font-bold text-4xl">Please scroll to see the response</h1>)}
      <form
        className="w-full max-w-2xl bg-white text-black shadow-lg rounded-2xl p-8 space-y-6"
        onSubmit={getData}
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Meeting Summarizer
        </h1>

        {/* Prompt */}
        <div>
          <label className="block text-black font-medium mb-2">Prompt</label>
          <input
            type="text"
            value={data.prompt}
            onChange={(e) => setData({ ...data, prompt: e.target.value })}
            placeholder="Enter your prompt..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Transcript */}
        <div>
          <label className="block text-black font-medium mb-2">
            Transcript
          </label>
          <textarea
            value={data.transcript}
            onChange={(e) =>
              setData({ ...data, transcript: e.target.value })
            }
            placeholder="Paste meeting transcript here..."
            rows={8}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="cursor-pointer w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Summarize
        </button>
      </form>

      {response && (
         <div className="mt-6 w-full max-w-2xl space-y-4">
         <Editor
      apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API}
      onInit={(evt, editor) => editorRef.current = editor}
      onEditorChange={(newText) => setMail(prev => ({ ...prev, content: newText }))}
      initialValue={response}
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist", "autolink", "lists", "link", "image", "charmap", "preview", "anchor",
          "searchreplace", "visualblocks", "code", "fullscreen",
          "media", "table", "help", "wordcount"
        ],
        toolbar:
          "undo redo | formatselect | " +
          "bold italic backcolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
      }}
    />
     <input
      type="text"
      placeholder="Enter recipient email"
      value={mail.to}
      onChange={(e) => setMail({ ...mail, to: e.target.value })}
      className="w-full border rounded p-2 text-black"
    />
    <input
      type="text"
      placeholder="Enter subject"
      value={mail.subject}
      onChange={(e) => setMail({ ...mail, subject: e.target.value })}
      className="w-full border rounded p-2 text-black"
    />
    <button
      onClick={sendMail}
      className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Send Mail
    </button>
      {setMailSent && (<h1 className="text-black font-bold text-4xl">Mail Sent.</h1>)}
  </div>
       )} 
    </div>
  );
}
