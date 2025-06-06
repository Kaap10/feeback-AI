import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, CheckCircle, AlertCircle, File, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (data: any) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const validateJsonStructure = (data: any) => {
    const errors = [];
    const warnings = [];
    
    // Check if data is an object with numeric keys or an array
    const isValidStructure = typeof data === 'object' && data !== null;
    if (!isValidStructure) {
      errors.push('Data must be an object or array');
      return { errors, warnings, isValid: false };
    }

    // Get the first test data (handle both object with numeric keys and array)
    const testEntries = Array.isArray(data) ? data : Object.values(data);
    const firstTest = testEntries[0];

    if (!firstTest) {
      errors.push('No test data found');
      return { errors, warnings, isValid: false };
    }

    // Check for test structure
    if (!firstTest.test) {
      warnings.push('Missing test metadata');
    } else {
      if (!firstTest.test.totalQuestions) warnings.push('Missing totalQuestions in test metadata');
      if (!firstTest.test.totalTime) warnings.push('Missing totalTime in test metadata');
    }

    // Check for subjects array
    if (!firstTest.subjects || !Array.isArray(firstTest.subjects)) {
      errors.push('Missing or invalid subjects array');
    } else {
      firstTest.subjects.forEach((subject: any, index: number) => {
        if (!subject.subjectId) errors.push(`Subject ${index + 1}: Missing subjectId`);
        if (subject.accuracy === undefined) warnings.push(`Subject ${index + 1}: Missing accuracy`);
        if (!subject.totalAttempted && subject.totalAttempted !== 0) warnings.push(`Subject ${index + 1}: Missing totalAttempted`);
        if (!subject.totalCorrect && subject.totalCorrect !== 0) warnings.push(`Subject ${index + 1}: Missing totalCorrect`);
      });
    }

    return { errors, warnings, isValid: errors.length === 0 };
  };

  const simulateUploadProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 30;
      });
    }, 200);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setIsProcessing(true);
    simulateUploadProgress();

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      // Validate structure
      const validation = validateJsonStructure(data);
      setValidationResult(validation);

      if (validation.isValid) {
        setTimeout(() => {
          onUpload(data);
          setIsProcessing(false);
          toast({
            title: "File uploaded successfully!",
            description: "Your test data has been processed and validated.",
          });
        }, 1000);
      } else {
        setIsProcessing(false);
        toast({
          title: "Validation failed",
          description: "Please fix the errors and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsProcessing(false);
      setValidationResult({ errors: ['Invalid JSON format'], warnings: [], isValid: false });
      toast({
        title: "Upload failed",
        description: "Please check your JSON file format.",
        variant: "destructive",
      });
    }
  }, [onUpload, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    maxFiles: 1,
  });

  const clearFile = () => {
    setUploadedFile(null);
    setValidationResult(null);
    setUploadProgress(0);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
      {/* Upload Area */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
            <Upload className="w-4 h-4 md:w-5 md:h-5" />
            <span>Upload Test Results Data</span>
          </CardTitle>
          <CardDescription className="text-sm md:text-base">
            Upload a JSON file containing test results with subject-wise performance data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`relative border-2 border-dashed rounded-lg p-4 md:p-8 text-center cursor-pointer transition-all duration-200 ${
              isDragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-gray-300 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            
            {!uploadedFile ? (
              <div className="space-y-3 md:space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-primary to-[#335EEA] rounded-full mx-auto flex items-center justify-center">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    {isDragActive ? 'Drop the file here' : 'Drop your JSON file here'}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-3 md:mb-4">
                    or click to browse your files
                  </p>
                  <Badge variant="secondary" className="text-xs md:text-sm">JSON files only</Badge>
                </div>
              </div>
            ) : (
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-center space-x-2 md:space-x-3">
                  <File className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-medium text-sm md:text-base truncate max-w-[200px] md:max-w-none">{uploadedFile.name}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {(uploadedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                {isProcessing && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full" />
                    <p className="text-xs md:text-sm text-muted-foreground">
                      Processing... {Math.round(uploadProgress)}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Validation Results */}
      {validationResult && (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
              {validationResult.isValid ? (
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
              )}
              <span>Validation Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {validationResult.errors.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-red-600 mb-2 text-sm md:text-base">Errors:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.errors.map((error: string, index: number) => (
                    <li key={index} className="text-xs md:text-sm text-red-600">{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {validationResult.warnings.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-yellow-600 mb-2 text-sm md:text-base">Warnings:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {validationResult.warnings.map((warning: string, index: number) => (
                    <li key={index} className="text-xs md:text-sm text-yellow-600">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {validationResult.isValid && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs md:text-sm font-medium">File validated successfully!</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sample Format */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg md:text-xl">Expected JSON Format</CardTitle>
          <CardDescription className="text-sm md:text-base">
            Your file should follow this structure for optimal results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted p-3 md:p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs md:text-sm font-mono whitespace-pre-wrap">
{`{
  "0": {
    "_id": {
      "$oid": "68202967f4b85662f256ab6b"
    },
    "test": {
      "syllabus": "<h1>Test Syllabus</h1>...",
      "totalTime": 180,
      "totalQuestions": 75,
      "totalMarks": 300
    },
    "subjects": [
      {
        "_id": {
          "$oid": "68202967f4b85662f256abcc"
        },
        "subjectId": {
          "$oid": "607018ee404ae53194e73d92"
        },
        "totalTimeTaken": 2957,
        "totalMarkScored": 36,
        "totalAttempted": 14,
        "totalCorrect": 10,
        "accuracy": 71.42857142857143
      }
    ]
  }
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
