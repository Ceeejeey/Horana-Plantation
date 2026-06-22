import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Bot, Sparkles, AlertCircle, BarChart3, Maximize2, Minimize2, 
  Search, BookOpen, Leaf, Cpu, HeartPulse, ChevronRight, Menu, Send, X
} from "lucide-react";
import { getApiBaseUrl, postGeminiChat } from "@horana/shared";
import { Message } from "../../types/chat";
import { getFilteredTopics, samplePrompts } from "../../data/annualReportTopics";

// Relative imports from the new modular components path
import { ReasoningLoader } from "./components/ReasoningLoader";
import { YearlyProfitChart } from "./components/YearlyProfitChart";
import { DynamicReportChart } from "./components/DynamicReportChart";
import { MarkdownContent } from "./components/MarkdownContent";

// Rich parser to transform text and render graph tags dynamically
const parseAndRenderContent = (text: string) => {
  if (!text) return null;
  
  // Tag regex to identify comparison graphs with custom parameters
  const tagRegex = /<render-comparison-graph\s*([^>]*?)\s*\/?>/i;
  
  if (!tagRegex.test(text)) {
    return <MarkdownContent content={text} />;
  }

  const parts = text.split(tagRegex);
  const renderedElements: React.ReactNode[] = [];
  
  let tempText = text;
  let match;
  
  while ((match = tagRegex.exec(tempText)) !== null) {
    const beforeText = tempText.substring(0, match.index);
    const attrStr = match[1];
    
    if (beforeText) {
      renderedElements.push(<MarkdownContent key={`text-${renderedElements.length}`} content={beforeText} />);
    }
    
    // Parse properties cleanly
    const attrs: Record<string, string> = {};
    const attrRegex = /(\w+)="([^"]*)"|(\w+)='([^']*)'/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrStr)) !== null) {
      if (attrMatch[1]) {
        attrs[attrMatch[1]] = attrMatch[2];
      } else if (attrMatch[3]) {
        attrs[attrMatch[3]] = attrMatch[4];
      }
    }
    
    // If no custom data is passed, fallback to interactive multi-capital metrics chart
    if (!attrs.data) {
      renderedElements.push(
        <YearlyProfitChart key={`chart-${renderedElements.length}`} />
      );
    } else {
      renderedElements.push(
        <DynamicReportChart 
          key={`chart-${renderedElements.length}`}
          title={attrs.title}
          desc={attrs.desc}
          badge={attrs.badge}
          footnote={attrs.footnote}
          dataStr={attrs.data}
        />
      );
    }
    
    tempText = tempText.substring(match.index + match[0].length);
  }
  
  if (tempText) {
    renderedElements.push(<MarkdownContent key={`text-${renderedElements.length}`} content={tempText} />);
  }

  return <div className="space-y-4">{renderedElements}</div>;
};

export function ExecutiveAIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile preset drawer state
  const [searchTerm, setSearchTerm] = useState("");
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Ayubowan! I am the Horana Plantations PLC Executive AI Companion. I am fully integrated with our newest Annual Report details.\n\nI can analyze our agribusiness 6 Capitals metrics, track estate weather parameters, and draw visual comparisons.\n\nSelect any report category on the left side, or type your query below!",
      timestamp: new Date()
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, isFullScreen]);

  const handleSend = async (textToSend?: string) => {
    const rawText = textToSend || inputVal;
    if (!rawText.trim()) return;

    if (!textToSend) setInputVal("");
    // Automatically close mobile preset sidebar if user clicks a topic
    setIsSidebarOpen(false);

    // Auto full screen when entering the second chat query/interaction onwards
    const userMsgsCount = messages.filter(m => m.role === "user").length;
    if (userMsgsCount >= 1) {
      setIsFullScreen(true);
    }

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: rawText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const apiBase = getApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
      const data = await postGeminiChat(apiBase, {
        prompt: rawText,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      });
      const botMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: data.text || "Apologies, I am unable to parse the data matrix at this trigger point.",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      console.error(err);
      const errorMessage: Message = {
        id: Math.random().toString(),
        role: "assistant",
        content: "Operational connection to server is currently throttled. Please try again in brief intervals.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "financial":
        return <BarChart3 className="w-4 h-4 text-amber-400" />;
      case "natural":
        return <Leaf className="w-4 h-4 text-emerald-400" />;
      case "tech":
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case "human":
        return <HeartPulse className="w-4 h-4 text-indigo-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-[#C5A059]" />;
    }
  };

  // Find the exact query typed to pass to ReasoningLoader
  const lastUserQuery = [...messages].reverse().find(m => m.role === "user")?.content || "";

  // Filter topics based on search keyword
  const filteredTopics = getFilteredTopics(searchTerm);

  return (
    <>
      {/* Floating AI trigger — clipped wrapper prevents ping/scale horizontal scroll on mobile */}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 overflow-hidden sm:bottom-6 sm:right-6">
        <button
          id="ai-floating-trigger"
          onClick={() => setIsOpen(!isOpen)}
          className="pointer-events-auto relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-[#C5A059]/40 bg-[#0c1a13] p-0 text-[#C5A059] shadow-[0_12px_40px_rgba(0,0,0,0.6)] transition-all hover:border-[#C5A059] hover:shadow-[#C5A059]/10 active:scale-95 sm:h-auto sm:w-auto sm:p-4 sm:hover:scale-105 cursor-pointer group"
          aria-label="Toggle Executive AI Companion"
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/15 animate-pulse"
            aria-hidden
          />
          <Bot className="relative z-10 h-6 w-6 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
          <span className="relative z-10 hidden max-w-0 overflow-hidden whitespace-nowrap text-xs font-mono font-bold uppercase tracking-widest transition-all duration-300 sm:inline sm:group-hover:max-w-32 sm:group-hover:ml-2">
            EXEC CORE AI
          </span>
        </button>
      </div>

      {/* Primary Executive AI Chat Panel Overlays */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-[#030906]/90 backdrop-blur-2xl ${
              isFullScreen ? "z-[9998]" : "z-[9998] sm:hidden"
            }`}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Custom styled scrollbars specifically for the AI module */}
            <style dangerouslySetInnerHTML={{ __html: `
              .custom-chat-scroll::-webkit-scrollbar {
                width: 6px;
                height: 6px;
              }
              .custom-chat-scroll::-webkit-scrollbar-track {
                background: rgba(4, 15, 9, 0.4);
                border-radius: 9999px;
              }
              .custom-chat-scroll::-webkit-scrollbar-thumb {
                background: rgba(197, 160, 89, 0.35);
                border-radius: 9999px;
                border: 1px solid rgba(197, 160, 89, 0.1);
              }
              .custom-chat-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(197, 160, 89, 0.7);
                box-shadow: 0 0 8px rgba(197, 160, 89, 0.5);
              }
            `}} />

            <motion.div
              id="ai-executive-drawer"
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className={`fixed transition-all duration-300 bg-[#07110c]/98 backdrop-blur-lg border border-[#C5A059]/30 shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.05)] flex flex-col pointer-events-auto overflow-hidden max-w-[100vw] ${
                isFullScreen 
                  ? "inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-10 z-[9999] rounded-[24px] sm:rounded-[32px]" 
                  : "inset-0 w-full h-full max-w-full sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[min(420px,calc(100vw-2rem))] sm:h-[580px] z-[9999] sm:z-50 rounded-none sm:rounded-3xl border-none sm:border"
              }`}
            >
              {/* Header branding */}
              <div className="p-4 bg-gradient-to-r from-[#0a1e14] to-[#040806] border-b border-[#C5A059]/20 flex items-center justify-between z-10 shrink-0">
                <div className="flex items-center gap-2.5">
                  {/* Mobile menu button to slide pre-defined items */}
                  {isFullScreen && (
                    <button
                      type="button"
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      className="md:hidden p-1.5 rounded-lg border border-white/10 text-[#C5A059] hover:bg-white/5 active:scale-95 transition-all cursor-pointer mr-1"
                      title="Toggle Report Index"
                    >
                      <Menu className="w-4 h-4" />
                    </button>
                  )}

                  <div className="p-2 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#C5A059] shrink-0">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-white tracking-wide flex items-center gap-2">
                      {isFullScreen ? "Horana Plantations PLC — Executive Audit Portal" : "Horana Executive Companion"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 mt-0.5 uppercase tracking-widest font-semibold min-w-0">
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500/40 animate-pulse" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      </span>
                      <span className="truncate">Annual Report 2025/26 Matrix</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Full Screen & Close */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsFullScreen(!isFullScreen);
                      setIsSidebarOpen(false);
                    }}
                    className="p-1.5 rounded-lg border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                    title={isFullScreen ? "Exit Fullscreen" : "Maximize Fullscreen Workspace"}
                  >
                    {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsFullScreen(false);
                      setIsSidebarOpen(false);
                    }}
                    className="p-1.5 rounded-lg border border-white/5 text-zinc-400 hover:text-red-400 hover:bg-white/5 transition-all cursor-pointer"
                    aria-label="Close Assistant panel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Inner Dashboard Layout Component */}
              <div className="flex flex-grow w-full overflow-hidden relative">
                
                {/* Mobile sidebar dimmer backdrop */}
                {isFullScreen && isSidebarOpen && (
                  <div 
                    className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 md:hidden transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                  />
                )}

                {/* SIDEBAR PRESENTS PORTAL */}
                <AnimatePresence>
                  {isFullScreen && (
                    <motion.div
                      initial={{ x: -100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", damping: 25, stiffness: 120 }}
                      className={`border-[#C5A059]/15 flex flex-col shrink-0 transition-all duration-300 ${
                        isSidebarOpen 
                          ? "absolute inset-y-0 left-0 w-[280px] sm:w-[320px] bg-[#07110c] z-40 border-r shadow-[5px_0_30px_rgba(0,0,0,0.85)] md:relative md:inset-auto md:w-72 lg:w-80 xl:w-96 md:bg-[#07110c]/80 md:border-r"
                          : "hidden md:flex md:w-72 lg:w-80 xl:w-96 md:bg-[#07110c]/80 md:border-r"
                      }`}
                    >
                      {/* Sidebar Header Category */}
                      <div className="p-4 border-b border-white/5 font-mono">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block">
                            📂 Annual Audit Directory
                          </span>
                          {isSidebarOpen && (
                            <button 
                              type="button"
                              onClick={() => setIsSidebarOpen(false)}
                              className="text-[10px] text-zinc-500 hover:text-white font-mono bg-white/5 rounded px-2 py-0.5 md:hidden border border-white/10 transition-colors"
                            >
                              ✕ Close
                            </button>
                          )}
                        </div>
                        
                        {/* Search Index Filter Input */}
                        <div className="relative mt-2">
                          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                          <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search report guidelines..."
                            className="w-full bg-white/5 border border-white/5 hover:border-white/10 focus:border-[#C5A059]/40 rounded-lg pl-8 pr-3.5 py-2 text-[11px] text-white focus:outline-none placeholder-zinc-500 font-mono"
                          />
                        </div>
                      </div>

                      {/* Pre-defined list elements */}
                      <div className="flex-grow overflow-y-auto p-4 space-y-5 custom-chat-scroll">
                        {filteredTopics.length > 0 ? (
                          filteredTopics.map((cat, catIdx) => (
                            <div key={catIdx} className="space-y-2">
                              <div className="flex flex-col">
                                <span className="text-[10.5px] font-serif font-bold text-zinc-100 flex items-center gap-1.5">
                                  {getTopicIcon(cat.iconType)}
                                  {cat.category}
                                </span>
                              </div>

                              <div className="space-y-1.5 pl-1">
                                {cat.items.map((item, itemIdx) => (
                                  <button
                                    type="button"
                                    key={itemIdx}
                                    onClick={() => handleSend(item.prompt)}
                                    className="w-full text-left p-2.5 rounded-xl border border-white/5 hover:border-[#C5A059]/30 bg-white/0 hover:bg-[#C5A059]/5 transition-all cursor-pointer group flex items-start gap-2.5"
                                  >
                                    <ChevronRight className="w-3 h-3 text-zinc-600 group-hover:text-[#C5A059] shrink-0 mt-0.5 transition-transform group-hover:translate-x-0.5" />
                                    <div className="min-w-0">
                                      <h5 className="text-[10.5px] font-mono text-zinc-300 font-bold leading-tight group-hover:text-white truncate">
                                        {item.title}
                                      </h5>
                                      <p className="text-[9.5px] font-sans text-zinc-500 leading-snug group-hover:text-zinc-400 mt-0.5 line-clamp-2">
                                        {item.desc}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-zinc-600 font-mono text-[10.5px]">
                            <AlertCircle className="w-5 h-5 mx-auto mb-2 text-zinc-700" />
                            No report matches found.
                          </div>
                        )}
                      </div>

                      {/* Footer branding details inside the Sidebar */}
                      <div className="p-3 bg-black/25 border-t border-white/5 mt-auto">
                        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-600">
                          <span>AUDIT BLOCK VERSION 4.2</span>
                          <span className="text-emerald-500 font-bold">VERIFIED</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* CHAT INTERACTIVE WINDOW */}
                <div className="flex flex-col flex-grow h-full overflow-hidden bg-gradient-to-b from-[#07110c]/45 to-[#020504]">
                  
                  {/* Conversation area */}
                  <div className="flex-grow overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4 font-sans text-xs custom-chat-scroll text-zinc-100">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-2 sm:gap-3 min-w-0 ${
                          msg.role === "user" 
                            ? "ml-auto flex-row-reverse max-w-[85%] sm:max-w-[75%]" 
                            : "mr-auto max-w-[96%] sm:max-w-[85%] md:max-w-[80%] w-full"
                        }`}
                      >
                        {msg.role === "assistant" && (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 rounded-xl bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center text-[#C5A059]">
                            <Bot className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                          </div>
                        )}

                        <div
                          className={`p-3.5 sm:p-4 rounded-2xl border min-w-0 max-w-full overflow-hidden ${
                            msg.role === "user"
                              ? "bg-[#C5A059]/10 border-[#C5A059]/25 text-zinc-100 rounded-tr-none"
                              : "bg-white/5 border-white/5 text-zinc-300 rounded-tl-none"
                          }`}
                        >
                          {/* Render customized parser including charts if matched */}
                          {parseAndRenderContent(msg.content)}

                          <span className="block mt-1.5 text-[8px] font-mono text-zinc-500 text-right uppercase">
                            {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <ReasoningLoader userQuery={lastUserQuery} />
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick Suggestion buttons docked below messages when Not Full Screen */}
                  {!isFullScreen && (
                    <div className="px-4 py-2 bg-[#040906]/80 border-t border-white/5 flex flex-wrap gap-2 shrink-0">
                      <span className="text-[8px] font-mono uppercase text-zinc-500 tracking-wider w-full mb-1">
                        EXECUTIVE ANALYST SUGGESTIONS:
                      </span>
                      {samplePrompts.map((p, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => handleSend(p.text)}
                          className="px-2.5 py-1 text-[9px] sm:text-[9.5px] font-mono border border-[#C5A059]/15 hover:border-[#C5A059] bg-[#C5A059]/5 hover:bg-[#C5A059]/10 text-zinc-300 hover:text-[#C5A059] rounded-lg transition-all cursor-pointer text-left max-w-full truncate"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Prompts Input Area */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="p-3.5 sm:p-5 bg-[#030604] border-t border-[#C5A059]/15 flex gap-2 shrink-0 animate-fadeIn"
                  >
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Ask about Horana performance metrics, Rainforest Alliance, LKR 680M profit comparison..."
                      className="flex-grow bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#C5A059]/50 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none placeholder-zinc-500 transition-all font-sans font-medium"
                    />
                    <button
                      type="submit"
                      className="p-3.5 sm:p-4 rounded-xl bg-[#C5A059] text-black hover:bg-[#b08b47] hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-lg shadow-[#C5A059]/10"
                      aria-label="Submit prompt message"
                    >
                      <Send className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
