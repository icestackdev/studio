
"use client";

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from './ui/label';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onSelectChange = (value: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${value}`);
    router.replace(newPath);
  };

  return (
    <div className="space-y-2">
        <Label className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4" />
            Language
        </Label>
        <Select defaultValue={locale} onValueChange={onSelectChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="km">Khmer</SelectItem>
            </SelectContent>
        </Select>
    </div>
  );
}
