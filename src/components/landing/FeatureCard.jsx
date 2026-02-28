import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon: Icon, title, description, color, index }) {
  const colorClasses = {
    cyan: {
      bg: 'bg-[#00E5FF]/10',
      border: 'border-[#00E5FF]/20',
      text: 'text-[#00E5FF]',
      glow: 'group-hover:shadow-[#00E5FF]/20'
    },
    violet: {
      bg: 'bg-[#8B5FFF]/10',
      border: 'border-[#8B5FFF]/20',
      text: 'text-[#8B5FFF]',
      glow: 'group-hover:shadow-[#8B5FFF]/20'
    },
    lime: {
      bg: 'bg-[#39FF14]/10',
      border: 'border-[#39FF14]/20',
      text: 'text-[#39FF14]',
      glow: 'group-hover:shadow-[#39FF14]/20'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, rotateY: 5 }}
      className="group relative"
    >
      <div className={`
        relative p-6 rounded-2xl 
        bg-[#1F2937]/40 backdrop-blur-xl 
        border border-white/5
        hover:border-white/10
        transition-all duration-300
        ${colors.glow}
        hover:shadow-lg
      `}>
        {/* Icon */}
        <div className={`
          w-12 h-12 rounded-xl 
          ${colors.bg} ${colors.border} border
          flex items-center justify-center mb-4
          group-hover:scale-110 transition-transform
        `}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{description}</p>

        {/* Hover glow */}
        <div className={`
          absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100
          transition-opacity pointer-events-none
          bg-gradient-to-br from-transparent via-white/5 to-transparent
        `} />
      </div>
    </motion.div>
  );
}