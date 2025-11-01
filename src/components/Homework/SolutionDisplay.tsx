import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Lightbulb, AlertTriangle, Target, MessageCircle, Save, FileDown, Sparkles } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { HomeworkSolution, HomeworkAnalysis } from '../../lib/homeworkService';

interface SolutionDisplayProps {
  analysis: HomeworkAnalysis;
  solution: HomeworkSolution;
  onAskFollowUp?: () => void;
  onSaveToNotes?: () => void;
  onExportPDF?: () => void;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({
  analysis,
  solution,
  onAskFollowUp,
  onSaveToNotes,
  onExportPDF,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    problem: true,
    explanation: true,
    steps: true,
    mistakes: false,
    practice: false,
    concepts: false,
    resources: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const renderLatex = (text: string) => {
    // Simple LaTeX rendering - looks for $...$ (inline) and $$...$$ (block)
    const parts = [];
    let lastIndex = 0;
    
    // Match block math $$...$$
    const blockMathRegex = /\$\$(.*?)\$\$/g;
    let match;
    
    while ((match = blockMathRegex.exec(text)) !== null) {
      // Add text before the math
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      
      // Render LaTeX
      try {
        const html = katex.renderToString(match[1], {
          throwOnError: false,
          displayMode: true,
        });
        parts.push(`<div class="my-4">${html}</div>`);
      } catch {
        parts.push(match[0]);
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex);
      
      // Match inline math $...$
      const inlineMathRegex = /\$(.*?)\$/g;
      let inlineMatch;
      let inlineLastIndex = 0;
      const inlineParts = [];
      
      while ((inlineMatch = inlineMathRegex.exec(remaining)) !== null) {
        if (inlineMatch.index > inlineLastIndex) {
          inlineParts.push(remaining.substring(inlineLastIndex, inlineMatch.index));
        }
        
        try {
          const html = katex.renderToString(inlineMatch[1], {
            throwOnError: false,
            displayMode: false,
          });
          inlineParts.push(html);
        } catch {
          inlineParts.push(inlineMatch[0]);
        }
        
        inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
      }
      
      if (inlineLastIndex < remaining.length) {
        inlineParts.push(remaining.substring(inlineLastIndex));
      }
      
      parts.push(inlineParts.join(''));
    }
    
    return parts.join('');
  };

  const CollapsibleSection: React.FC<{
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultExpanded?: boolean;
  }> = ({ id, title, icon, children, defaultExpanded = false }) => {
    const isExpanded = expandedSections[id] ?? defaultExpanded;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection(id)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="text-indigo-600 dark:text-indigo-400">
              {icon}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      {/* Header with Action Buttons */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Solution Ready! 🎉</h2>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                {analysis.content_type}
              </span>
              {analysis.sub_topic && (
                <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  {analysis.sub_topic}
                </span>
              )}
              {analysis.confidence && (
                <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                  {Math.round(analysis.confidence * 100)}% confidence
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          {onAskFollowUp && (
            <button
              onClick={onAskFollowUp}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Ask Follow-Up</span>
            </button>
          )}
          {onSaveToNotes && (
            <button
              onClick={onSaveToNotes}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span className="text-sm font-medium">Save to Notes</span>
            </button>
          )}
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
            >
              <FileDown className="h-4 w-4" />
              <span className="text-sm font-medium">Export PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Extracted Problem */}
      {analysis.ocr_text && (
        <CollapsibleSection
          id="problem"
          title="Problem Statement"
          icon={<BookOpen className="h-5 w-5" />}
          defaultExpanded={true}
        >
          <div className="prose dark:prose-invert max-w-none">
            <div
              className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: renderLatex(analysis.ocr_text) }}
            />
          </div>
        </CollapsibleSection>
      )}

      {/* Explanation */}
      <CollapsibleSection
        id="explanation"
        title="Explanation"
        icon={<Lightbulb className="h-5 w-5" />}
        defaultExpanded={true}
      >
        <div className="prose dark:prose-invert max-w-none">
          <div
            className="text-gray-700 dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: renderLatex(solution.explanation) }}
          />
        </div>
      </CollapsibleSection>

      {/* Step-by-Step Solution */}
      <CollapsibleSection
        id="steps"
        title="Step-by-Step Solution"
        icon={<Target className="h-5 w-5" />}
        defaultExpanded={true}
      >
        <div className="space-y-4">
          {solution.step_by_step_solution.map((step, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {step.step}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h4>
                <div
                  className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300"
                  dangerouslySetInnerHTML={{ __html: renderLatex(step.content) }}
                />
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Common Mistakes */}
      {solution.common_mistakes && solution.common_mistakes.length > 0 && (
        <CollapsibleSection
          id="mistakes"
          title="Common Mistakes to Avoid"
          icon={<AlertTriangle className="h-5 w-5" />}
        >
          <div className="space-y-2">
            {solution.common_mistakes.map((mistake, index) => (
              <div
                key={index}
                className="flex gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500"
              >
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{mistake}</p>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Related Concepts */}
      {solution.related_concepts && solution.related_concepts.length > 0 && (
        <CollapsibleSection
          id="concepts"
          title="Related Concepts"
          icon={<Sparkles className="h-5 w-5" />}
        >
          <div className="flex flex-wrap gap-2">
            {solution.related_concepts.map((concept, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
              >
                {concept}
              </span>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Practice Problems */}
      {solution.practice_problems && solution.practice_problems.length > 0 && (
        <CollapsibleSection
          id="practice"
          title="Practice Problems"
          icon={<Target className="h-5 w-5" />}
        >
          <div className="space-y-4">
            {solution.practice_problems.map((problem: { question: string; difficulty: string; hint?: string }, index: number) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">
                    Problem {index + 1}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    problem.difficulty === 'easy'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : problem.difficulty === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  }`}>
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{problem.question}</p>
                {problem.hint && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    💡 Hint: {problem.hint}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Resources */}
      {solution.resources && solution.resources.length > 0 && (
        <CollapsibleSection
          id="resources"
          title="Learning Resources"
          icon={<BookOpen className="h-5 w-5" />}
        >
          <div className="space-y-3">
            {solution.resources.map((resource: { title: string; description: string; url?: string }, index: number) => (
              <div
                key={index}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                  {resource.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {resource.description}
                </p>
                {resource.url && (
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Learn more →
                  </a>
                )}
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}
    </div>
  );
};

export default SolutionDisplay;
