import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BRAND_LOGO_PATH } from '../data/images';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-white/70 via-[#F3F7FF]/70 to-[#DFECFF]/70 dark:from-[#070B16]/40 dark:to-[#0C1530]/40 flex items-center justify-center px-4 py-20">
      <div className="relative z-[2] max-w-lg text-center space-y-6">
        <img
          src={BRAND_LOGO_PATH}
          alt="PRIME COMPUTER ACCESSORIES"
          className="h-16 w-auto object-contain mx-auto dark:rounded-xl dark:bg-white dark:px-3 dark:py-1"
        />
        <p className="font-mono-num text-6xl font-semibold bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] bg-clip-text text-transparent">
          404
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-[#0B1220] dark:text-white">
          Page Not Found
        </h1>
        <p className="text-sm text-[#4B5563] dark:text-slate-300">
          The hardware link you followed does not exist. Let’s take you back to the flagship catalog.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="btn-shine inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0A5CFF] to-[#19C3FF] px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-[#CBD5E1] dark:border-white/15 bg-white dark:bg-[#0C1530] px-6 py-3 text-sm font-semibold text-[#0B1220] dark:text-white"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
};
