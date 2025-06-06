
interface AIInsightRequest {
  studentData: any;
  overallStats: any;
}

interface AIInsightResponse {
  summary: string;
  personalizedFeedback: string;
  learningStyle: {
    type: string;
    description: string;
    strengths: string[];
  };
  cognitiveAnalysis: {
    strengths: Array<{ area: string; score: number }>;
    development: Array<{ area: string; priority: string }>;
  };
  actionItems: Array<{
    title: string;
    description: string;
    priority: string;
    timeframe: string;
  }>;
  motivationalMessage: string;
}

export class AIService {
  private apiKey: string | null = null;

  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('openai_api_key', key);
  }

  getApiKey(): string | null {
    if (this.apiKey) return this.apiKey;
    return localStorage.getItem('openai_api_key');
  }

  async generateInsights(data: AIInsightRequest): Promise<AIInsightResponse> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const prompt = this.buildPrompt(data);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert educational AI that provides personalized feedback to students based on their test performance data. Respond only with valid JSON matching the required format.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0].message.content;
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', content);
        throw new Error('Invalid AI response format');
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      throw error;
    }
  }

  private buildPrompt(data: AIInsightRequest): string {
    return `
Analyze this student's performance data and provide personalized educational insights:

Student: ${data.studentData.student_name}
Overall Accuracy: ${data.overallStats.avgAccuracy}%
Total Tests: ${data.overallStats.totalTests}
Strongest Subject: ${data.overallStats.strongestSubject?.subject} (${data.overallStats.strongestSubject?.accuracy}%)
Weakest Subject: ${data.overallStats.weakestSubject?.subject} (${data.overallStats.weakestSubject?.accuracy}%)

Test Data: ${JSON.stringify(data.studentData.tests)}

Please provide insights in this exact JSON format:
{
  "summary": "Brief overall performance summary",
  "personalizedFeedback": "Personal message to the student",
  "learningStyle": {
    "type": "Learning style type",
    "description": "Description of learning style",
    "strengths": ["strength1", "strength2", "strength3"]
  },
  "cognitiveAnalysis": {
    "strengths": [
      {"area": "area1", "score": 85},
      {"area": "area2", "score": 78}
    ],
    "development": [
      {"area": "area1", "priority": "High"},
      {"area": "area2", "priority": "Medium"}
    ]
  },
  "actionItems": [
    {
      "title": "Action title",
      "description": "Action description",
      "priority": "High|Medium|Low",
      "timeframe": "1 week|2 weeks|1 month"
    }
  ],
  "motivationalMessage": "Encouraging message for the student"
}
`;
  }
}

export const aiService = new AIService();
