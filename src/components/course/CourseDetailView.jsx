import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Copy, Check, FileText, BookOpen, Target,
  BarChart3, ChevronDown, ChevronRight, GraduationCap, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CourseQuestionPaper from './CourseQuestionPaper';
import CourseCapstoneIdeas from './CourseCapstoneIdeas';

export default function CourseDetailView({ course, onBack }) {
  const [copiedSection, setCopiedSection] = useState(null);

  const copyToClipboard = (content, section) => {
    let textContent = '';
    
    if (section === 'units') {
      textContent = `📚 UNIT-WISE SYLLABUS (15 weeks)\n\n`;
      course.units?.forEach(unit => {
        textContent += `Unit ${unit.number} (Weeks ${unit.weeks}): ${unit.title}\n`;
        unit.topics?.forEach(topic => {
          textContent += `├── Week ${topic.week}: ${topic.content}\n`;
        });
        textContent += '\n';
      });
    } else if (section === 'cos') {
      textContent = `🎯 COURSE OUTCOMES (with Bloom's levels)\n\n`;
      course.course_outcomes?.forEach(co => {
        textContent += `${co.code}: ${co.description} (${co.blooms_level})\n`;
      });
    } else if (section === 'copo') {
      textContent = `📊 CO-PO MAPPING TABLE\n\n`;
      textContent += `| CO | PO1 | PO2 | PO3 | PO4 | PO5 | PO12 |\n`;
      textContent += `|----|-----|-----|-----|-----|-----|------|\n`;
      Object.entries(course.co_po_mapping || {}).forEach(([co, mapping]) => {
        textContent += `| ${co}|  ${mapping.PO1 || '-'}  |  ${mapping.PO2 || '-'}  |  ${mapping.PO3 || '-'}  |  ${mapping.PO4 || '-'}  |  ${mapping.PO5 || '-'}  |  ${mapping.PO12 || '-'}   |\n`;
      });
    } else if (section === 'assessment') {
      textContent = `📋 ASSESSMENT BLUEPRINT\n\n`;
      textContent += `Internal: ${course.assessment?.internal?.marks} marks (${course.assessment?.internal?.components?.assignments} assignments + ${course.assessment?.internal?.components?.quizzes} quizzes)\n`;
      textContent += `End-semester: ${course.assessment?.external?.marks} marks (${course.assessment?.external?.type})\n`;
      textContent += `Total: ${course.assessment?.total} marks\n`;
      const blooms = course.assessment?.blooms_distribution;
      if (blooms) {
        textContent += `Bloom's distribution: Remember ${blooms.remember}%, Understand ${blooms.understand}%, Apply ${blooms.apply}%, Analyze+ ${blooms.analyze_plus}%\n`;
      }
    } else {
      textContent = typeof content === 'object' ? JSON.stringify(content, null, 2) : content;
    }
    
    navigator.clipboard.writeText(textContent);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const CopyButton = ({ content, section, label }) => (
    <Button
      variant="outline"
      size="sm"
      onClick={() => copyToClipboard(content, section)}
      className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
    >
      {copiedSection === section ? (
        <>
          <Check className="w-4 h-4 mr-1 text-[#39FF14]" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-1" />
          {label || 'Copy'}
        </>
      )}
    </Button>
  );

  const getBloomsColor = (level) => {
    const colors = {
      'Remember': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'Understand': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Apply': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Analyze': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Evaluate': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Create': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    };
    return colors[level] || 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const exportAsPDF = () => {
    alert('PDF export functionality - would generate a formatted PDF document');
  };

  const exportAsDOCX = () => {
    alert('DOCX export functionality - would generate a Word document');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Generate Another
          </Button>
          
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-[#8B5FFF]/10 border border-white/10 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-lg text-[#00E5FF]">{course.code}</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
            <p className="text-gray-300">
              Credits: {course.credits} | Semester: {course.semester} | Program: {course.program}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={exportAsDOCX}
            variant="outline"
            className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            DOCX
          </Button>
          <Button 
            onClick={exportAsPDF}
            className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Unit-wise Syllabus */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📚</span>
            UNIT-WISE SYLLABUS (15 weeks)
          </h2>
          <CopyButton content={course.units} section="units" label="Copy Section" />
        </div>

        <div className="space-y-4">
          {course.units?.map((unit, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#00E5FF]/10 border border-[#00E5FF]/30 flex items-center justify-center">
                  <span className="font-bold text-[#00E5FF]">{unit.number}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Unit {unit.number} (Weeks {unit.weeks}): {unit.title}</h3>
                </div>
              </div>
              
              <div className="ml-4 space-y-2 border-l-2 border-[#00E5FF]/30 pl-4">
                {unit.topics?.map((topic, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-gray-500">├──</span>
                    <span className="text-[#8B5FFF] font-medium min-w-[70px]">Week {topic.week}:</span>
                    <span className="text-gray-300">{topic.content}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Course Outcomes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            COURSE OUTCOMES (with Bloom's levels)
          </h2>
          <CopyButton content={course.course_outcomes} section="cos" label="Copy Section" />
        </div>

        <div className="space-y-3">
          {course.course_outcomes?.map((co, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="w-12 h-12 rounded-lg bg-[#8B5FFF]/10 border border-[#8B5FFF]/30 flex items-center justify-center shrink-0">
                <span className="font-bold text-[#8B5FFF]">{co.code}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-200 mb-2">{co.description}</p>
                <Badge variant="outline" className={getBloomsColor(co.blooms_level)}>
                  {co.blooms_level}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CO-PO Mapping Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📊</span>
            CO-PO MAPPING TABLE
          </h2>
          <CopyButton content={course.co_po_mapping} section="copo" label="Copy Table" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-white/10 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="text-left py-3 px-4 font-semibold text-white border-r border-white/10">CO</th>
                {['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'].map(po => (
                  <th key={po} className="text-center py-3 px-2 font-semibold text-white border-r border-white/10 last:border-r-0">{po}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(course.co_po_mapping || {}).map(([co, mapping], idx) => (
                <tr key={co} className={`border-t border-white/10 ${idx % 2 === 0 ? 'bg-white/5' : ''}`}>
                  <td className="py-3 px-4 font-semibold text-[#00E5FF] border-r border-white/10">{co}</td>
                  {['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'].map(po => (
                    <td key={po} className="text-center py-3 px-2 border-r border-white/10 last:border-r-0">
                      {mapping[po] ? (
                        <span className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-md text-sm font-bold
                          ${mapping[po] === 3 ? 'bg-[#39FF14]/20 text-[#39FF14]' : 
                            mapping[po] === 2 ? 'bg-[#00E5FF]/20 text-[#00E5FF]' : 
                            'bg-[#8B5FFF]/20 text-[#8B5FFF]'}
                        `}>
                          {mapping[po]}
                        </span>
                      ) : (
                        <span className="text-gray-600">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#39FF14]/20 text-[#39FF14] text-xs font-bold flex items-center justify-center">3</span> High
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#00E5FF]/20 text-[#00E5FF] text-xs font-bold flex items-center justify-center">2</span> Medium
          </span>
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-[#8B5FFF]/20 text-[#8B5FFF] text-xs font-bold flex items-center justify-center">1</span> Low
          </span>
        </div>
      </motion.div>

      {/* Assessment Blueprint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="text-2xl">📋</span>
            ASSESSMENT BLUEPRINT
          </h2>
          <CopyButton content={course.assessment} section="assessment" label="Copy Section" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Internal Assessment */}
          <div className="p-5 rounded-xl bg-white/5 border border-[#00E5FF]/30">
            <h3 className="font-semibold mb-3 text-[#00E5FF]">Internal Assessment</h3>
            <div className="text-4xl font-bold text-white mb-3">
              {course.assessment?.internal?.marks} <span className="text-lg font-normal text-gray-400">marks</span>
            </div>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span>Assignments</span>
                <span className="font-semibold">{course.assessment?.internal?.components?.assignments} marks</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded bg-white/5">
                <span>Quizzes</span>
                <span className="font-semibold">{course.assessment?.internal?.components?.quizzes} marks</span>
              </div>
            </div>
          </div>

          {/* External Assessment */}
          <div className="p-5 rounded-xl bg-white/5 border border-[#8B5FFF]/30">
            <h3 className="font-semibold mb-3 text-[#8B5FFF]">End-Semester Exam</h3>
            <div className="text-4xl font-bold text-white mb-3">
              {course.assessment?.external?.marks} <span className="text-lg font-normal text-gray-400">marks</span>
            </div>
            <p className="text-gray-400">{course.assessment?.external?.type}</p>
          </div>
        </div>

        {/* Total and Bloom's Distribution */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-[#00E5FF]/10 to-[#8B5FFF]/10 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total Marks</span>
            <span className="text-3xl font-bold">{course.assessment?.total}</span>
          </div>
          
          <div className="border-t border-white/10 pt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Bloom's Distribution</h4>
            <div className="grid grid-cols-4 gap-3">
              {course.assessment?.blooms_distribution && Object.entries(course.assessment.blooms_distribution).map(([level, percent]) => (
                <div key={level} className="text-center p-3 rounded-lg bg-white/5">
                  <div className="text-xl font-bold text-white">{percent}%</div>
                  <div className="text-xs text-gray-400 capitalize">{level.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* References */}
      {course.references && course.references.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="text-2xl">📖</span>
            TEXTBOOKS & REFERENCES
          </h2>
          <ol className="space-y-2 list-decimal list-inside">
            {course.references.map((ref, idx) => (
              <li key={idx} className="text-gray-300 pl-2">
                {ref}
              </li>
            ))}
          </ol>
        </motion.div>
      )}

      {/* Question Paper Generator */}
      <CourseQuestionPaper course={course} />

      {/* Capstone Project Ideas */}
      <CourseCapstoneIdeas course={course} />
    </div>
  );
}