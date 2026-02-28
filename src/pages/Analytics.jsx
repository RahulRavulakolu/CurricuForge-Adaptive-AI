import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  Sparkles, ArrowLeft, BarChart3, PieChart as PieChartIcon,
  TrendingUp, BookOpen, GraduationCap, Layers, Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AcademicRiskPredictor from '@/components/analytics/AcademicRiskPredictor';
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, 
  XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid
} from 'recharts';

export default function Analytics() {
  const { data: curriculaData = { items: [] } } = useQuery({
    queryKey: ['curricula'],
    queryFn: () => base44.entities.Curriculum.list(),
  });

  // Extract arrays from the response objects
  const curriculaArray = Array.isArray(curriculaData?.items) ? curriculaData.items : [];
  
  // For courses, we'll extract them from curricula since Course entity doesn't exist
  const coursesArray = curriculaArray.reduce((acc, curriculum) => {
    if (curriculum.semesters) {
      curriculum.semesters.forEach(semester => {
        if (semester.courses) {
          semester.courses.forEach(course => {
            acc.push({
              ...course,
              curriculumId: curriculum.id,
              semesterNumber: semester.number
            });
          });
        }
      });
    }
    return acc;
  }, []);

  // Calculate stats
  const totalCurricula = curriculaArray.length;
  const totalCourses = coursesArray.length;
  const avgSemesters = curriculaArray.length > 0 
    ? Math.round(curriculaArray.reduce((sum, c) => sum + (c.semester_count || c.semesters?.length || 0), 0) / curriculaArray.length)
    : 0;

  // Level distribution
  const levelDistribution = curriculaArray.reduce((acc, c) => {
    acc[c.level] = (acc[c.level] || 0) + 1;
    return acc;
  }, {});
  const levelData = Object.entries(levelDistribution).map(([name, value]) => ({ name, value }));

  // Skills distribution
  const skillDistribution = curriculaArray.reduce((acc, c) => {
    if (c.skill) {
      const skill = c.skill.split(' ')[0]; // Take first word
      acc[skill] = (acc[skill] || 0) + 1;
    }
    return acc;
  }, {});
  const skillData = Object.entries(skillDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Monthly trend (mock data for demo)
  const trendData = [
    { month: 'Sep', curricula: 3 },
    { month: 'Oct', curricula: 5 },
    { month: 'Nov', curricula: 8 },
    { month: 'Dec', curricula: 12 },
    { month: 'Jan', curricula: 18 },
    { month: 'Feb', curricula: totalCurricula },
  ];

  const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#06B6D4'];

  /**
   * @type {React.FC<{active?: boolean; payload?: any[]; label?: any}>}
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="px-3 py-2 rounded-lg bg-[#1F2937] border border-white/10 text-sm">
          <p className="text-white">{label || payload[0].name}: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#111827] via-[#0B1020] to-[#020617]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0B1020]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Generator')} className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Analytics Dashboard</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Curricula', value: totalCurricula, icon: BookOpen, color: '#6366F1' },
            { label: 'Total Courses', value: totalCourses, icon: Layers, color: '#8B5CF6' },
            { label: 'Avg Semesters', value: avgSemesters, icon: Target, color: '#EC4899' },
            { label: 'Programs', value: Object.keys(levelDistribution).length, icon: GraduationCap, color: '#F59E0B' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
            >
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Level Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-[#8B5CF6]" />
              Program Level Distribution
            </h2>
            {levelData.length > 0 ? (
              <div className="flex items-center gap-8">
                <div className="w-48 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={levelData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {levelData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      {/* @ts-ignore - Recharts Tooltip content type checking */}
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-3">
                  {levelData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-gray-300">{item.name}</span>
                      </div>
                      <span className="font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No data available yet
              </div>
            )}
          </motion.div>

          {/* Skills Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#6366F1]" />
              Top Skills
            </h2>
            {skillData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis 
                      type="category" 
                      dataKey="name" 
                      width={100}
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    {/* @ts-ignore - Recharts Tooltip content type checking */}
                    <Tooltip content={<CustomTooltip />} />
                    {/* @ts-ignore - Recharts Bar radius accepts array */}
                    <Bar 
                      dataKey="value" 
                      fill="#6366F1"
                      radius={[0, 4, 4, 0]}
                      background={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No data available yet
              </div>
            )}
          </motion.div>

          {/* Generation Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
          >
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#10B981]" />
              Curriculum Generation Trend
            </h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  {/* @ts-ignore - Recharts Tooltip content type checking */}
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="curricula" 
                    stroke="#6366F1" 
                    strokeWidth={3}
                    dot={{ fill: '#6366F1', strokeWidth: 0 }}
                    activeDot={{ fill: '#6366F1', strokeWidth: 0, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

      {/* Academic Risk Predictor */}
      {curriculaArray.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8"
        >
          <AcademicRiskPredictor curriculum={curriculaArray[0]} />
        </motion.div>
      )}
    </main>
  </div>
);
}