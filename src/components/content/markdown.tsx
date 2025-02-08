'use client';

import { stegaClean } from 'next-sanity';
import ReactMarkdown from 'react-markdown';

import { useStegaValueDecode } from '@/hooks/stega';

export function Markdown({ value }: { value?: string }) {
  const stegaDecoded = useStegaValueDecode(value);
  return (
    <div data-sanity={stegaDecoded || undefined}>
      <ReactMarkdown>{stegaClean(value)}</ReactMarkdown>
    </div>
  );
}
