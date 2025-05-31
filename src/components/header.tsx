"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { getLocale } from '@/i18n';
import { ThemeToggle } from './theme-toggle';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from './ui/sheet';
import { useState } from 'react';

const navItems = [
  { href: '/', label: { en: 'Homepage', tr: 'Ana Sayfa' } },
  { href: '/reports', label: { en: 'Reports', tr: 'Bildiriler' } },
  { href: '/map', label: { en: 'Map', tr: 'Harita' } },
];

export function Header() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const locale = getLocale(pathname);
  const [isOpen, setIsOpen] = useState(false);
  
  const handleLanguageChange = () => {
    const newLocale = locale === 'en' ? 'tr' : 'en';
    const path = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${path}`);
    setIsOpen(false);
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={`/${locale}${item.href}`}
          className={cn(
            "flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors",
            pathname.endsWith(item.href) && "text-foreground"
          )}
          onClick={() => setIsOpen(false)}
        >
          {item.label[locale]}
        </Link>
      ))}
    </>
  );

  return (
    <header className="bg-background sticky top-0 z-40 w-full border-b">
      <div className="w-full px-4 md:px-10 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold">Hazard Reports</span>
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLinks />
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <NavLinks />
                <div className="flex flex-col gap-4 mt-4">
                  <Button variant="outline" onClick={handleLanguageChange}>
                    {locale === 'en' ? 'Türkçe' : 'English'}
                  </Button>
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" onClick={handleLanguageChange}>
              {locale === 'en' ? 'Türkçe' : 'English'}
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}