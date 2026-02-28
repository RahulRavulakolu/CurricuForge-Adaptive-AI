import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  FileText, Download, Loader2, BookOpen, Clock, 
  CheckCircle, AlertCircle, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CourseQuestionPaper({ course }) {
  const [examType, setExamType] = useState('end_semester');
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionPaper, setQuestionPaper] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    const prompt = `Generate a comprehensive ${examType === 'end_semester' ? 'End Semester' : 'Mid Semester'} examination question paper for:

Course: ${course.title} (${course.code})
Program: ${course.program}
Semester: ${course.semester}
Duration: ${examType === 'end_semester' ? '3 Hours' : '1.5 Hours'}
Maximum Marks: ${examType === 'end_semester' ? '100' : '50'}
Topics Covered: ${course.units?.map(u => u.title).join(', ') || 'All topics'}

Course Outcomes:
${course.course_outcomes?.map(co => `${co.code}: ${co.description}`).join('\n') || ''}

IMPORTANT: Generate questions based on LATEST 2024-2025 curriculum standards and industry practices.

Create a well-structured question paper with:
1. Clear sections (Part A, Part B, Part C)
2. Mix of question types (short answer, long answer, problem-solving, application-based)
3. Questions mapped to different Bloom's Taxonomy levels
4. Clear marking scheme
5. Choice options where applicable

Return a JSON object with this structure:
{
  "paper_title": "string",
  "course_code": "string",
  "course_name": "string",
  "duration": "string",
  "max_marks": number,
  "instructions": ["string"],
  "sections": [
    {
      "name": "Part A - Short Answer Questions",
      "instructions": "Answer ALL questions. Each carries 2 marks.",
      "marks_per_question": 2,
      "questions": [
        {
          "number": 1,
          "question": "string",
          "blooms_level": "Remember|Understand|Apply|Analyze|Evaluate|Create",
          "co_mapped": "CO1"
        }
      ]
    }
  ],
  "total_marks": number
}`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            paper_title: { type: "string" },
            course_code: { type: "string" },
            course_name: { type: "string" },
            duration: { type: "string" },
            max_marks: { type: "number" },
            instructions: { type: "array", items: { type: "string" } },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  instructions: { type: "string" },
                  marks_per_question: { type: "number" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        number: { type: "number" },
                        question: { type: "string" },
                        blooms_level: { type: "string" },
                        co_mapped: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            total_marks: { type: "number" }
          }
        }
      });
      
      setQuestionPaper(response);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!questionPaper) return;
    
    let content = `${questionPaper.paper_title}\n`;
    content += `${'='.repeat(60)}\n\n`;
    content += `Course Code: ${questionPaper.course_code}\n`;
    content += `Course Name: ${questionPaper.course_name}\n`;
    content += `Duration: ${questionPaper.duration}\n`;
    content += `Maximum Marks: ${questionPaper.max_marks}\n\n`;
    content += `INSTRUCTIONS:\n`;
    questionPaper.instructions?.forEach((inst, i) => {
      content += `${i + 1}. ${inst}\n`;
    });
    content += `\n${'='.repeat(60)}\n\n`;
    
    questionPaper.sections?.forEach(section => {
      content += `${section.name}\n`;
      content += `${section.instructions}\n`;
      content += `${'-'.repeat(40)}\n\n`;
      
      section.questions?.forEach(q => {
        content += `Q${q.number}. ${q.question}\n`;
        content += `    [Bloom's: ${q.blooms_level}] [${q.co_mapped}]\n\n`;
      });
      content += '\n';
    });
    
    content += `\n${'='.repeat(60)}\n`;
    content += `Total Marks: ${questionPaper.total_marks}\n`;
    content += `${'='.repeat(60)}\n`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${questionPaper.course_code}_Question_Paper.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!questionPaper) return;
    
    let content = `${questionPaper.paper_title}\n\n`;
    questionPaper.sections?.forEach(section => {
      content += `${section.name}\n${section.instructions}\n\n`;
      section.questions?.forEach(q => {
        content += `Q${q.number}. ${q.question}\n\n`;
      });
    });
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBloomsColor = (level) => {
    const colors = {
      'Remember': 'bg-gray-500/20 text-gray-400',
      'Understand': 'bg-blue-500/20 text-blue-400',
      'Apply': 'bg-green-500/20 text-green-400',
      'Analyze': 'bg-yellow-500/20 text-yellow-400',
      'Evaluate': 'bg-orange-500/20 text-orange-400',
      'Create': 'bg-purple-500/20 text-purple-400',
    };
    return colors[level] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <span className="text-2xl">📝</span>
        QUESTION PAPER GENERATOR
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="text-sm text-gray-400 mb-2 block">Exam Type</label>
          <Select value={examType} onValueChange={setExamType}>
            <SelectTrigger className="bg-white/5 border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-white/10">
              <SelectItem value="end_semester" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">End Semester (100 marks, 3 hours)</SelectItem>
              <SelectItem value="mid_semester" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Mid Semester (50 marks, 1.5 hours)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-[#39FF14] to-[#00E5FF] hover:opacity-90 text-black font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Generate Question Paper
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Question Paper */}
      {questionPaper && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-6"
        >
          {/* Paper Header */}
          <div className="p-6 rounded-xl bg-[#0B1020] border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{questionPaper.paper_title}</h3>
              <div className="flex justify-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  {questionPaper.course_code}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {questionPaper.duration}
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Max Marks: {questionPaper.max_marks}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <h4 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Instructions
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {questionPaper.instructions?.map((inst, i) => (
                  <li key={i}>{i + 1}. {inst}</li>
                ))}
              </ul>
            </div>

            {/* Sections */}
            {questionPaper.sections?.map((section, sIdx) => (
              <div key={sIdx} className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-[#00E5FF]">{section.name}</h4>
                  <Badge variant="outline" className="border-white/20 text-gray-400">
                    {section.marks_per_question} marks each
                  </Badge>
                </div>
                <p className="text-sm text-gray-400 mb-4 italic">{section.instructions}</p>
                
                <div className="space-y-4">
                  {section.questions?.map((q, qIdx) => (
                    <div key={qIdx} className="p-4 rounded-lg bg-white/5 border border-white/5">
                      <div className="flex items-start gap-3">
                        <span className="text-[#8B5FFF] font-bold">Q{q.number}.</span>
                        <div className="flex-1">
                          <p className="text-gray-200 mb-2">{q.question}</p>
                          <div className="flex gap-2">
                            <Badge variant="outline" className={`text-xs ${getBloomsColor(q.blooms_level)}`}>
                              {q.blooms_level}
                            </Badge>
                            <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                              {q.co_mapped}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="text-right pt-4 border-t border-white/10">
              <span className="text-lg font-bold text-white">
                Total Marks: {questionPaper.total_marks}
              </span>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-[#39FF14]" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Text
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Question Paper</span>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}