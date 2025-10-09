import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// shadcn/ui 스타일 유틸: 클래스 병합 + Tailwind 충돌 해소
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

