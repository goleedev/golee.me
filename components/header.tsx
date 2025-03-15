'use client';

import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import ThemeSwitch from './theme-switch';

export default function Header() {
  const pathname = usePathname();

  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const activePath = (href: string) =>
    href === pathname || (href !== '/' && pathname.startsWith(href));

  const NavLink = ({ title, href }: { title: string; href: string }) => (
    <li className="group relative font-mono">
      <Link href={href}>
        <span
          className={`w-fit ${
            activePath(href) &&
            'font-bold underline decoration-orange-light dark:decoration-blue decoration-4'
          }`}
        >
          {title}
        </span>
      </Link>
    </li>
  );

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const FloatHeader = () => (
    <header
      className={`fixed bottom-5 right-5 p-4 flex flex-col bg-white dark:bg-black border border-gray-light z-50 animate-in ease-in-out ${
        isMenuOpen
          ? 'rounded-xl w-32 h-fit justify-evenly gap-3 slide-in-from-bottom duration-200'
          : 'rounded-full w-10 h-10 items-center justify-center fade-in-0 duration-500'
      }`}
    >
      <div className="flex justify-between">
        <button type="button" onClick={toggleMenu}>
          {isMenuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
        </button>
        {isMenuOpen && <ThemeSwitch />}
      </div>
      {isMenuOpen && (
        <nav>
          <ul className="flex flex-col gap-2">
            <NavLink title="Home" href="/" />
            <NavLink title="Blog" href="/blog" />
            <NavLink title="Mentorship" href="/mentorship" />
            {/* <NavLink title="Projects" href="/projects" /> */}
          </ul>
        </nav>
      )}
    </header>
  );

  const MainHeader = () => (
    <header className="fixed w-full flex max-w-screen-md px-4 justify-between py-5 z-50 bg-transparent">
      <nav>
        <ul className="flex space-x-4">
          <NavLink title="Home" href="/" />
          <NavLink title="Blog" href="/blog" />
          <NavLink title="Mentorship" href="/mentorship" />
          {/* <NavLink title="Projects" href="/projects" /> */}
        </ul>
      </nav>
      <ThemeSwitch />
    </header>
  );

  return (
    <section>
      <div className="hidden sm:block">
        {isScrolled ? <FloatHeader /> : <MainHeader />}
      </div>
      <div className="sm:hidden">
        <FloatHeader />
      </div>
    </section>
  );
}
