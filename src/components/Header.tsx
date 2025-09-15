import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-sm border-b z-40 max-w-lg mx-auto">
      <div className="flex items-center h-full px-4">
        <Link href="/" className="text-xl font-bold tracking-tighter">
          ThreadLine
        </Link>
      </div>
    </header>
  );
}
