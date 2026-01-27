'use client';

import React from 'react';
import { useLightbox } from '@/context/LightboxContext';

interface ImageLightboxProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt?: string;
}

export default function ImageLightbox({ src, alt, className, ...props }: ImageLightboxProps) {
  const { openImage } = useLightbox();

  if (!src) return null;

  return (
    <div className="my-6">
      <figure className="flex flex-col items-center">
        <div 
          className="relative overflow-hidden rounded-lg cursor-zoom-in transition-transform hover:scale-[1.01]"
          onClick={() => {
            if (typeof src === 'string') {
              openImage(src, alt);
            }
          }}
        >
          <img
            src={src}
            alt={alt || 'Blog image'}
            className={`rounded-lg max-w-full h-auto object-cover ${className || ''}`}
            {...props}
          />
        </div>
        {alt && (
          <figcaption className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400 italic">
            {alt}
          </figcaption>
        )}
      </figure>
    </div>
  );
}
