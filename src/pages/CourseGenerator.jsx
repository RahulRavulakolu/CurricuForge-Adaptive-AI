import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  Sparkles, ArrowLeft, Loader2, BookOpen, GraduationCap,
  FileText, Copy, Check, ChevronDown, Target, Clock, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CourseDetailView from '@/components/course/CourseDetailView';

export default function CourseGenerator() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
  }, []);

  const [isGenerating, setIsGenerating] = useState(false);
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    program: 'B.Tech CSE',
    semester: '5',
    courseTitle: '',
    credits: '4',
    description: '',
    targetSkills: ''
  });

  const handleGenerate = async () => {
    setIsGenerating(true);

    const prompt = `Generate a COMPLETE and DETAILED course syllabus following the LATEST 2024-2025 academic standards and industry trends for:

Program: ${formData.program}
Semester: ${formData.semester}
Course Title: ${formData.courseTitle}
Credits: ${formData.credits}
Short Description: ${formData.description || 'Comprehensive course covering theory and practical applications'}
Target Skills: ${formData.targetSkills || 'Programming, problem-solving, analytical skills'}

IMPORTANT: Use the MOST RECENT and UP-TO-DATE content, tools, frameworks, and industry practices as of 2024-2025.

Generate an extremely detailed syllabus with:

1. UNIT-WISE SYLLABUS (5 units across 15 weeks, 3 weeks each):
   - Each unit should have a clear title and week-wise breakdown
   - Week 1, Week 2, Week 3 for each unit with specific topics
   - Topics should be specific and detailed

2. 6 COURSE OUTCOMES (COs) with Bloom's taxonomy levels:
   - CO1-CO6 with action verbs matching Bloom's levels
   - Use: Remember, Understand, Apply, Analyze, Evaluate, Create

3. CO-PO MAPPING TABLE:
   - Map all 6 COs to POs (PO1-PO12)
   - Use correlation levels: 3=High, 2=Medium, 1=Low, null=No correlation
   - Focus on PO1, PO2, PO3, PO4, PO5, PO12 primarily

4. ASSESSMENT BLUEPRINT:
   - Internal: 40 marks (assignments 20, quizzes 20)
   - External: 60 marks (end-semester theory exam)
   - Total: 100 marks
   - Bloom's distribution percentages

5. TEXTBOOKS AND REFERENCES (3-4 relevant books)

Return JSON with this EXACT structure:
{
  "code": "CSE${formData.semester}01",
  "title": "${formData.courseTitle}",
  "credits": ${formData.credits},
  "semester": ${formData.semester},
  "program": "${formData.program}",
  "units": [
    {
      "number": 1,
      "title": "Introduction to [Topic]",
      "weeks": "1-3",
      "topics": [
        {"week": 1, "content": "Specific topic for week 1"},
        {"week": 2, "content": "Specific topic for week 2"},
        {"week": 3, "content": "Specific topic for week 3"}
      ]
    },
    {
      "number": 2,
      "title": "Unit 2 Title",
      "weeks": "4-6",
      "topics": [
        {"week": 4, "content": "Week 4 topic"},
        {"week": 5, "content": "Week 5 topic"},
        {"week": 6, "content": "Week 6 topic"}
      ]
    },
    {
      "number": 3,
      "title": "Unit 3 Title",
      "weeks": "7-9",
      "topics": [
        {"week": 7, "content": "Week 7 topic"},
        {"week": 8, "content": "Week 8 topic"},
        {"week": 9, "content": "Week 9 topic"}
      ]
    },
    {
      "number": 4,
      "title": "Unit 4 Title",
      "weeks": "10-12",
      "topics": [
        {"week": 10, "content": "Week 10 topic"},
        {"week": 11, "content": "Week 11 topic"},
        {"week": 12, "content": "Week 12 topic"}
      ]
    },
    {
      "number": 5,
      "title": "Unit 5 Title",
      "weeks": "13-15",
      "topics": [
        {"week": 13, "content": "Week 13 topic"},
        {"week": 14, "content": "Week 14 topic"},
        {"week": 15, "content": "Week 15 topic"}
      ]
    }
  ],
  "course_outcomes": [
    {"code": "CO1", "description": "Explain...", "blooms_level": "Understand"},
    {"code": "CO2", "description": "Implement...", "blooms_level": "Apply"},
    {"code": "CO3", "description": "Evaluate...", "blooms_level": "Analyze"},
    {"code": "CO4", "description": "Perform...", "blooms_level": "Apply"},
    {"code": "CO5", "description": "Design...", "blooms_level": "Create"},
    {"code": "CO6", "description": "Interpret...", "blooms_level": "Evaluate"}
  ],
  "co_po_mapping": {
    "CO1": {"PO1": 3, "PO2": 2, "PO3": 1, "PO12": 2},
    "CO2": {"PO1": 3, "PO2": 3, "PO3": 2, "PO4": 3, "PO5": 2, "PO12": 1},
    "CO3": {"PO1": 2, "PO2": 3, "PO3": 3, "PO4": 2, "PO5": 3, "PO12": 2},
    "CO4": {"PO1": 3, "PO2": 3, "PO3": 2, "PO4": 3, "PO5": 1, "PO12": 3},
    "CO5": {"PO1": 3, "PO2": 3, "PO3": 3, "PO4": 3, "PO5": 3, "PO12": 3},
    "CO6": {"PO1": 2, "PO2": 3, "PO3": 3, "PO4": 2, "PO5": 3, "PO12": 3}
  },
  "assessment": {
    "internal": {"marks": 40, "components": {"assignments": 20, "quizzes": 20}},
    "external": {"marks": 60, "type": "End Semester Theory Exam"},
    "total": 100,
    "blooms_distribution": {"remember": 10, "understand": 20, "apply": 40, "analyze_plus": 30}
  },
  "references": [
    "Author Name, 'Book Title', Publisher, Edition, Year",
    "Second reference book",
    "Third reference book"
  ]
}`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            code: { type: "string" },
            title: { type: "string" },
            credits: { type: "number" },
            semester: { type: "number" },
            program: { type: "string" },
            units: { 
              type: "array",
              items: {
                type: "object",
                properties: {
                  number: { type: "number" },
                  title: { type: "string" },
                  weeks: { type: "string" },
                  topics: { 
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        week: { type: "number" },
                        content: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            course_outcomes: { 
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string" },
                  description: { type: "string" },
                  blooms_level: { type: "string" }
                }
              }
            },
            co_po_mapping: { type: "object" },
            assessment: { 
              type: "object",
              properties: {
                internal: { type: "object" },
                external: { type: "object" },
                total: { type: "number" },
                blooms_distribution: { type: "object" }
              }
            },
            references: { type: "array", items: { type: "string" } }
          }
        }
      });

      setCourse(response);
      
      // Save to database
      const courseData = typeof response === 'string' ? JSON.parse(response) : response;
      await base44.entities.Course.create(courseData);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
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
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Course Syllabus Generator</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!course ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Generate Detailed Course Syllabus</h1>
                <p className="text-gray-400 text-lg">
                  Create complete course documentation with unit-wise syllabus, COs, and CO-PO mapping
                </p>
              </div>

              <div className="space-y-6 p-8 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-300 mb-2 block">Program</Label>
                    <Input
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      placeholder="e.g., B.Tech CSE"
                      className="bg-white/5 border-white/10 text-white h-12"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300 mb-2 block">Semester</Label>
                    <Select
                      value={formData.semester}
                      onValueChange={(value) => setFormData({ ...formData, semester: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#1F2937] border-white/10">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={String(num)} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Semester {num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Course Title *</Label>
                  <Input
                    value={formData.courseTitle}
                    onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                    placeholder="e.g., Machine Learning"
                    className="bg-white/5 border-white/10 text-white h-12"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Credits</Label>
                  <Select
                    value={formData.credits}
                    onValueChange={(value) => setFormData({ ...formData, credits: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F2937] border-white/10">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={String(num)} className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">{num} Credits</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Short Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Students will learn supervised/unsupervised learning algorithms and apply them to real datasets."
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>

                <div>
                  <Label className="text-gray-300 mb-2 block">Target Skills</Label>
                  <Input
                    value={formData.targetSkills}
                    onChange={(e) => setFormData({ ...formData, targetSkills: e.target.value })}
                    placeholder="e.g., Python, scikit-learn, model evaluation, feature engineering"
                    className="bg-white/5 border-white/10 text-white h-12"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!formData.courseTitle || isGenerating}
                  className="w-full bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0 py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Complete Syllabus...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Complete Syllabus
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <CourseDetailView course={course} onBack={() => setCourse(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}