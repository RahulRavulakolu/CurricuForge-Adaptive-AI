import React from 'react';
import { motion } from 'framer-motion';

export default function StepCard({ number, title, description, icon: Icon, index }) {
  const colors = ['#00E5FF', '#8B5FFF', '#39FF14'];
  const color = colors[index % colors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2 }}
      whileHover={{ y: -10, rotateY: 5 }}
      className="group relative"
    >
      <div 
        className="relative p-8 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all duration-300"
        style={{
          boxShadow: `0 0 0 0 ${color}00`,
        }}
      >
        {/* Number badge */}
        <div 
          className="absolute -top-4 -left-4 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
          style={{
            background: `linear-gradient(135deg, ${color}20, ${color}10)`,
            border: `1px solid ${color}30`,
            color: color
          }}
        >
          {number}
        </div>

        {/* Icon */}
        <div 
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
          style={{
            background: `linear-gradient(135deg, ${color}15, transparent)`,
            border: `1px solid ${color}20`
          }}
        >
          <Icon className="w-8 h-8" style={{ color }} />
        </div>

        {/* Content */}
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400 leading-relaxed">{description}</p>

        {/* Connector line (except last) */}
        {index < 2 && (
          <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gradient-to-r from-white/20 to-transparent" />
        )}

        {/* Hover glow */}
        <div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            boxShadow: `0 0 40px ${color}20`
          }}
        />
      </div>
    </motion.div>
  );
}