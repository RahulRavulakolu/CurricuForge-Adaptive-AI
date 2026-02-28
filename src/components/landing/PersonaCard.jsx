import React from 'react';
import { motion } from 'framer-motion';

export default function PersonaCard({ role, quote, icon: Icon, color, index }) {
  const colorMap = {
    cyan: '#00E5FF',
    violet: '#8B5FFF',
    lime: '#39FF14'
  };

  const colorValue = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ scale: 1.02 }}
      className="group"
    >
      <div className="relative p-8 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all">
        {/* Avatar ring */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative w-20 h-20 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${colorValue}20, transparent)`,
              boxShadow: `0 0 30px ${colorValue}20`
            }}
          >
            <div 
              className="absolute inset-1 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, ${colorValue}, transparent, ${colorValue})`,
                opacity: 0.3
              }}
            />
            <div className="relative w-16 h-16 rounded-full bg-[#0B1020] flex items-center justify-center">
              <Icon 
                className="w-8 h-8"
                style={{ color: colorValue }}
              />
            </div>
          </div>
        </div>

        {/* Role */}
        <h3 className="text-lg font-semibold text-white text-center mb-4">{role}</h3>

        {/* Quote */}
        <div className="relative">
          <span 
            className="absolute -top-2 -left-2 text-4xl opacity-20"
            style={{ color: colorValue }}
          >
            "
          </span>
          <p className="text-gray-400 text-center italic pl-4">{quote}</p>
        </div>

        {/* Bottom accent */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 rounded-t-full opacity-50 group-hover:opacity-100 transition-opacity"
          style={{ background: `linear-gradient(to right, transparent, ${colorValue}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}