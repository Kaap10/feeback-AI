import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Target, Award, Clock, BookOpen, 
  Download, FileText, Sparkles, User, Calendar
} from 'lucide-react';
import AIInsights from './AIInsights';
import { pdfService } from '@/services/pdfService';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  data: any;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [overallStats, setOverallStats] = useState<any>(null);
  const [dataId, setDataId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (data) {
      const stats = calculateOverallStats(data);
      setOverallStats(stats);
      
      // Save data and get ID for persistence
      const id = dataService.saveData(data, stats);
      setDataId(id);
    }
  }, [data]);

  const getSubjectName = (subjectId: string) => {
    const subjectMap: { [key: string]: string } = {
      '607018ee404ae53194e73d92': 'Physics',
      '607018ee404ae53194e73d90': 'Chemistry', 
      '607018ee404ae53194e73d91': 'Mathematics'
    };
    return subjectMap[subjectId] || 'Unknown Subject';
  };

  const calculateOverallStats = (testData: any) => {
    // Handle both array of tests and single test data
    const testsArray = Array.isArray(testData) ? testData : Object.values(testData);
    
    let totalQuestions = 0;
    let totalCorrect = 0;
    let totalAttempted = 0;
    let totalTimeSpent = 0;
    const subjectStats: any = {};

    testsArray.forEach((testItem: any) => {
      if (testItem.subjects) {
        testItem.subjects.forEach((subject: any) => {
          const subjectName = getSubjectName(subject.subjectId.$oid || subject.subjectId);
          
          if (!subjectStats[subjectName]) {
            subjectStats[subjectName] = { 
              total: 0, 
              correct: 0, 
              attempted: 0,
              timeSpent: 0,
              marks: 0
            };
          }
          
          subjectStats[subjectName].attempted += subject.totalAttempted || 0;
          subjectStats[subjectName].correct += subject.totalCorrect || 0;
          subjectStats[subjectName].timeSpent += subject.totalTimeTaken || 0;
          subjectStats[subjectName].marks += subject.totalMarkScored || 0;
          
          totalAttempted += subject.totalAttempted || 0;
          totalCorrect += subject.totalCorrect || 0;
          totalTimeSpent += subject.totalTimeTaken || 0;
        });
        
        if (testItem.test) {
          totalQuestions += testItem.test.totalQuestions || 0;
        }
      }
    });

    const avgAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    
    const subjectStatsArray = Object.entries(subjectStats).map(([subject, stats]: [string, any]) => ({
      subject,
      attempted: stats.attempted,
      correct: stats.correct,
      accuracy: stats.attempted > 0 ? Math.round((stats.correct / stats.attempted) * 100) : 0,
      timeSpent: Math.round(stats.timeSpent / 60), // Convert to minutes
      marks: stats.marks
    }));

    const sortedByAccuracy = [...subjectStatsArray].sort((a, b) => b.accuracy - a.accuracy);
    
    return {
      totalTests: testsArray.length,
      totalQuestions: totalQuestions || totalAttempted,
      totalCorrect,
      totalAttempted,
      avgAccuracy,
      subjectStats: subjectStatsArray,
      strongestSubject: sortedByAccuracy[0],
      weakestSubject: sortedByAccuracy[sortedByAccuracy.length - 1],
      chartData: subjectStatsArray,
      timeSpentData: subjectStatsArray.map((subject, index) => ({
        test: subject.subject,
        timeSpent: subject.timeSpent,
        accuracy: subject.accuracy
      })),
      difficultyData: [
        {
          difficulty: 'Overall Performance',
          total: totalAttempted,
          correct: totalCorrect,
          accuracy: avgAccuracy
        }
      ],
      radarData: subjectStatsArray.slice(0, 6).map(subject => ({
        subject: subject.subject,
        score: subject.accuracy
      }))
    };
  };

  const generatePDFReport = async () => {
    if (!overallStats) return;

    setIsGeneratingPDF(true);
    
    try {
      // Get saved insights if available
      const savedInsights = dataId ? dataService.getInsights(dataId) : null;
      
      await pdfService.generateReport({
        studentData: data,
        overallStats: overallStats,
        insights: savedInsights
      });

      toast({
        title: "PDF Generated Successfully",
        description: "Your performance report has been downloaded!",
      });
    } catch (error: any) {
      toast({
        title: "PDF Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  if (!overallStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Processing your data...</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="space-y-6" id="dashboard-content">
      {/* Student Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Student Performance Report</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Report Generated: {new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-4 h-4" />
                    <span>{overallStats.totalTests} Test(s) Analyzed</span>
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={generatePDFReport} 
              disabled={isGeneratingPDF}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.avgAccuracy}%</div>
                <div className="flex items-center space-x-2 mt-2">
                  <Progress value={overallStats.avgAccuracy} className="flex-1" />
                  <Badge variant={overallStats.avgAccuracy >= 70 ? "default" : "secondary"}>
                    {overallStats.avgAccuracy >= 70 ? "Good" : "Needs Work"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overallStats.totalAttempted}</div>
                <p className="text-xs text-muted-foreground">
                  {overallStats.totalCorrect} correct answers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Strongest Subject</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">
                  {overallStats.strongestSubject?.subject || 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {overallStats.strongestSubject?.accuracy || 0}% accuracy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Focus Area</CardTitle>
                <TrendingDown className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-orange-600">
                  {overallStats.weakestSubject?.subject || 'N/A'}
                </div>
                <p className="text-sm text-muted-foreground">
                  {overallStats.weakestSubject?.accuracy || 0}% accuracy
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Performance</CardTitle>
                <CardDescription>Accuracy percentage by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={overallStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Questions Distribution</CardTitle>
                <CardDescription>Questions attempted by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={overallStats.chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ subject, attempted }) => `${subject}: ${attempted}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="attempted"
                    >
                      {overallStats.chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time vs Accuracy</CardTitle>
                <CardDescription>Performance trends by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={overallStats.timeSpentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="test" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="accuracy" stroke="#8884d8" name="Accuracy %" />
                    <Line type="monotone" dataKey="timeSpent" stroke="#82ca9d" name="Time (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subject Marks Distribution</CardTitle>
                <CardDescription>Marks scored by subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={overallStats.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Skills Radar</CardTitle>
              <CardDescription>Comprehensive skill assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={overallStats.radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar name="Score" dataKey="score" stroke="#335EEA" fill="#335EEA" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsights data={data} overallStats={overallStats} dataId={dataId} />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <span>Strengths to Leverage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overallStats.strongestSubject && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-semibold text-green-800">Excellent in {overallStats.strongestSubject.subject}</h4>
                      <p className="text-sm text-green-600">Continue practicing to maintain this high performance</p>
                    </div>
                  )}
                  {overallStats.subjectStats.filter((s: any) => s.accuracy >= 70).slice(0, 2).map((subject: any, index: number) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-800">Strong {subject.subject} Skills</h4>
                      <p className="text-sm text-blue-600">{subject.accuracy}% accuracy rate</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-orange-500" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overallStats.weakestSubject && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800">Focus on {overallStats.weakestSubject.subject}</h4>
                      <p className="text-sm text-red-600">Dedicate extra study time to improve from {overallStats.weakestSubject.accuracy}%</p>
                    </div>
                  )}
                  {overallStats.subjectStats.filter((s: any) => s.accuracy < 70).slice(0, 2).map((subject: any, index: number) => (
                    <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-semibold text-yellow-800">Improve {subject.subject}</h4>
                      <p className="text-sm text-yellow-600">Current: {subject.accuracy}% - Target: 80%+</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
              <CardDescription>Recommended actions based on your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    title: `Study Plan for ${overallStats.weakestSubject?.subject || 'Weaker Areas'}`,
                    description: "Create a structured 2-week study plan focusing on fundamental concepts",
                    priority: "High",
                    timeframe: "2 weeks"
                  },
                  {
                    title: "Practice Time Management",
                    description: "Take timed practice tests to improve speed while maintaining accuracy",
                    priority: "Medium", 
                    timeframe: "1 week"
                  },
                  {
                    title: "Review Missed Questions",
                    description: "Analyze incorrect answers to identify knowledge gaps",
                    priority: "High",
                    timeframe: "3 days"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                            {item.priority}
                          </Badge>
                          <Badge variant="outline" className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{item.timeframe}</span>
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
