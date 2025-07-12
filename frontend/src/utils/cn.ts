/**
 * Utility function to merge Tailwind CSS classes
 * This is a simplified version that can be enhanced later with clsx and tailwind-merge
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}