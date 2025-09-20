import { useState } from 'react';

export const CodeBlockWithCopy = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text =
      typeof children === 'string'
        ? children
        : Array.isArray(children)
        ? children.join('')
        : children?.toString() || '';

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative group my-4">
      <pre
        className="bg-gray-100 p-4 rounded-lg overflow-x-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af #e5e7eb',
        }}
      >
        <code className="text-sm font-mono">{children}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        title="Copy code"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};
