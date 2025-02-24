import Image from 'next/image';
import Link from 'next/link';

import { allPosts } from '@/.contentlayer/generated';
import PageTitle from '@/components/page-title';

export default function BlogPage() {
  return (
    <section className="flex flex-col gap-8">
      <PageTitle
        title="💭 Blog."
        description="Learning & growing with my thoughts on programming"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {allPosts
          .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
          .map((blog) => (
            <Link
              href={`/blog/${blog.slug}`}
              key={blog.slug}
              className="flex flex-col pt-3 pb-5 px-3 rounded-xl bg-black-lighter border border-black transition-all hover:scale-105 cursor-pointer hover:bg-blue-lighter dark:bg-gray-lighter dark:border-gray-light"
            >
              <time className="w-fit mb-3 ml-auto px-1 py-0.5 bg-blue-lighter text-gray text-xs dark:bg-orange-light dark:text-white">
                {blog.date}
              </time>
              <Image
                unoptimized
                width={250}
                height={250}
                src={blog.thumbnailUrl}
                alt={blog.title}
                className="object-cover w-full h-full max-h-60 md:max-h-[200px] rounded-lg"
              />
              <div className="pt-3">
                <p className="font-bold text-lg leading-6 line-clamp-2 break-keep">
                  {blog.title}
                </p>
                {blog.description && (
                  <p className="pt-1 text-sm tracking-tight line-clamp-2">
                    {blog.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
      </div>
    </section>
  );
}
