import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            const value = String(children).replace(/\n$/, '');

            return !inline && match ? (
              <CodeBlock language={match[1]} value={value} />
            ) : (
              <code
                className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm"
                {...props}
              >
                {children}
              </code>
            );
          },
          a({ children, href, ...props }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 underline"
                {...props}
              >
                {children}
              </a>
            );
          },
          p({ children }: any) {
            return <p className="mb-4 last:mb-0">{children}</p>;
          },
          ul({ children }: any) {
            return <ul className="list-disc list-inside mb-4">{children}</ul>;
          },
          ol({ children }: any) {
            return <ol className="list-decimal list-inside mb-4">{children}</ol>;
          },
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-4 italic text-gray-700">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
