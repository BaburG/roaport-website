"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation'
import { Button } from './ui/button';
import { getLocale } from '@/i18n';

const navItems = [
  { href: '/', label: { en: 'Homepage', tr: 'Ana Sayfa' } },
  { href: '/reports', label: { en: 'Reports', tr: 'Bildiriler' } },
  { href: '/map', label: { en: 'Map', tr: 'Harita' } },
];

export function Header() {
  const pathname = usePathname() || '';
  const router = useRouter();
  const locale = getLocale(pathname);
  
  // Handle language change
  const handleLanguageChange = () => {
    const newLocale = locale === 'en' ? 'tr' : 'en';
    // Keep the same path but change the locale
    const path = pathname.split('/').slice(2).join('/');
    router.push(`/${newLocale}/${path}`);
  };

  return (
    <header className="px-10 bg-background sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold">Hazard Reports</span>
          </Link>
          <nav className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className={cn(
                  "flex items-center text-sm font-medium text-muted-foreground",
                  pathname.endsWith(item.href) && "text-foreground"
                )}
              >
                {item.label[locale]}
              </Link>
            ))}
          </nav>
        </div>
        <Button variant="outline" onClick={handleLanguageChange}>
          {locale === 'en' ? 'Türkçe' : 'English'}
        </Button>
      </div>
    </header>
  )
}
