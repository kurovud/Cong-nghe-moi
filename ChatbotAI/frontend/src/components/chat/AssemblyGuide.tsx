"use client";

import type { AssemblyStepInfo } from "@/types/chat.type";
import { useState } from "react";

interface Props {
  steps: AssemblyStepInfo[];
}

const AssemblyGuide = ({ steps }: Props) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="assembly-guide">
      <div className="assembly-guide__timeline">
        {steps.map((step) => (
          <div
            key={step.step}
            className={`assembly-guide__step ${expandedStep === step.step ? "expanded" : ""}`}
            onClick={() => setExpandedStep(expandedStep === step.step ? null : step.step)}
          >
            <div className="assembly-guide__step-header">
              <div className="assembly-guide__step-number">{step.step}</div>
              <h4 className="assembly-guide__step-title">{step.title}</h4>
              <span className="assembly-guide__toggle">
                {expandedStep === step.step ? "▲" : "▼"}
              </span>
            </div>

            {expandedStep === step.step && (
              <div className="assembly-guide__step-body">
                <p>{step.description}</p>
                {step.tips.length > 0 && (
                  <div className="assembly-guide__tips">
                    {step.tips.map((tip, i) => (
                      <div key={i} className="assembly-guide__tip">
                        💡 {tip}
                      </div>
                    ))}
                  </div>
                )}
                {step.warning && (
                  <div className="assembly-guide__warning">
                    ⚠️ {step.warning}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssemblyGuide;
