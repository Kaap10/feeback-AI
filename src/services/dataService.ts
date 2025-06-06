
interface StoredData {
  id: string;
  timestamp: number;
  studentData: any;
  overallStats: any;
  insights?: any;
}

export class DataService {
  private readonly STORAGE_KEY = 'ai_feedback_data';
  private readonly INSIGHTS_KEY = 'ai_feedback_insights';

  saveData(studentData: any, overallStats: any): string {
    const id = this.generateId();
    const data: StoredData = {
      id,
      timestamp: Date.now(),
      studentData,
      overallStats,
    };

    const existingData = this.getAllData();
    existingData.push(data);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingData));
    return id;
  }

  saveInsights(dataId: string, insights: any): void {
    const insightsData = this.getAllInsights();
    insightsData[dataId] = {
      insights,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(this.INSIGHTS_KEY, JSON.stringify(insightsData));
  }

  getData(id: string): StoredData | null {
    const allData = this.getAllData();
    return allData.find(item => item.id === id) || null;
  }

  getInsights(dataId: string): any | null {
    const allInsights = this.getAllInsights();
    return allInsights[dataId]?.insights || null;
  }

  getAllData(): StoredData[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  getAllInsights(): Record<string, any> {
    const stored = localStorage.getItem(this.INSIGHTS_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  deleteData(id: string): void {
    const allData = this.getAllData();
    const filteredData = allData.filter(item => item.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredData));
    
    // Also delete associated insights
    const allInsights = this.getAllInsights();
    delete allInsights[id];
    localStorage.setItem(this.INSIGHTS_KEY, JSON.stringify(allInsights));
  }

  clearAllData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.INSIGHTS_KEY);
  }

  private generateId(): string {
    return `data_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  exportData(): string {
    const allData = this.getAllData();
    const allInsights = this.getAllInsights();
    
    return JSON.stringify({
      data: allData,
      insights: allInsights,
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  importData(jsonData: string): void {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(parsed.data));
      }
      if (parsed.insights) {
        localStorage.setItem(this.INSIGHTS_KEY, JSON.stringify(parsed.insights));
      }
    } catch (error) {
      throw new Error('Invalid data format for import');
    }
  }
}

export const dataService = new DataService();
