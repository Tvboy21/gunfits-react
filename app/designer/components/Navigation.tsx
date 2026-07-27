'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS } from '../utils/constants';
import { ApparelSide } from '../types';

interface TabNavigationProps {
  activeSide: ApparelSide;
  onSideChange: (side: ApparelSide) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeSide, onSideChange }) => {
  const sides: ApparelSide[] = ['front', 'back', 'sleeve'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2 p-2 rounded-lg bg-opacity-50 backdrop-blur"
      style={{ backgroundColor: `${BRAND_COLORS.dark}80` }}
    >
      {sides.map((side) => (
        <motion.button
          key={side}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSideChange(side)}
          className="relative px-4 py-2 text-xs font-bold uppercase rounded transition-all"
          style={{
            color: activeSide === side ? BRAND_COLORS.dark : BRAND_COLORS.orange,
          }}
        >
          {activeSide === side && (
            <motion.div
              layoutId="tab-highlight"
              className="absolute inset-0 rounded"
              style={{ backgroundColor: BRAND_COLORS.orange }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            />
          )}
          <span className="relative z-10">{side}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export const ResponsiveCanvas: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {children}
    </div>
  );
};

interface FloatingActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant = 'primary',
}) => {
  const colors = {
    primary: { bg: BRAND_COLORS.orange, text: BRAND_COLORS.dark },
    secondary: { bg: BRAND_COLORS.blue, text: BRAND_COLORS.dark },
    danger: { bg: '#ff6666', text: BRAND_COLORS.dark },
  };

  const colorScheme = colors[variant];

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold md:static md:w-auto md:h-auto md:px-4 md:py-2 md:rounded"
      style={{
        backgroundColor: colorScheme.bg,
        color: colorScheme.text,
      }}
      title={label}
    >
      {icon}
    </motion.button>
  );
};
