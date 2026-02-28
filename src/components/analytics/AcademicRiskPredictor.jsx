import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, TrendingUp, TrendingDown, Users, Target,
  Brain, Activity, BookOpen, Award, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcademicRiskPredictor({ curriculum }) {
  const [studentData, setStudentData] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock student data generation
  useEffect(() => {
    if (curriculum?.semesters) {
      const mockStudents = generateMockStudentData(curriculum);
      setStudentData(mockStudents);
      if (mockStudents.length > 0) {
        setSelectedCourse(mockStudents[0].courseCode);
      }
    }
  }, [curriculum]);

  const generateMockStudentData = (curriculum) => {
    const students = [];
    let studentId = 1;

    curriculum.semesters.forEach(semester => {
      semester.courses?.forEach(course => {
        // Generate 5-10 mock students per course
        const numStudents = Math.floor(Math.random() * 6) + 5;
        
        for (let i = 0; i < numStudents; i++) {
          const attendance = Math.floor(Math.random() * 40) + 60; // 60-100%
          const internalMarks = Math.floor(Math.random() * 40) + 35; // 35-75
          const coPerformance = generateCOPerformance(course.course_outcomes || 4);
          
          students.push({
            id: studentId++,
            name: `Student ${studentId}`,
            courseCode: course.code,
            courseName: course.name,
            semester: semester.number,
            attendance,
            internalMarks,
            coPerformance,
            riskLevel: calculateRiskLevel(attendance, internalMarks, coPerformance),
            recommendations: generateRecommendations(attendance, internalMarks, coPerformance)
          });
        }
      });
    });

    return students;
  };

  const generateCOPerformance = (numCOs) => {
    const performance = [];
    for (let i = 1; i <= numCOs; i++) {
      performance.push({
        co: `CO${i}`,
        attainment: Math.floor(Math.random() * 40) + 35, // 35-75%
        risk: Math.random() > 0.6 // 40% chance of risk
      });
    }
    return performance;
  };

  const calculateRiskLevel = (attendance, marks, coPerf) => {
    const avgCOAttainment = coPerf.reduce((sum, co) => sum + co.attainment, 0) / coPerf.length;
    const riskScore = ((100 - attendance) * 0.3) + ((100 - marks) * 0.4) + ((100 - avgCOAttainment) * 0.3);
    
    if (riskScore > 50) return 'HIGH';
    if (riskScore > 30) return 'MEDIUM';
    if (riskScore > 15) return 'LOW';
    return 'MINIMAL';
  };

  const generateRecommendations = (attendance, marks, coPerf) => {
    const recommendations = [];
    
    if (attendance < 75) {
      recommendations.push('Improve attendance through counseling');
    }
    if (marks < 50) {
      recommendations.push('Extra tutorial sessions');
      recommendations.push('Additional practice assignments');
    }
    
    const atRiskCOs = coPerf.filter(co => co.risk);
    if (atRiskCOs.length > 0) {
      recommendations.push(`Focus on CO${atRiskCOs.map(co => co.co).join(', CO')} remediation`);
    }
    
    return recommendations;
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    
    // Simulate analysis processing
    setTimeout(() => {
      const courseStudents = studentData.filter(student => student.courseCode === selectedCourse);
      const atRiskStudents = courseStudents.filter(student => 
        student.riskLevel === 'HIGH' || student.riskLevel === 'MEDIUM'
      );
      
      const riskDistribution = {
        HIGH: courseStudents.filter(s => s.riskLevel === 'HIGH').length,
        MEDIUM: courseStudents.filter(s => s.riskLevel === 'MEDIUM').length,
        LOW: courseStudents.filter(s => s.riskLevel === 'LOW').length,
        MINIMAL: courseStudents.filter(s => s.riskLevel === 'MINIMAL').length
      };

      const coRiskAnalysis = analyzeCORisks(courseStudents);
      
      setAnalysisResults({
        totalStudents: courseStudents.length,
        atRiskStudents: atRiskStudents.length,
        riskPercentage: Math.round((atRiskStudents.length / courseStudents.length) * 100),
        riskDistribution,
        coRiskAnalysis,
        topRiskFactors: identifyTopRiskFactors(courseStudents)
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const analyzeCORisks = (students) => {
    const coMap = {};
    
    students.forEach(student => {
      student.coPerformance.forEach(co => {
        if (!coMap[co.co]) {
          coMap[co.co] = { total: 0, atRisk: 0, avgAttainment: 0 };
        }
        coMap[co.co].total++;
        coMap[co.co].avgAttainment += co.attainment;
        if (co.risk) coMap[co.co].atRisk++;
      });
    });

    // Calculate averages
    Object.keys(coMap).forEach(co => {
      coMap[co].avgAttainment = Math.round(coMap[co].avgAttainment / coMap[co].total);
      coMap[co].riskPercentage = Math.round((coMap[co].atRisk / coMap[co].total) * 100);
    });

    return coMap;
  };

  const identifyTopRiskFactors = (students) => {
    const factors = {
      'Low Attendance': students.filter(s => s.attendance < 75).length,
      'Poor Internal Marks': students.filter(s => s.internalMarks < 50).length,
      'CO Non-Attainment': students.filter(s => 
        s.coPerformance.some(co => co.attainment < 50)
      ).length
    };

    return Object.entries(factors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([factor, count]) => ({ factor, count }));
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'MEDIUM': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'LOW': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'MINIMAL': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'HIGH': return AlertTriangle;
      case 'MEDIUM': return AlertCircle;
      case 'LOW': return TrendingDown;
      case 'MINIMAL': return TrendingUp;
      default: return Activity;
    }
  };

  const courses = [...new Set(studentData.map(s => s.courseCode))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#00E5FF]" />
            Academic Risk Predictor
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            AI-powered analysis of student performance and risk factors
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Course Selector */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-md text-sm"
          >
            {courses.map(course => (
              <option key={course} value={course}>
                {course} - {studentData.find(s => s.courseCode === course)?.courseName}
              </option>
            ))}
          </select>
          
          <Button
            onClick={runAnalysis}
            disabled={isAnalyzing || !selectedCourse}
            className="bg-gradient-to-r from-[#00E5FF] to-[#8B5FFF] hover:opacity-90 text-white border-0"
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Analysis Results */}
      {analysisResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Risk Overview Cards */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Total Students</p>
                    <p className="text-2xl font-bold">{analysisResults.totalStudents}</p>
                  </div>
                  <Users className="w-8 h-8 text-[#00E5FF]" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">At-Risk Students</p>
                    <p className="text-2xl font-bold text-red-400">{analysisResults.atRiskStudents}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Risk Percentage</p>
                    <p className="text-2xl font-bold text-yellow-400">{analysisResults.riskPercentage}%</p>
                  </div>
                  <Activity className="w-8 h-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">High Risk COs</p>
                    <p className="text-2xl font-bold text-orange-400">
                      {Object.values(analysisResults.coRiskAnalysis).filter(co => co.riskPercentage > 50).length}
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-orange-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Distribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#8B5FFF]" />
                  Risk Level Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analysisResults.riskDistribution).map(([level, count]) => {
                    const RiskIcon = getRiskIcon(level);
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RiskIcon className="w-4 h-4" />
                          <span className="text-sm">{level}</span>
                        </div>
                        <Badge className={getRiskColor(level)}>
                          {count} students
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Top Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysisResults.topRiskFactors.map((factor, index) => (
                    <div key={factor.factor} className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">{factor.factor}</span>
                      <Badge variant="outline" className="border-red-500/30 text-red-400">
                        {factor.count} students
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* At-Risk Students Details */}
          <Card className="bg-[#1F2937]/40 backdrop-blur-xl border-white/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                At-Risk Student Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {studentData
                  .filter(student => student.courseCode === selectedCourse)
                  .filter(student => student.riskLevel === 'HIGH' || student.riskLevel === 'MEDIUM')
                  .slice(0, 10) // Show top 10 at-risk students
                  .map(student => {
                    const RiskIcon = getRiskIcon(student.riskLevel);
                    return (
                      <motion.div
                        key={student.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <RiskIcon className="w-4 h-4" />
                            <span className="font-medium">{student.name}</span>
                          </div>
                          <Badge className={getRiskColor(student.riskLevel)}>
                            {student.riskLevel}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <p className="text-gray-400">Attendance</p>
                            <p className="font-medium">{student.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Internal Marks</p>
                            <p className="font-medium">{student.internalMarks}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Avg CO Attainment</p>
                            <p className="font-medium">
                              {Math.round(student.coPerformance.reduce((sum, co) => sum + co.attainment, 0) / student.coPerformance.length)}%
                            </p>
                          </div>
                        </div>

                        {/* CO Risk Details */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-400 mb-2">CO Performance Risks:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.coPerformance
                              .filter(co => co.risk)
                              .map(co => (
                                <Badge key={co.co} variant="outline" className="border-red-500/30 text-red-400 text-xs">
                                  ⚠ {co.co}: {co.attainment}%
                                </Badge>
                              ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <p className="text-sm text-gray-400 mb-2">Recommended Interventions:</p>
                          <div className="flex flex-wrap gap-2">
                            {student.recommendations.map((rec, index) => (
                              <Badge key={index} className="bg-[#00E5FF]/20 text-[#00E5FF] border-[#00E5FF]/30 text-xs">
                                {rec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
