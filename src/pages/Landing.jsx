import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { 
  Play, ArrowRight, Cpu, FileJson, FileText, 
  Sparkles, Shield, Users, BarChart3, Zap, 
  GraduationCap, Building2, Briefcase, Check,
  ChevronRight, ExternalLink, Github
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeatureCard from '@/components/landing/FeatureCard';
import PersonaCard from '@/components/landing/PersonaCard';
import StepCard from '@/components/landing/StepCard';

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Shield,
      title: "Constraint-Aware Planning",
      description: "Respects weekly hours, credit limits, and prerequisites automatically.",
      color: "cyan"
    },
    {
      icon: Users,
      title: "Multi-Persona Tracks",
      description: "Generate masters, diploma, and fast-track versions from one brief.",
      color: "violet"
    },
    {
      icon: Cpu,
      title: "Local AI, Privacy-First",
      description: "Run IBM Granite via Ollama on your own machine, no external APIs.",
      color: "lime"
    },
    {
      icon: BarChart3,
      title: "OBE-Ready Analytics",
      description: "CO-PO mapping and Bloom's analytics for NBA/NAAC compliance.",
      color: "cyan"
    },
    {
      icon: Sparkles,
      title: "AI Critic Layer",
      description: "Second AI validates quality, flags overlaps and missing prerequisites.",
      color: "violet"
    },
    {
      icon: FileText,
      title: "Export-Friendly",
      description: "PDF, JSON, and future LMS integrations for seamless delivery.",
      color: "lime"
    }
  ];

  const personas = [
    {
      role: "Curriculum Coordinator",
      quote: "We turned a 3-month program design into a weekend job.",
      icon: GraduationCap,
      color: "cyan"
    },
    {
      role: "Bootcamp Program Manager",
      quote: "We prototype 3 variants for every client in one afternoon.",
      icon: Building2,
      color: "violet"
    },
    {
      role: "Corporate L&D Lead",
      quote: "Tracks for freshers and seniors come from the same skill map.",
      icon: Briefcase,
      color: "lime"
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Describe Your Program",
      description: "Enter skill, level, semesters, weekly hours, and constraints.",
      icon: FileText
    },
    {
      number: "02",
      title: "AI Designs Your Roadmap",
      description: "Granite generates a balanced semester-wise curriculum in seconds.",
      icon: Cpu
    },
    {
      number: "03",
      title: "Preview, Export, Refine",
      description: "View interactive semester cards and export as PDF/JSON for approvals.",
      icon: FileJson
    }
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0B1020]/80 backdrop-blur-xl border-b border-white/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">CurricuForge</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How it works</a>
            <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
            <a href="#personas" className="text-gray-400 hover:text-white transition-colors text-sm">Personas</a>
            <a href="#demo" className="text-gray-400 hover:text-white transition-colors text-sm">Demo</a>
          </div>

          <Link to={createPageUrl('Generator')}>
            <Button className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0 px-6">
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="relative min-h-screen flex items-center pt-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00E5FF]/10 border border-[#00E5FF]/20 mb-6">
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[#00E5FF] text-sm font-medium">AI-Powered Curriculum Copilot</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Design future-ready curricula{' '}
              <span className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] bg-clip-text text-transparent">
                in minutes.
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-8 leading-relaxed max-w-xl">
              Generate complete, multi-semester programs with AI — constraint-aware, 
              industry-aligned, and ready to export.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link to={createPageUrl('Generator')}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:shadow-lg hover:shadow-[#00E5FF]/25 hover:scale-105 transition-all text-white border-0 px-8 py-6 text-lg"
                >
                  Generate My First Program
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-[#00E5FF]/30 text-white hover:bg-[#00E5FF]/10 hover:text-white px-8 py-6 text-lg bg-transparent"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch 40s Demo
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#39FF14]" />
                Powered by Granite AI
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                React + Express
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#8B5FFF]" />
                No cloud data leakage
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative flex items-center justify-center"
          >
            <div className="w-full h-96 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-2xl border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-[#00E5FF] mx-auto mb-4" />
                <p className="text-gray-400">AI Curriculum Visualization</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How CurricuForge Works</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Three simple steps to transform your curriculum design process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <StepCard key={index} {...step} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-32">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Built for Real Curriculum Teams</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to design, validate, and deploy world-class curricula
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Personas */}
      <section id="personas" className="relative py-32 bg-gradient-to-b from-transparent via-[#0B1020]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Made for Everyone Who Designs Learning</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From universities to bootcamps, CurricuForge adapts to your workflow
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {personas.map((persona, index) => (
              <PersonaCard key={index} {...persona} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl bg-gradient-to-br from-[#111827] to-[#1D293B] border border-white/10 overflow-hidden"
          >
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Ship Your Next Program{' '}
                <span className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] bg-clip-text text-transparent">
                  10× Faster
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                Start with a live demo and customize CurricuForge for your institution
              </p>
              
              <Link to={createPageUrl('Generator')}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:shadow-lg hover:shadow-[#00E5FF]/25 hover:scale-105 transition-all text-white border-0 px-10 py-6 text-lg"
                >
                  Open Demo App
                  <Zap className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-gray-400 text-sm">
              AI copilot for future-ready curricula
            </span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Docs</a>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
              <Github className="w-4 h-4" /> GitHub
            </a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}