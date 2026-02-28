import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { 
  Sparkles, ArrowLeft, ArrowRight, Loader2, 
  GraduationCap, Clock, Building2, Target,
  FileJson, FileText, ChevronDown, Copy, Check,
  BookOpen, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import CurriculumViewer from '@/components/curriculum/CurriculumViewer';

export default function Generator() {
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);
    console.log('Generator component mounted');
  }, []);

  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [curriculum, setCurriculum] = useState(null);
  const [formData, setFormData] = useState({
    skill: '',
    level: 'B.Tech',
    semesters: 4,
    weeklyHours: '20-25',
    industryFocus: '',
    maxCreditsPerSemester: 18,
    includeCapstone: true,
    constraints: ''
  });

  // Load curriculum data from localStorage
  useEffect(() => {
    const storedCurriculumData = localStorage.getItem('curriculumData');
    if (storedCurriculumData) {
      const parsedData = JSON.parse(storedCurriculumData);
      setCurriculum(parsedData);
      setStep(3); // Automatically go to review step if curriculum exists
      console.log('Loaded curriculum from localStorage:', parsedData);
    }
  }, []);

  // Debug form data changes
  useEffect(() => {
    console.log('Form data updated:', formData);
  }, [formData]);

  const handleGenerate = async () => {
    console.log('Generate button clicked!', formData);
    setIsGenerating(true);
    
    const prompt = `Generate a complete ${formData.semesters}-semester academic curriculum for ${formData.skill} at ${formData.level} level using the LATEST 2024-2025 industry standards, tools, and frameworks.
    
Requirements:
- Weekly study hours: ${formData.weeklyHours}
- Industry focus: ${formData.industryFocus || 'General'}
- Maximum credits per semester: ${formData.maxCreditsPerSemester}
- Include capstone project: ${formData.includeCapstone ? 'Yes' : 'No'}
${formData.constraints ? `- Additional constraints: ${formData.constraints}` : ''}

IMPORTANT: Ensure all content reflects the MOST RECENT developments, technologies, and best practices in the field as of 2024-2025.

For each semester, provide:
1. 4-5 courses with code, name, credits, type (Theory/Lab/Mixed), and 4-5 topics
2. Balance between theory and practical
3. Progressive difficulty from fundamentals to advanced
4. Industry-relevant skills

Return a JSON object with this exact structure:
{
  "program_title": "Program Title",
  "skill": "${formData.skill}",
  "level": "${formData.level}",
  "total_credits": number,
  "semesters": [
    {
      "number": 1,
      "summary": "Brief overview of semester focus",
      "total_credits": number,
      "courses": [
        {
          "code": "CSE101",
          "name": "Course Name",
          "credits": 4,
          "type": "Theory",
          "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
        }
      ]
    }
  ],
  "capstone_ideas": [
    {
      "title": "Project Title 1",
      "description": "Detailed project description",
      "industry_domain": "FinTech",
      "skills_applied": ["skill1", "skill2"],
      "complexity": "Advanced"
    },
    {
      "title": "Project Title 2",
      "description": "Detailed project description",
      "industry_domain": "Healthcare",
      "skills_applied": ["skill1", "skill2"],
      "complexity": "Intermediate"
    },
    {
      "title": "Project Title 3",
      "description": "Detailed project description",
      "industry_domain": "E-commerce",
      "skills_applied": ["skill1", "skill2"],
      "complexity": "Advanced"
    }
  ],
  "analytics": {
    "skill_coverage": {"foundation": 30, "intermediate": 40, "advanced": 30},
    "blooms_distribution": {"remember": 10, "understand": 20, "apply": 35, "analyze": 20, "evaluate": 10, "create": 5}
  }
}`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            program_title: { type: "string" },
            skill: { type: "string" },
            level: { type: "string" },
            total_credits: { type: "number" },
            semesters: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  number: { type: "number" },
                  summary: { type: "string" },
                  total_credits: { type: "number" },
                  courses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        code: { type: "string" },
                        name: { type: "string" },
                        credits: { type: "number" },
                        type: { type: "string" },
                        topics: { type: "array", items: { type: "string" } }
                      }
                    }
                  }
                }
              }
            },
            capstone_ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  industry_domain: { type: "string" },
                  skills_applied: { type: "array", items: { type: "string" } },
                  complexity: { type: "string" }
                }
              }
            },
            analytics: {
              type: "object",
              properties: {
                skill_coverage: { type: "object" },
                blooms_distribution: { type: "object" }
              }
            },
            total_marks: { type: "number" }
          }
        }
      });
      
      setCurriculum(response);
      setStep(3);
      
      // Save to localStorage for persistence
      const curriculumData = typeof response === 'string' ? JSON.parse(response) : response;
      localStorage.setItem('curriculumData', JSON.stringify(curriculumData));
      
      // Save to database
      const curriculumDataForDB = typeof response === 'string' ? JSON.parse(response) : response;
      await base44.entities.Curriculum.create({
        ...curriculumDataForDB,
        semester_count: formData.semesters,
        weekly_hours: formData.weeklyHours,
        industry_focus: formData.industryFocus,
        constraints: { maxCredits: formData.maxCreditsPerSemester }
      });
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      {/* Animated Background - DISABLED */}
      {false && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-[#111827] via-[#0B1020] to-[#020617]" />
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b border-white/5 bg-[#0B1020]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to={createPageUrl('Landing')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">CurricuForge</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Repository')}>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                Repository
              </Button>
            </Link>
            <Link to={createPageUrl('Analytics')}>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-4">
          {[
            { num: 1, label: 'Configure' },
            { num: 2, label: 'Generate' },
            { num: 3, label: 'Review' }
          ].map((s, i) => (
            <React.Fragment key={s.num}>
              <div className="flex items-center gap-2">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  ${step >= s.num 
                    ? 'bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] text-white' 
                    : 'bg-white/5 text-gray-500 border border-white/10'
                  }
                `}>
                  {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                </div>
                <span className={step >= s.num ? 'text-white' : 'text-gray-500'}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-20 h-[2px] ${step > s.num ? 'bg-[#00E5FF]' : 'bg-white/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Configure Your Program</h1>
                <p className="text-gray-400 text-lg">
                  Tell us about the curriculum you want to generate
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Skill Input */}
                <div className="md:col-span-2">
                  <Label className="text-gray-300 mb-2 block">
                    <Target className="w-4 h-4 inline mr-2" />
                    Primary Skill / Domain *
                  </Label>
                  <Input
                    value={formData.skill}
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                    placeholder="e.g., Machine Learning, Full-Stack Web Development, Data Science"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  />
                </div>

                {/* Level */}
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Program Level *
                  </Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => setFormData({ ...formData, level: value })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1F2937] border-white/10 text-white">
                      <SelectItem value="Diploma" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Diploma</SelectItem>
                      <SelectItem value="B.Tech" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">B.Tech / B.E.</SelectItem>
                      <SelectItem value="Masters" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Masters / M.Tech</SelectItem>
                      <SelectItem value="Certification" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Certification</SelectItem>
                      <SelectItem value="Executive" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Executive Program</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Focus */}
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    <Building2 className="w-4 h-4 inline mr-2" />
                    Industry Focus
                  </Label>
                  <Input
                    value={formData.industryFocus}
                    onChange={(e) => setFormData({ ...formData, industryFocus: e.target.value })}
                    placeholder="e.g., FinTech, Healthcare, AI"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  />
                </div>

                {/* Semesters */}
                <div>
                  <Label className="text-gray-300 mb-4 block">
                    Number of Semesters: <span className="text-[#00E5FF] font-bold">{formData.semesters}</span>
                  </Label>
                  <Slider
                    // @ts-ignore - Slider value prop typing
                    value={[formData.semesters]}
                    onValueChange={(value) => setFormData({ ...formData, semesters: value[0] })}
                    min={1}
                    max={8}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>1</span>
                    <span>8</span>
                  </div>
                </div>

                {/* Weekly Hours */}
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Weekly Study Hours
                  </Label>
                  <Input
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: e.target.value })}
                    placeholder="e.g., 20-25"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                  />
                </div>

                {/* Max Credits */}
                <div>
                  <Label className="text-gray-300 mb-4 block">
                    Max Credits per Semester: <span className="text-[#8B5FFF] font-bold">{formData.maxCreditsPerSemester}</span>
                  </Label>
                  <Slider                    // @ts-ignore - Slider value prop typing                    value={[formData.maxCreditsPerSemester]}
                    onValueChange={(value) => setFormData({ ...formData, maxCreditsPerSemester: value[0] })}
                    min={12}
                    max={24}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>12</span>
                    <span>24</span>
                  </div>
                </div>

                {/* Additional Constraints */}
                <div className="md:col-span-2">
                  <Label className="text-gray-300 mb-2 block">
                    Additional Constraints (Optional)
                  </Label>
                  <Textarea
                    value={formData.constraints}
                    onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
                    placeholder="e.g., Include 2 lab courses per semester, emphasis on practical projects..."
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[100px]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  onClick={() => {
                    console.log('Continue button clicked, skill:', formData.skill);
                    setStep(2);
                  }}
                  disabled={!formData.skill}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0 px-8 py-6 text-lg"
                >
                  Continue to Generate
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center py-20"
            >
              <h1 className="text-4xl font-bold mb-4">Ready to Generate</h1>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                AI will create a {formData.semesters}-semester {formData.level} curriculum 
                for {formData.skill} with industry-aligned courses and progressive learning paths.
              </p>

              {/* Preview Card */}
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/10 mb-8 text-left">
                <h3 className="font-semibold text-lg mb-4">Generation Preview</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Skill</span>
                    <span className="text-[#00E5FF]">{formData.skill}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Level</span>
                    <span>{formData.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Semesters</span>
                    <span>{formData.semesters}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Max Credits/Sem</span>
                    <span>{formData.maxCreditsPerSemester}</span>
                  </div>
                  {formData.industryFocus && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Industry</span>
                      <span className="text-[#8B5FFF]">{formData.industryFocus}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="border-white/20 text-white bg-transparent hover:bg-white/10 hover:text-white px-6"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0 px-10 py-6 text-lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating Curriculum...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Curriculum
                    </>
                  )}
                </Button>
              </div>

              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8"
                >
                  <p className="text-gray-400 text-sm">
                    AI is designing your curriculum... This usually takes 30-60 seconds.
                  </p>
                  <div className="mt-4 flex justify-center gap-2">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-3 h-3 rounded-full bg-[#00E5FF]"
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {step === 3 && curriculum && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CurriculumViewer curriculum={curriculum} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}