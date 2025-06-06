import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Brain, TrendingUp, Target, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { dataService } from '@/services/dataService';
import { useToast } from '@/hooks/use-toast';
import APIKeyConfig from './APIKeyConfig';

interface AIInsightsProps {
  data: any;
  overallStats: any;
  dataId?: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ data, overallStats, dataId }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showApiConfig, setShowApiConfig] = useState(false);
  const { toast } = useToast();

  // Load saved insights on component mount
  useEffect(() => {
    if (dataId) {
      const savedInsights = dataService.getInsights(dataId);
      if (savedInsights) {
        setInsights(savedInsights);
        return;
      }
    }
    generateInsights();
  }, [data, dataId]);

  const generateInsights = async (forceReal = false) => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);

    const apiKey = aiService.getApiKey();
    const useRealAI = forceReal || apiKey;

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 200);

    try {
      let generatedInsights;

      if (useRealAI && apiKey) {
        // Use real AI
        generatedInsights = await aiService.generateInsights({
          studentData: data,
          overallStats: overallStats
        });

        toast({
          title: "AI Insights Generated",
          description: "Real AI analysis completed successfully!",
        });
      } else {
        // Use mock insights
        await new Promise(resolve => setTimeout(resolve, 2000));
        generatedInsights = generateMockInsights();
        
        if (!apiKey) {
          toast({
            title: "Using Mock Data",
            description: "Configure OpenAI API key for real AI insights.",
            variant: "default",
          });
        }
      }

      clearInterval(interval);
      setProgress(100);
      setInsights(generatedInsights);

      // Save insights if we have a dataId
      if (dataId) {
        dataService.saveInsights(dataId, generatedInsights);
      }

    } catch (error: any) {
      clearInterval(interval);
      setError(error.message);
      
      // Fallback to mock insights on error
      const mockInsights = generateMockInsights();
      setInsights(mockInsights);
      
      toast({
        title: "AI Error - Using Mock Data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockInsights = () => {
    const avgAccuracy = overallStats.avgAccuracy;
    const weakestSubject = overallStats.weakestSubject;
    const strongestSubject = overallStats.strongestSubject;

    return {
      summary: `Based on your performance data, you demonstrate ${avgAccuracy >= 75 ? 'strong' : avgAccuracy >= 60 ? 'moderate' : 'developing'} academic capabilities with particular strength in ${strongestSubject?.subject}. Your overall accuracy of ${avgAccuracy}% indicates ${avgAccuracy >= 75 ? 'excellent progress' : 'areas for focused improvement'}.`,
      
      personalizedFeedback: `Hi ${data.student_name}! You're showing great potential, especially in ${strongestSubject?.subject} where you achieved ${strongestSubject?.accuracy}%. This suggests you have a solid foundation in problem-solving and conceptual understanding. However, I notice that ${weakestSubject?.subject} needs some attention - but don't worry, with focused practice, you can definitely improve!`,
      
      learningStyle: {
        type: avgAccuracy >= 75 ? 'Analytical Learner' : 'Visual Learner',
        description: avgAccuracy >= 75 
          ? 'You excel at breaking down complex problems and show strong logical reasoning skills.'
          : 'You benefit from visual aids and hands-on practice to reinforce learning.',
        strengths: avgAccuracy >= 75 
          ? ['Problem decomposition', 'Logical reasoning', 'Pattern recognition']
          : ['Visual processing', 'Practical application', 'Creative thinking']
      },
      
      cognitiveAnalysis: {
        strengths: [
          { area: 'Conceptual Understanding', score: Math.min(avgAccuracy + 5, 100) },
          { area: 'Problem Solving', score: avgAccuracy },
          { area: 'Time Management', score: Math.max(avgAccuracy - 10, 0) },
          { area: 'Accuracy', score: avgAccuracy }
        ],
        development: [
          { area: weakestSubject?.subject || 'Focus Subject', priority: 'High' },
          { area: 'Speed vs Accuracy Balance', priority: 'Medium' },
          { area: 'Concept Revision', priority: 'Medium' }
        ]
      },
      
      actionItems: [
        {
          title: `Master ${weakestSubject?.subject}`,
          description: `Dedicate 20-30 minutes daily to ${weakestSubject?.subject} fundamentals`,
          priority: 'High',
          timeframe: '2 weeks'
        },
        {
          title: 'Practice Time Management',
          description: 'Take timed practice tests to improve speed without sacrificing accuracy',
          priority: 'Medium',
          timeframe: '1 week'
        },
        {
          title: 'Leverage Your Strengths',
          description: `Use your strong ${strongestSubject?.subject} skills to build confidence`,
          priority: 'Low',
          timeframe: 'Ongoing'
        }
      ],
      
      motivationalMessage: avgAccuracy >= 75 
        ? "You're doing fantastic! Your strong analytical skills and consistent performance show real academic talent. Keep challenging yourself and maintain this excellent momentum!"
        : avgAccuracy >= 60
        ? "You're on the right track! Your foundation is solid, and with some focused effort on your weaker areas, you'll see significant improvement. Every expert was once a beginner!"
        : "Every journey starts with a single step, and you've already taken it! Your areas for improvement are actually opportunities for growth. With consistent practice and the right strategy, you'll be amazed at your progress!"
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRetryWithRealAI = () => {
    const apiKey = aiService.getApiKey();
    if (!apiKey) {
      setShowApiConfig(true);
      return;
    }
    generateInsights(true);
  };

  if (showApiConfig) {
    return (
      <div className="space-y-6">
        <APIKeyConfig />
        <Button 
          onClick={() => setShowApiConfig(false)} 
          variant="outline" 
          className="w-full"
        >
          Back to Insights
        </Button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary animate-pulse" />
            <span>Generating AI Insights...</span>
          </CardTitle>
          <CardDescription>
            {aiService.getApiKey() 
              ? "Real AI is analyzing your performance patterns and generating personalized feedback"
              : "Generating simulated AI insights based on your data"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={progress} className="w-full" />
            <div className="text-center text-sm text-muted-foreground">
              {progress < 30 && "Analyzing performance patterns..."}
              {progress >= 30 && progress < 60 && "Identifying strengths and weaknesses..."}
              {progress >= 60 && progress < 90 && "Generating personalized recommendations..."}
              {progress >= 90 && "Finalizing insights..."}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error && !insights) {
    return (
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            <span>AI Generation Failed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-red-600">{error}</p>
            <div className="flex space-x-2">
              <Button onClick={() => generateInsights()} variant="outline">
                Try Mock Insights
              </Button>
              <Button onClick={handleRetryWithRealAI}>
                Configure AI & Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights) return null;

  const isUsingRealAI = aiService.getApiKey() && !error;

  return (
    <div className="space-y-6">
      {/* AI Status Banner */}
      <Card className={isUsingRealAI ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" : "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={isUsingRealAI ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {isUsingRealAI ? "Real AI" : "Demo Mode"}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {isUsingRealAI 
                  ? "Powered by OpenAI GPT-4" 
                  : "Using simulated insights"
                }
              </span>
            </div>
            {!isUsingRealAI && (
              <Button onClick={() => setShowApiConfig(true)} size="sm">
                Enable Real AI
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span className="gradient-text">AI Performance Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{insights.summary}</p>
        </CardContent>
      </Card>

      {/* Personalized Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-[#335EEA]" />
            <span>Personalized Feedback</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed">{insights.personalizedFeedback}</p>
          </div>
        </CardContent>
      </Card>

      {/* Learning Style Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-green-600" />
            <span>Learning Style Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge className="bg-green-100 text-green-800">{insights.learningStyle.type}</Badge>
              </div>
              <p className="text-gray-600 mb-3">{insights.learningStyle.description}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Your Learning Strengths:</h4>
              <div className="flex flex-wrap gap-2">
                {insights.learningStyle.strengths.map((strength: string, index: number) => (
                  <Badge key={index} variant="secondary">{strength}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cognitive Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cognitive Strengths</CardTitle>
            <CardDescription>Areas where you excel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.cognitiveAnalysis.strengths.map((strength: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{strength.area}</span>
                    <span className="text-muted-foreground">{strength.score}%</span>
                  </div>
                  <Progress value={strength.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Development Areas</CardTitle>
            <CardDescription>Focus areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {insights.cognitiveAnalysis.development.map((area: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{area.area}</span>
                  <Badge className={getPriorityColor(area.priority)}>{area.priority}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span>Actionable Recommendations</span>
          </CardTitle>
          <CardDescription>
            Specific steps to improve your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.actionItems.map((item: any, index: number) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-lg">{item.title}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      <Badge variant="outline" className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.timeframe}</span>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Motivational Message</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-700 leading-relaxed font-medium">
            {insights.motivationalMessage}
          </p>
        </CardContent>
      </Card>

      {/* Regenerate Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-2">
            <Button 
              onClick={() => generateInsights()} 
              variant="outline" 
              className="flex-1" 
              size="lg"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Generate New Insights
            </Button>
            {!isUsingRealAI && (
              <Button 
                onClick={handleRetryWithRealAI}
                className="flex-1"
                size="lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Real AI
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
