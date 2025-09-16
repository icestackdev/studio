
import {createLocalizedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'km'] as const;

export const {Link, redirect, usePathname, useRouter} =
  createLocalizedPathnamesNavigation({locales});
