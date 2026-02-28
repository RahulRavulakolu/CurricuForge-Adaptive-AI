import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import {
  Sparkles, Search, Filter, GraduationCap, Layers, Clock,
  ChevronRight, Plus, Trash2, Copy, BookOpen, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function Repository() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const { data: curriculaData = { items: [] }, isLoading } = useQuery({
    queryKey: ['curricula'],
    queryFn: () => base44.entities.Curriculum.list(),
  });

  // Extract array from response object
  const curriculaArray = Array.isArray(curriculaData?.items) ? curriculaData.items : [];

  const filteredCurricula = curriculaArray.filter(c => {
    const matchesSearch = !searchQuery ||
      c.program_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skill?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || c.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-[#39FF14]/20 text-[#39FF14] border-[#39FF14]/30';
      case 'review': return 'bg-[#FFE66D]/20 text-[#FFE66D] border-[#FFE66D]/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
          <Link to={createPageUrl('Landing')} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#8B5FFF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">CurricuForge</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Generator')}>
              <Button className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                New Curriculum
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Curriculum Repository</h1>
          <p className="text-gray-400">Browse and manage all your generated curricula</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search curricula..."
              className="pl-10 bg-white/5 border-white/10 text-white h-12"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white/5 border-white/10 text-white h-12">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent className="bg-[#1F2937] border-white/10">
              <SelectItem value="all" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">All Levels</SelectItem>
              <SelectItem value="Diploma" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Diploma</SelectItem>
              <SelectItem value="B.Tech" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">B.Tech</SelectItem>
              <SelectItem value="Masters" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Masters</SelectItem>
              <SelectItem value="Certification" className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white">Certification</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Curriculum Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-[#1F2937]/40 animate-pulse" />
            ))}
          </div>
        ) : filteredCurricula.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-[#1F2937] flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No curricula found</h3>
            <p className="text-gray-400 mb-6">Start by generating your first curriculum</p>
            <Link to={createPageUrl('Generator')}>
              <Button className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Curriculum
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCurricula.map((curriculum, index) => (
              <motion.div
                key={curriculum.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl bg-[#1F2937]/40 backdrop-blur-xl border border-white/5 hover:border-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className={getStatusColor(curriculum.status)}>
                    {curriculum.status || 'draft'}
                  </Badge>
                  <div className="text-xs text-gray-500">
                    {new Date(curriculum.created_date).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  {curriculum.program_title}
                </h3>

                <div className="space-y-2 mb-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>{curriculum.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    <span>{curriculum.semester_count} Semesters</span>
                  </div>
                  {curriculum.skill && (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-[#00E5FF]">{curriculum.skill}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link to={createPageUrl(`CurriculumViewer?curriculum=${curriculum._id}`)} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-white/10 hover:bg-white/5"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(curriculum, null, 2));
                      // You could add a toast notification here
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                {/* Hover gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00E5FF]/5 to-[#8B5FFF]/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}