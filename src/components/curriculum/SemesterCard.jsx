import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Beaker, Layers, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SemesterCard({ semester, isExpanded, onToggle, index }) {
  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'lab': return <Beaker className="w-3 h-3" />;
      case 'mixed': return <Layers className="w-3 h-3" />;
      default: return <BookOpen className="w-3 h-3" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'lab': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'mixed': return 'bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30';
      default: return 'bg-[#8B5FFF]/20 text-[#8B5FFF] border-[#8B5FFF]/30';
    }
  };

  const isOverloaded = semester.total_credits > 18;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5FFF]/20 border border-white/10 flex items-center justify-center">
            <span className="font-bold text-[#00E5FF]">S{semester.number}</span>
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-lg">Semester {semester.number}</h3>
            <p className="text-sm text-gray-400">{semester.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isOverloaded && (
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>High load</span>
            </div>
          )}
          <div className="text-right">
            <div className={`text-lg font-semibold ${isOverloaded ? 'text-yellow-500' : 'text-white'}`}>
              {semester.total_credits} Credits
            </div>
            <div className="text-xs text-gray-500">
              {semester.courses?.length || 0} courses
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </motion.div>
        </div>
      </button>

      {/* Courses */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="p-5 space-y-3">
              {semester.courses?.map((course, idx) => (
                <motion.div
                  key={course.code}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm text-[#00E5FF]">{course.code}</span>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getTypeColor(course.type)}`}
                        >
                          {getTypeIcon(course.type)}
                          <span className="ml-1">{course.type}</span>
                        </Badge>
                      </div>
                      <h4 className="font-medium text-white">{course.name}</h4>
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-white/5 text-sm">
                      {course.credits} cr
                    </div>
                  </div>

                  {course.topics && course.topics.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 rounded-md bg-white/5 text-xs text-gray-400"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}