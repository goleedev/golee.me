import { FrownIcon } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="w-full flex flex-col items-center justify-center text-center max-w-screen-md min-h-[calc(100vh-200px)]">
      <FrownIcon size={40} className="text-gray-400" />
      <h2 className="text-xl font-semibold font-mono tracking-tighter">
        404 Not Found
      </h2>
      <p>Could not find the blog post.</p>
      <Link
        href={'/blog'}
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors bg-orange hover:bg-orange-light dark:bg-blue dark:hover:bg-blue-light"
      >
        Go Back
      </Link>
    </section>
  );
}
