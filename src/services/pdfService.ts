
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFReportData {
  studentData: any;
  overallStats: any;
  insights?: any;
}

export class PDFService {
  private getSubjectName(subjectId: string) {
    const subjectMap: { [key: string]: string } = {
      '607018ee404ae53194e73d92': 'Physics',
      '607018ee404ae53194e73d90': 'Chemistry', 
      '607018ee404ae53194e73d91': 'Mathematics'
    };
    return subjectMap[subjectId] || 'Unknown Subject';
  }

  async generateReport(data: PDFReportData): Promise<void> {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(59, 130, 246); // Blue color
    pdf.text('Student Test Performance Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;

    // Test Information
    pdf.setFontSize(16);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Test Overview', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    
    // Extract test information from data
    const testsArray = Array.isArray(data.studentData) ? data.studentData : Object.values(data.studentData);
    const firstTest = testsArray[0];
    
    if (firstTest && firstTest.test) {
      pdf.text(`Total Questions: ${firstTest.test.totalQuestions || 'N/A'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Time: ${firstTest.test.totalTime ? firstTest.test.totalTime + ' minutes' : 'N/A'}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Total Marks: ${firstTest.test.totalMarks || 'N/A'}`, 20, yPosition);
      yPosition += 8;
    }
    
    pdf.text(`Tests Analyzed: ${data.overallStats.totalTests}`, 20, yPosition);
    yPosition += 8;
    pdf.text(`Overall Accuracy: ${data.overallStats.avgAccuracy}%`, 20, yPosition);
    yPosition += 15;

    // Performance Summary
    pdf.setFontSize(16);
    pdf.text('Performance Summary', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    if (data.overallStats.strongestSubject) {
      pdf.text(`Strongest Subject: ${data.overallStats.strongestSubject.subject} (${data.overallStats.strongestSubject.accuracy}%)`, 20, yPosition);
      yPosition += 8;
    }
    
    if (data.overallStats.weakestSubject) {
      pdf.text(`Area for Improvement: ${data.overallStats.weakestSubject.subject} (${data.overallStats.weakestSubject.accuracy}%)`, 20, yPosition);
      yPosition += 15;
    }

    // Subject-wise Performance
    pdf.setFontSize(16);
    pdf.text('Subject-wise Performance', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    data.overallStats.subjectStats.forEach((subject: any) => {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${subject.subject}:`, 20, yPosition);
      yPosition += 6;
      pdf.text(`  • Accuracy: ${subject.accuracy}%`, 25, yPosition);
      yPosition += 6;
      pdf.text(`  • Questions: ${subject.correct}/${subject.attempted} correct`, 25, yPosition);
      yPosition += 6;
      if (subject.marks) {
        pdf.text(`  • Marks Scored: ${subject.marks}`, 25, yPosition);
        yPosition += 6;
      }
      if (subject.timeSpent) {
        pdf.text(`  • Time Spent: ${subject.timeSpent} minutes`, 25, yPosition);
        yPosition += 6;
      }
      yPosition += 4;
    });

    yPosition += 10;

    // AI Insights (if available)
    if (data.insights) {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(16);
      pdf.text('AI-Generated Insights', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      const summaryLines = pdf.splitTextToSize(data.insights.summary, pageWidth - 40);
      summaryLines.forEach((line: string) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        pdf.text(line, 20, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      
      // Recommendations
      pdf.setFontSize(14);
      pdf.text('Recommendations:', 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(12);
      if (data.insights.actionItems) {
        data.insights.actionItems.forEach((item: any, index: number) => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${index + 1}. ${item.title}`, 20, yPosition);
          yPosition += 6;
          const descLines = pdf.splitTextToSize(`   ${item.description}`, pageWidth - 50);
          descLines.forEach((line: string) => {
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, 25, yPosition);
            yPosition += 5;
          });
          yPosition += 3;
        });
      }
    }

    // Recommendations Section
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(16);
    pdf.text('Study Recommendations', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    const recommendations = [
      `Focus on improving ${data.overallStats.weakestSubject?.subject || 'weaker areas'} through targeted practice`,
      'Review incorrect answers to understand knowledge gaps',
      'Practice time management with timed mock tests',
      `Leverage strength in ${data.overallStats.strongestSubject?.subject || 'stronger areas'} for confidence building`
    ];
    
    recommendations.forEach((rec, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`${index + 1}. ${rec}`, 20, yPosition);
      yPosition += 8;
    });

    // Footer
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pdf.text('Generated by AI Student Feedback System', pageWidth / 2, pageHeight - 5, { align: 'center' });
    }

    // Save the PDF
    pdf.save(`Test_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  }

  async captureElementAsPDF(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }
}

export const pdfService = new PDFService();
