'use client';

import React from 'react';
import { BRAND_COLORS } from './utils/constants';

export const DesignerStyles: React.FC = () => {
  return (
    <style>{`
      * {
        box-sizing: border-box;
      }

      html, body {
        margin: 0;
        padding: 0;
        background-color: ${BRAND_COLORS.dark};
        color: ${BRAND_COLORS.text};
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      ::-webkit-scrollbar-track {
        background: ${BRAND_COLORS.dark};
      }

      ::-webkit-scrollbar-thumb {
        background: ${BRAND_COLORS.orange}60;
        border-radius: 4px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: ${BRAND_COLORS.orange}A0;
      }

      /* Input styling */
      input[type="range"] {
        width: 100%;
        height: 4px;
        border-radius: 2px;
        background: linear-gradient(90deg, ${BRAND_COLORS.orange}, ${BRAND_COLORS.blue});
        outline: none;
        -webkit-appearance: none;
      }

      input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${BRAND_COLORS.gold};
        cursor: pointer;
        box-shadow: 0 0 10px ${BRAND_COLORS.orange}80;
      }

      input[type="range"]::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${BRAND_COLORS.gold};
        cursor: pointer;
        border: none;
        box-shadow: 0 0 10px ${BRAND_COLORS.orange}80;
      }

      /* Selection */
      ::selection {
        background-color: ${BRAND_COLORS.orange};
        color: ${BRAND_COLORS.dark};
      }

      /* Button base styles */
      button {
        font-family: inherit;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Canvas container */
      .konva-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      /* Glass morphism */
      .glass {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
      }

      /* Glow effect */
      .glow {
        box-shadow: 0 0 20px ${BRAND_COLORS.orange}40, 0 0 40px ${BRAND_COLORS.maroon}20;
      }

      /* Animation keyframes */
      @keyframes float {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px);
        }
      }

      @keyframes glow-pulse {
        0%, 100% {
          box-shadow: 0 0 20px ${BRAND_COLORS.orange}40;
        }
        50% {
          box-shadow: 0 0 40px ${BRAND_COLORS.orange}80;
        }
      }

      @keyframes grain {
        0%, 100% {
          background-position: 0 0;
        }
        10% {
          background-position: -5% -10%;
        }
        20% {
          background-position: -15% 5%;
        }
      }

      .float {
        animation: float 3s ease-in-out infinite;
      }

      .glow-pulse {
        animation: glow-pulse 2s ease-in-out infinite;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .hidden-sm {
          display: none;
        }

        .sidebar-left {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 999;
          width: 100%;
          height: 100%;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        .sidebar-left.open {
          transform: translateX(0);
        }

        .sidebar-right {
          position: fixed;
          right: 0;
          top: 0;
          z-index: 999;
          width: 100%;
          height: 100%;
          transform: translateX(100%);
          transition: transform 0.3s ease;
        }

        .sidebar-right.open {
          transform: translateX(0);
        }
      }

      /* Loading animation */
      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }

      .spin {
        animation: spin 1s linear infinite;
      }

      /* Smooth transitions */
      * {
        transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
      }
    `}</style>
  );
};
