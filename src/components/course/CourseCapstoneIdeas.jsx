import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { 
  Sparkles, Loader2, Briefcase, Building2, Cpu, 
  Lightbulb, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function CourseCapstoneIdeas({ course }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [capstoneIdeas, setCapstoneIdeas] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    const prompt = `Generate 3 innovative capstone project ideas for a student completing the course:

Course: ${course.title} (${course.code})
Program: ${course.program}
Semester: ${course.semester}
Topics Covered: ${course.units?.map(u => u.title).join(', ') || 'Various topics'}

IMPORTANT: Generate project ideas based on LATEST 2024-2025 industry trends and technologies.

Each project should:
1. Be practical and industry-relevant
2. Apply concepts learned in the course
3. Have clear deliverables
4. Be achievable in 1 semester

Return a JSON object with this structure:
{
  "capstone_ideas": [
    {
      "title": "Project Title",
      "description": "Detailed 2-3 sentence description of the project",
      "industry_domain": "FinTech|Healthcare|E-commerce|AI|IoT|Education|Gaming",
      "skills_applied": ["skill1", "skill2", "skill3", "skill4"],
      "complexity": "Beginner|Intermediate|Advanced",
      "deliverables": ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
      "technologies": ["Tech1", "Tech2", "Tech3"]
    }
  ]
}`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            capstone_ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  industry_domain: { type: "string" },
                  skills_applied: { type: "array", items: { type: "string" } },
                  complexity: { type: "string" },
                  deliverables: { type: "array", items: { type: "string" } },
                  technologies: { type: "array", items: { type: "string" } }
                }
              }
            }
          }
        }
      });
      
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      setCapstoneIdeas(data.capstone_ideas);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!capstoneIdeas) return;
    
    let content = `CAPSTONE PROJECT IDEAS for ${course.title}\n\n`;
    capstoneIdeas.forEach((idea, idx) => {
      content += `${idx + 1}. ${idea.title}\n`;
      content += `   Domain: ${idea.industry_domain} | Complexity: ${idea.complexity}\n`;
      content += `   Description: ${idea.description}\n`;
      content += `   Skills: ${idea.skills_applied?.join(', ')}\n`;
      content += `   Technologies: ${idea.technologies?.join(', ')}\n`;
      content += `   Deliverables: ${idea.deliverables?.join(', ')}\n\n`;
    });
    
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDomainIcon = (domain) => {
    const icons = {
      'FinTech': Briefcase,
      'Healthcare': Building2,
      'E-commerce': Cpu,
      'AI': Sparkles,
      'IoT': Cpu,
      'Education': Lightbulb,
      'Gaming': Cpu,
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
      'IoT': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Education': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Gaming': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'default': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    };
    return colors[domain] || colors.default;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">💡</span>
          CAPSTONE PROJECT IDEAS
        </h2>
        
        {!capstoneIdeas && (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-gradient-to-r from-[#8B5FFF] to-[#00E5FF] hover:opacity-90 text-white font-semibold"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Ideas
              </>
            )}
          </Button>
        )}
        
        {capstoneIdeas && (
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
                Copy All
              </>
            )}
          </Button>
        )}
      </div>

      {!capstoneIdeas && !isGenerating && (
        <p className="text-gray-400 text-center py-8">
          Click "Generate Ideas" to get 3 innovative capstone project suggestions based on this course.
        </p>
      )}

      {isGenerating && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-[#8B5FFF]" />
          <p className="text-gray-400">Generating innovative project ideas...</p>
        </div>
      )}

      {capstoneIdeas && (
        <div className="grid md:grid-cols-3 gap-4">
          {capstoneIdeas.map((idea, idx) => {
            const DomainIcon = getDomainIcon(idea.industry_domain);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5FFF] to-[#00E5FF] flex items-center justify-center">
                    <span className="text-white font-bold">{idx + 1}</span>
                  </div>
                  <Badge variant="outline" className={`${getDomainColor(idea.industry_domain)} border`}>
                    <DomainIcon className="w-3 h-3 mr-1" />
                    {idea.industry_domain}
                  </Badge>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{idea.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Technologies</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {idea.technologies?.map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#00E5FF]/10 text-xs text-[#00E5FF]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs text-gray-500 uppercase tracking-wide">Skills Applied</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {idea.skills_applied?.slice(0, 4).map((skill, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 text-xs text-gray-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-500">Complexity</span>
                    <Badge variant="outline" className={`text-xs ${
                      idea.complexity === 'Advanced' 
                        ? 'border-red-500/30 text-red-400' 
                        : idea.complexity === 'Intermediate'
                        ? 'border-yellow-500/30 text-yellow-400'
                        : 'border-green-500/30 text-green-400'
                    }`}>
                      {idea.complexity}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}