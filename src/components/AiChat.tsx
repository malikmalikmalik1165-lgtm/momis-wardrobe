"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, MessageCircle } from "lucide-react";
import { findAnswer } from "@/lib/ai-knowledge";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  time: string;
}

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const hidden = pathname.startsWith("/admin") || pathname.startsWith("/team");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const getTime = () => new Date().toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" });

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setMessages([{
        id: 1,
        text: "Assalam o Alaikum! 🌸 Main Momi hoon — Momis Wardrobe ki AI assistant.\n\nAap mujh se pooch sakte hain:\n• 🚚 Delivery info\n• 🔄 Return policy\n• 📦 Order tracking\n• 💼 Team earning\n• 👗 Products\n• 📏 Size guide\n\nKya help chahiye?",
        sender: "bot",
        time: getTime(),
      }]);
    }
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user", time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI thinking delay
    const delay = 400 + Math.random() * 800;
    setTimeout(() => {
      const answer = findAnswer(text);
      const botMsg: Message = { id: Date.now() + 1, text: answer, sender: "bot", time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      setTyping(false);
    }, delay);
  };

  // Parse links in text
  const renderText = (text: string) => {
    const parts = text.split(/(\/[a-z-?=&]+|https?:\/\/[^\s]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith("/")) {
        return (
          <Link key={i} href={part} onClick={() => setOpen(false)}
            className="text-rose-500 underline hover:text-rose-600 font-medium">
            {part}
          </Link>
        );
      }
      if (part.startsWith("http")) {
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer"
            className="text-rose-500 underline hover:text-rose-600 font-medium break-all">
            Link ↗
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (hidden) return null;

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 sm:bottom-24 right-3 sm:right-6 z-[80] w-[calc(100%-1.5rem)] sm:w-[380px] animate-fade-in-up">
          <div className="bg-white rounded-2xl shadow-2xl border border-warm-gray-100 overflow-hidden flex flex-col" style={{ height: "min(520px, 70vh)" }}>
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Momi AI ✨</h3>
                  <p className="text-white/70 text-[10px]">Momis Wardrobe Assistant</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white p-1">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-warm-gray-50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${
                    msg.sender === "user"
                      ? "bg-rose-500 text-white rounded-2xl rounded-tr-sm"
                      : "bg-white text-warm-gray-800 rounded-2xl rounded-tl-sm shadow-sm border border-warm-gray-100"
                  } px-4 py-2.5`}>
                    {msg.sender === "bot" && (
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles size={10} className="text-rose-400" />
                        <span className="text-[9px] text-rose-400 font-semibold">MOMI AI</span>
                      </div>
                    )}
                    <p className="text-[13px] leading-relaxed whitespace-pre-line">
                      {msg.sender === "bot" ? renderText(msg.text) : msg.text}
                    </p>
                    <p className={`text-[9px] mt-1 ${msg.sender === "user" ? "text-white/60" : "text-warm-gray-300"} text-right`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-2xl rounded-tl-sm shadow-sm border border-warm-gray-100 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-warm-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-warm-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-warm-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Quick buttons */}
            {messages.length <= 1 && (
              <div className="px-3 py-2 bg-white border-t border-warm-gray-50 flex gap-1.5 overflow-x-auto flex-shrink-0">
                {["Delivery info", "Return policy", "Track order", "How to earn?", "Size guide"].map((q) => (
                  <button key={q} onClick={() => {
                    const userMsg: Message = { id: Date.now(), text: q, sender: "user", time: getTime() };
                    setMessages((prev) => [...prev, userMsg]);
                    setTyping(true);
                    setTimeout(() => {
                      const answer = findAnswer(q);
                      setMessages((prev) => [...prev, { id: Date.now() + 1, text: answer, sender: "bot", time: getTime() }]);
                      setTyping(false);
                    }, 500);
                  }}
                    className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[11px] font-medium whitespace-nowrap hover:bg-rose-100 transition-colors flex-shrink-0">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-3 py-2.5 bg-white border-t border-warm-gray-100 flex gap-2 flex-shrink-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
                placeholder="Apna sawaal likhein..."
                className="flex-1 bg-warm-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 placeholder-warm-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center hover:bg-rose-600 disabled:opacity-30 transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>

            {/* Footer */}
            <div className="px-3 py-1.5 bg-warm-gray-50 text-center flex-shrink-0">
              <p className="text-[9px] text-warm-gray-400">
                Powered by Momi AI • <a href="https://wa.me/923295578925" target="_blank" className="text-green-500">Human help? WhatsApp →</a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-20 sm:bottom-8 right-20 sm:right-24 z-[80] w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-2xl hover:scale-110 transition-all group"
          style={{ boxShadow: "0 4px 25px rgba(244,63,94,0.4)" }}
        >
          <Bot size={24} className="group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white">
            AI
          </span>
        </button>
      )}
    </>
  );
}
