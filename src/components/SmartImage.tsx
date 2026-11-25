import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  fallbackLabel?: string;
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  eager = false,
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#EAF2FF] via-[#F3F7FF] to-[#E2EEFF] dark:from-[#0C1530] dark:to-[#070B16] text-[#1F5BFF] p-4 text-center"
      >
        <div className="w-11 h-11 rounded-2xl bg-white/80 dark:bg-white/10 flex items-center justify-center shadow-sm">
          <Cpu className="w-5 h-5" />
        </div>
        <span className="text-xs font-medium text-[#4B5563] dark:text-slate-300 line-clamp-2 max-w-[160px]">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Skeleton Shimmer Loader while image decodes */}
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[#EAF1FF] dark:bg-[#0D1A3B] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/55 dark:via-white/10 to-transparent animate-shimmer" />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setHasError(true)}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
