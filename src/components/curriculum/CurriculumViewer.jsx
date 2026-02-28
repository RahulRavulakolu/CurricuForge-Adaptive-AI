import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
  ChevronDown, ChevronRight, FileJson, FileText, Copy, Check,
  BookOpen, Beaker, Layers, GraduationCap, BarChart3, Sparkles,
  Briefcase, Building2, Cpu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SemesterCard from './SemesterCard';
import AnalyticsPreview from './AnalyticsPreview';
import QuestionPaperGenerator from './QuestionPaperGenerator';
import { exportCurriculumToPDF } from '@/utils/pdfExport';

export default function CurriculumViewer({ curriculum }) {
  const [copiedJson, setCopiedJson] = useState(false);
  const [expandedSemesters, setExpandedSemesters] = useState([1]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(curriculum, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleExportPDF = () => {
    exportCurriculumToPDF(curriculum);
  };

  const toggleSemester = (num) => {
    setExpandedSemesters(prev =>
      prev.includes(num)
        ? prev.filter(n => n !== num)
        : [...prev, num]
    );
  };

  const totalCredits = curriculum.semesters?.reduce((sum, sem) => sum + (sem.total_credits || 0), 0) || 0;

  const getDomainIcon = (domain) => {
    const icons = {
      'FinTech': Briefcase,
      'Healthcare': Building2,
      'E-commerce': Cpu,
      'AI': Sparkles,
      'default': Briefcase
    };
    return icons[domain] || icons.default;
  };

  const getDomainColor = (domain) => {
    const colors = {
      'FinTech': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Healthcare': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'E-commerce': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'AI': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[domain] || colors.default;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 rounded-full bg-[#39FF14]/10 border border-[#39FF14]/30">
              <span className="text-[#39FF14] text-sm font-medium">Generated Successfully</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{curriculum.program_title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              {curriculum.level}
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {curriculum.semesters?.length || 0} Semesters
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              {totalCredits} Total Credits
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleCopyJson}
            className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            {copiedJson ? (
              <>
                <Check className="w-4 h-4 mr-2 text-[#39FF14]" />
                Copied!
              </>
            ) : (
              <>
                <FileJson className="w-4 h-4 mr-2" />
                Copy JSON
              </>
            )}
          </Button>
          <Button
            onClick={handleExportPDF}
            className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Analytics Preview */}
      {curriculum.analytics && (
        <AnalyticsPreview analytics={curriculum.analytics} />
      )}

      {/* Semesters */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#00E5FF]" />
          Semester Structure
        </h2>

        {curriculum.semesters?.map((semester, index) => (
          <SemesterCard
            key={semester.number}
            semester={semester}
            isExpanded={expandedSemesters.includes(semester.number)}
            onToggle={() => toggleSemester(semester.number)}
            index={index}
          />
        ))}
      </div>

      {/* Capstone Ideas */}
      {curriculum.capstone_ideas && curriculum.capstone_ideas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B5FFF]" />
            Suggested Capstone Projects
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            {curriculum.capstone_ideas.map((capstone, idx) => {
              const DomainIcon = getDomainIcon(capstone.industry_domain);
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  className="p-5 rounded-2xl bg-gradient-to-br from-[#1F2937]/60 to-[#1F2937]/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5FFF] to-[#00E5FF] flex items-center justify-center">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    <Badge variant="outline" className={`${getDomainColor(capstone.industry_domain)} border`}>
                      <DomainIcon className="w-3 h-3 mr-1" />
                      {capstone.industry_domain}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-2">{capstone.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{capstone.description}</p>

                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Skills Applied</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {capstone.skills_applied?.map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-gray-300">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs text-gray-500">Complexity</span>
                      <Badge variant="outline" className={`text-xs ${capstone.complexity === 'Advanced'
                          ? 'border-red-500/30 text-red-400'
                          : capstone.complexity === 'Intermediate'
                            ? 'border-yellow-500/30 text-yellow-400'
                            : 'border-green-500/30 text-green-400'
                        }`}>
                        {capstone.complexity}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Legacy capstone support */}
      {curriculum.capstone && !curriculum.capstone_ideas && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-[#8B5FFF]/10 to-[#00E5FF]/10 border border-[#8B5FFF]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5FFF] to-[#00E5FF] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{curriculum.capstone.title}</h3>
              <p className="text-gray-400">{curriculum.capstone.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Paper Generator */}
      <QuestionPaperGenerator curriculum={curriculum} />

      {/* Actions */}
      <div className="flex flex-wrap gap-4 pt-8 border-t border-white/10">
        <Link to={createPageUrl(`CourseGenerator?curriculum=${curriculum._id}`)}>
          <Button className="bg-[#1F2937] hover:bg-[#374151] border border-white/10 text-white hover:text-white">
            <BookOpen className="w-4 h-4 mr-2" />
            Generate Detailed Syllabus
          </Button>
        </Link>
        <Link to={createPageUrl('Analytics')}>
          <Button className="bg-[#1F2937] hover:bg-[#374151] border border-white/10 text-white hover:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Full Analytics
          </Button>
        </Link>
      </div>
    </div>
  );
}