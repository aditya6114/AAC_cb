"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  sender: "user" | "bot";
  text: string;
}


const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! Please upload a PDF to get started." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [namespace, setNamespace] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: `Uploaded: ${file.name}` },
      { sender: "bot", text: "Processing your PDF..." },
    ]);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.namespace) {
        setNamespace(data.namespace);
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: `PDF processed! You can now ask questions about: ${file.name}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Failed to process PDF. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "There was an error uploading the PDF." },
      ]);
    } finally {
      setUploading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !namespace) return;
    const userMessage = { sender: "user" as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input, namespace }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.response || data.answer || "Sorry, I didn't get that." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "There was an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 rounded-2xl shadow-lg bg-white flex flex-col overflow-hidden font-sans">
      <div className="bg-blue-600 text-white py-4 px-6 text-lg font-semibold text-center">AI ChatBot</div>
      <div className="flex flex-col items-center gap-2 p-3 bg-gray-100 border-b border-gray-200">
        <label className="block">
          <span className="sr-only">Upload PDF</span>
          <input
            type="file"
            accept="application/pdf"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            onChange={handleUpload}
            disabled={uploading || loading}
          />
        </label>
        {uploading && <span className="text-blue-600 text-sm">Uploading and processing PDF...</span>}
        {namespace && <span className="text-green-600 text-xs">PDF ready! You can chat now.</span>}
      </div>
  <div className="p-4 flex flex-col gap-3 h-96 overflow-y-scroll bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`px-4 py-2 rounded-2xl max-w-[75%] text-base mb-1 break-words shadow-sm ${
              msg.sender === "user"
                ? "self-end bg-blue-600 text-white"
                : "self-start bg-gray-200 text-gray-900"
            }`}
          >
            {msg.sender === "bot" ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {msg.text}
              </ReactMarkdown>
            ) : (
              msg.text
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form className="flex border-t border-gray-200 p-3 bg-gray-100" onSubmit={sendMessage}>
        <input
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-base outline-none mr-2 text-gray-900 bg-white"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={namespace ? "Type your message..." : "Upload a PDF to start chatting..."}
          disabled={loading || uploading || !namespace}
        />
        <button
          className="bg-blue-600 rounded-full px-6 py-2 text-base font-medium transition-colors duration-200 hover:bg-blue-700 disabled:opacity-60"
          type="submit"
          disabled={loading || uploading || !input.trim() || !namespace}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
