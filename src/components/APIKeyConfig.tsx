
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { aiService } from '@/services/aiService';
import { useToast } from '@/hooks/use-toast';

const APIKeyConfig: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const existingKey = aiService.getApiKey();
    if (existingKey) {
      setApiKey(existingKey);
      setIsConfigured(true);
    }
  }, []);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid API key",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.startsWith('sk-')) {
      toast({
        title: "Invalid API Key",
        description: "OpenAI API keys should start with 'sk-'",
        variant: "destructive",
      });
      return;
    }

    aiService.setApiKey(apiKey.trim());
    setIsConfigured(true);
    
    toast({
      title: "Success",
      description: "API key saved successfully! AI features are now enabled.",
    });
  };

  const handleRemove = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsConfigured(false);
    
    toast({
      title: "API Key Removed",
      description: "AI features will use mock data until you configure a new key.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Key className="w-5 h-5" />
          <span>AI Configuration</span>
          {isConfigured && <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>}
        </CardTitle>
        <CardDescription>
          Configure your OpenAI API key to enable real AI-powered insights. Without this, the app will use simulated data.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <Button onClick={handleSave} disabled={!apiKey.trim()}>
              Save
            </Button>
          </div>
        </div>

        {isConfigured && (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">AI features are enabled</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleRemove}>
              Remove Key
            </Button>
          </div>
        )}

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">How to get your OpenAI API key:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">OpenAI API Keys</a></li>
                <li>Create a new secret key</li>
                <li>Copy and paste it above</li>
              </ol>
              <p className="mt-2 text-xs">Your key is stored locally and never sent to our servers.</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default APIKeyConfig;
