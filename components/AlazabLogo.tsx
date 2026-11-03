/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AlazabLogoProps {
  size?: number | string;
  className?: string;
  showText?: boolean;
}

export const AlazabLogo: React.FC<AlazabLogoProps> = ({ size = 64, className = '', showText = false }) => {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-[0_4px_14px_rgba(252,163,17,0.4)]"
      >
        <defs>
          {/* Main Gold Facet Gradient based on #FCA311 */}
          <linearGradient id="goldGradientLeft" x1="15%" y1="100%" x2="50%" y2="0%">
            <stop offset="0%" stopColor="#A85E00" />
            <stop offset="30%" stopColor="#FCA311" />
            <stop offset="70%" stopColor="#FFDE8A" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Right Gold Facet Gradient */}
          <linearGradient id="goldGradientRight" x1="50%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#FFDE8A" />
            <stop offset="65%" stopColor="#FCA311" />
            <stop offset="100%" stopColor="#8C4D00" />
          </linearGradient>

          {/* Bottom Gold Crossbar Facet */}
          <linearGradient id="goldGradientBottom" x1="20%" y1="80%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#D98200" />
            <stop offset="50%" stopColor="#FFD370" />
            <stop offset="100%" stopColor="#9E5800" />
          </linearGradient>

          {/* Inner Shadow Filter */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Triangle A Geometric Structure with Faceted Bevels */}
        {/* Left Leg */}
        <path
          d="M50 12 L16 82 L34 82 L50 48 Z"
          fill="url(#goldGradientLeft)"
        />

        {/* Right Leg */}
        <path
          d="M50 12 L84 82 L66 82 L50 48 Z"
          fill="url(#goldGradientRight)"
        />

        {/* Bottom Horizontal Bar */}
        <path
          d="M31 70 L69 70 L60 84 L40 84 Z"
          fill="url(#goldGradientBottom)"
        />

        {/* Specular Apex Highlight */}
        <polygon
          points="50,12 44,25 56,25"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Inner geometric core accent in deep Black */}
        <polygon
          points="50,48 37,70 63,70"
          fill="#000000"
          opacity="0.98"
        />
      </svg>

      {showText && (
        <div className="flex flex-col text-right">
          <div className="flex items-center gap-1.5 leading-none">
            <span className="text-xl font-extrabold tracking-wider text-[#FFFFFF]">ALAZAB</span>
            <span className="text-xl font-extrabold tracking-wider text-[#FCA311]">CLOUD</span>
          </div>
          <span className="text-[11px] text-[#E5E5E5] font-medium mt-1">
            الواجهة الرقمية المركزية
          </span>
        </div>
      )}
    </div>
  );
};
