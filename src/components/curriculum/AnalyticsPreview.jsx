import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

export default function AnalyticsPreview({ analytics }) {
  const skillData = analytics?.skill_coverage 
    ? Object.entries(analytics.skill_coverage).map(([name, value]) => ({ name, value }))
    : [];

  const bloomsData = analytics?.blooms_distribution
    ? Object.entries(analytics.blooms_distribution).map(([name, value]) => ({ 
        name: name.charAt(0).toUpperCase() + name.slice(1), 
        value 
      }))
    : [];

  const COLORS = ['#00E5FF', '#8B5FFF', '#39FF14', '#FF6B6B', '#FFE66D', '#4ECDC4'];

  /**
   * @type {React.FC<{active?: boolean; payload?: any[]}>}
   */
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-3 py-2 rounded-lg bg-[#1F2937] border border-white/10 text-sm">
          <p className="text-white">{payload[0].name}: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Skill Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <h3 className="text-lg font-semibold mb-4">Skill Coverage</h3>
        <div className="flex items-center gap-6">
          <div className="w-32 h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={skillData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                {/* @ts-ignore - Recharts Tooltip content type checking */}
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-2">
            {skillData.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-300 capitalize">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bloom's Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <h3 className="text-lg font-semibold mb-4">Bloom's Taxonomy Distribution</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={bloomsData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={80}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              {/* @ts-ignore - Recharts Tooltip content type checking */}
              <Tooltip content={<CustomTooltip />} />
              {/* @ts-ignore - Recharts Bar radius accepts array */}
              <Bar 
                dataKey="value" 
                fill="#00E5FF"
                radius={[0, 4, 4, 0]}
                background={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}