import React, { useState } from 'react';
import { Upload, Sparkles, BarChart3, FileText, Settings, Moon, Sun, Database, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import FileUpload from '@/components/FileUpload';
import Dashboard from '@/components/Dashboard';
import APIKeyConfig from '@/components/APIKeyConfig';
import { useTheme } from '@/hooks/useTheme';
import { aiService } from '@/services/aiService';
import { dataService } from '@/services/dataService';

const Index = () => {
  const [uploadedData, setUploadedData] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [showSettings, setShowSettings] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleFileUpload = (data: any) => {
    setUploadedData(data);
    setActiveTab('dashboard');
  };

  const isAIConfigured = !!aiService.getApiKey();
  const hasStoredData = dataService.getAllData().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-white/20">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="relative">
                <img src="/favicon.png" alt="MathonGo AI Logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold gradient-text">MathonGo AI</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Status Indicators */}
              <div className="hidden md:flex items-center space-x-2">
                <Badge variant={isAIConfigured ? "default" : "secondary"} className="text-xs">
                  <Zap className="w-3 h-3 mr-1" />
                  {isAIConfigured ? "AI Ready" : "Demo Mode"}
                </Badge>
                {hasStoredData && (
                  <Badge variant="outline" className="text-xs">
                    <Database className="w-3 h-3 mr-1" />
                    Data Saved
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Sun className="w-3 h-3 md:w-4 md:h-4" />
                <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                <Moon className="w-3 h-3 md:w-4 md:h-4" />
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="md:hidden"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="container mx-auto px-4 py-6">
          <APIKeyConfig />
        </div>
      )}

      {/* Hero Section */}
      {!uploadedData && !showSettings && (
        <section className="container mx-auto px-4 py-8 md:py-16 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4 md:mb-6">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span>Powered by AI • Fully Functional • 2025 Ready</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Transform Student Data into
              <span className="gradient-text block" style={{ '--gradient-from': '#335EEA', '--gradient-to': '#335EEA' }}>Actionable Insights</span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              Upload your test data and get real AI-powered analysis, beautiful visualizations, 
              and comprehensive PDF reports with personalized feedback.
            </p>

            {/* Feature Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Data Upload</span>
              </div>
              <div className="flex items-center justify-center space-x-2 bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">PDF Reports</span>
              </div>
              <div className={`flex items-center justify-center space-x-2 ${isAIConfigured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'} rounded-lg p-3`}>
                <div className={`w-2 h-2 ${isAIConfigured ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                <span className={`text-sm font-medium ${isAIConfigured ? 'text-green-700' : 'text-yellow-700'}`}>
                  {isAIConfigured ? 'Real AI' : 'Demo AI'}
                </span>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="flex flex-col items-center justify-center mt-8 md:mt-12">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-[#335EEA]/10 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-10 h-10 md:w-12 md:h-12 text-[#335EEA]" />
              </div>
              <p className="text-xl md:text-2xl font-semibold mb-2 text-gray-800">Drop your JSON file here</p>
              <p className="text-sm md:text-base text-muted-foreground mb-4">or click to browse your files</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12 px-4">
              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-3 md:pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Smart Upload</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm md:text-base">
                    Drag & drop JSON files with real-time validation and automatic data persistence
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-3 md:pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#335EEA] to-[#335EEA] rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">Real AI Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm md:text-base">
                    {isAIConfigured ? 'Live OpenAI GPT-4 analysis' : 'Advanced charts with simulated AI insights'} for deep understanding
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="hover-lift glass-effect border-0">
                <CardHeader className="text-center pb-3 md:pb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg mx-auto mb-3 md:mb-4 flex items-center justify-center">
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <CardTitle className="text-base md:text-lg">PDF Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-sm md:text-base">
                    Professional, downloadable reports with personalized feedback and actionable recommendations
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {!showSettings && (
        <main className="container mx-auto px-4 pb-8 md:pb-16">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 h-auto">
              <TabsTrigger value="upload" className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 py-2 md:py-3">
                <Upload className="w-4 h-4" />
                <span className="text-xs md:text-sm">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="dashboard" disabled={!uploadedData} className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 py-2 md:py-3">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs md:text-sm">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="reports" disabled={!uploadedData} className="flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 py-2 md:py-3">
                <FileText className="w-4 h-4" />
                <span className="text-xs md:text-sm">Reports</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6 md:space-y-8">
              <FileUpload onUpload={handleFileUpload} />
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-6 md:space-y-8">
              {uploadedData && <Dashboard data={uploadedData} />}
            </TabsContent>

            <TabsContent value="reports" className="space-y-6 md:space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Advanced Reporting</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Generate comprehensive PDF reports with {isAIConfigured ? 'real AI insights' : 'detailed analysis'} and personalized recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📊 Performance Analytics</h4>
                      <p className="text-sm text-muted-foreground">Detailed charts and statistics</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🤖 AI Insights</h4>
                      <p className="text-sm text-muted-foreground">{isAIConfigured ? 'Real OpenAI analysis' : 'Simulated intelligent feedback'}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">🎯 Recommendations</h4>
                      <p className="text-sm text-muted-foreground">Personalized improvement strategies</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">📈 Progress Tracking</h4>
                      <p className="text-sm text-muted-foreground">Visual progress indicators</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-4">
                      Reports are automatically generated when you view the Dashboard. Click the "Download PDF Report" button there for instant access.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('dashboard')} 
                      className="w-full" 
                      size="lg"
                      disabled={!uploadedData}
                    >
                      <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                      Go to Dashboard to Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      )}
    </div>
  );
};

export default Index;
