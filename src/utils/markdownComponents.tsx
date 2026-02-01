import type { Components } from 'react-markdown';
import { CodeBlockWithCopy } from '../components/windows/blog/CodeBlockWithCopy';

export const markdownComponents = (postSlug: string): Components => ({
  h1: ({ children }) => (
    <h1 className="text-3xl font-medium text-gray-900 mt-8 mb-4">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl font-medium text-gray-900 mt-8 mb-4">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl font-medium text-gray-900 mt-6 mb-3">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-blue-600 hover:text-blue-800 underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  img: ({ src, alt }) => {
    let imageSrc = src || '';

    if (!imageSrc.startsWith('/') && !imageSrc.startsWith('http')) {
      imageSrc = `/posts/${postSlug}/${imageSrc}`;
    }

    return (
      <img src={imageSrc} alt={alt || ''} className="w-full rounded-lg my-6" />
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700 my-4">
      {children}
    </blockquote>
  ),
  code: ({
    inline,
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement> & {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';

    if (inline || !language) {
      return (
        <code
          className="bg-gray-100 px-2 py-1 rounded text-sm font-mono"
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          }}
          {...props}
        >
          {children}
        </code>
      );
    }
    return <CodeBlockWithCopy>{children}</CodeBlockWithCopy>;
  },
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 marker:text-gray-500">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 marker:text-gray-500">{children}</ol>
  ),
  li: ({ children }) => <li className="text-gray-700 leading-relaxed">{children}</li>,
  hr: () => <hr className="my-8 border-gray-300" />,
  strong: ({ children }) => (
    <strong className="font-semibold">{children}</strong>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  table: ({ children }) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border-collapse border border-gray-300">
        {children}
      </table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-4 py-2">{children}</td>
  ),
});
