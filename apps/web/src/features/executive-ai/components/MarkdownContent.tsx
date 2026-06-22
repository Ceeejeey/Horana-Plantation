import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <div className="text-zinc-100 leading-relaxed font-sans space-y-2.5 break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="text-xs sm:text-xs font-serif font-bold text-[#C5A059] tracking-wide mt-3 mb-1 leading-normal uppercase">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xs font-serif font-bold text-[#C5A059] tracking-wide mt-2.5 mb-1 leading-normal uppercase">{children}</h2>,
          h3: ({ children }) => <h3 className="text-[11.5px] font-sans font-bold text-white tracking-wide mt-2 mb-1 leading-normal uppercase">{children}</h3>,
          p: ({ children }) => <p className="mb-1.5 last:mb-0 leading-relaxed text-[12px] sm:text-[13px] text-zinc-200">{children}</p>,
          ul: ({ children }) => <ul className="pl-4 list-disc space-y-1 my-2 text-[12px] sm:text-[13px] text-zinc-200">{children}</ul>,
          ol: ({ children }) => <ol className="pl-4 list-decimal space-y-1 my-2 text-[12px] sm:text-[13px] text-zinc-200">{children}</ol>,
          li: ({ children }) => <li className="pl-0.5 text-zinc-200 leading-relaxed list-item">{children}</li>,
          strong: ({ children }) => <span className="font-semibold text-[#C5A059]">{children}</span>,
          code: ({ children }) => <code className="px-1.5 py-0.5 rounded font-mono text-[9.5px] bg-black/55 text-[#C5A059] border border-[#C5A059]/15 inline-block">{children}</code>,
          blockquote: ({ children }) => <blockquote className="border-l-2 border-[#C5A059]/40 pl-3.5 my-2 italic text-zinc-400 text-[11px] sm:text-xs leading-relaxed bg-[#C5A059]/5 py-1 pr-2 rounded-r">{children}</blockquote>,
          table: ({ children }) => (
            <div className="w-full overflow-x-auto my-3 border border-[#C5A059]/20 rounded-xl bg-black/55 shadow-md">
              <table className="w-full text-left text-[11px] sm:text-xs font-sans border-collapse">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#C5A059]/10 border-b border-[#C5A059]/20 font-mono text-[9px] uppercase tracking-wider text-[#C5A059]">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-white/5 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-3.5 py-2.5 font-bold border-r border-[#C5A059]/10 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3.5 py-2 border-r border-white/5 last:border-r-0 leading-relaxed break-words whitespace-nowrap sm:whitespace-normal">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
export default MarkdownContent;
