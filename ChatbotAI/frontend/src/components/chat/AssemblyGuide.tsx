"use client";

import type { AssemblyStepInfo } from "@/types/chat.type";
import { useState } from "react";

interface Props {
  steps: AssemblyStepInfo[];
}

const AssemblyGuide = ({ steps }: Props) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
        <span style={{ fontSize: '1rem' }}>🔧</span>
        <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>Hướng dẫn lắp ráp</span>
        <span style={{
          padding: '0.1rem 0.4rem', borderRadius: 'var(--r-sm)',
          background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)',
          fontSize: '0.65rem', fontWeight: 700, color: 'var(--cyan)',
        }}>
          {steps.length} bước
        </span>
      </div>

      {steps.map((step) => {
        const isOpen = expandedStep === step.step;
        return (
          <div
            key={step.step}
            style={{
              background: isOpen ? 'rgba(0,212,255,0.04)' : 'var(--surface)',
              border: `1px solid ${isOpen ? 'rgba(0,212,255,0.2)' : 'var(--border)'}`,
              borderRadius: 'var(--r)',
              overflow: 'hidden',
              transition: 'all 0.25s var(--ease)',
            }}
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setExpandedStep(isOpen ? null : step.step)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.65rem 0.85rem', background: 'transparent', border: 'none',
                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isOpen ? 'var(--grad-brand)' : 'var(--surface-2)',
                border: isOpen ? 'none' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800,
                color: isOpen ? '#fff' : 'var(--text-2)',
                flexShrink: 0, transition: 'all 0.25s',
              }}>
                {step.step}
              </div>
              <span style={{ flex: 1, fontWeight: 700, fontSize: '0.82rem', color: 'var(--text)' }}>
                {step.title}
              </span>
              <span style={{
                fontSize: '0.7rem', color: 'var(--text-3)',
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.25s var(--ease)',
              }}>
                ▼
              </span>
            </button>

            {/* Body */}
            {isOpen && (
              <div style={{
                padding: '0 0.85rem 0.75rem',
                borderTop: '1px solid var(--border)',
                animation: 'fadeIn 0.2s ease',
              }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-2)', lineHeight: 1.65, margin: '0.65rem 0 0' }}>
                  {step.description}
                </p>

                {step.tips.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.5rem' }}>
                    {step.tips.map((tip, i) => (
                      <div key={i} style={{
                        display: 'flex', gap: '0.4rem', alignItems: 'flex-start',
                        padding: '0.4rem 0.6rem', borderRadius: 'var(--r-sm)',
                        background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)',
                        fontSize: '0.75rem', color: 'var(--green)', lineHeight: 1.5,
                      }}>
                        <span style={{ flexShrink: 0 }}>💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                )}

                {step.warning && (
                  <div style={{
                    display: 'flex', gap: '0.4rem', alignItems: 'flex-start',
                    marginTop: '0.5rem', padding: '0.4rem 0.6rem',
                    borderRadius: 'var(--r-sm)',
                    background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.2)',
                    fontSize: '0.75rem', color: 'var(--orange)', lineHeight: 1.5,
                  }}>
                    <span style={{ flexShrink: 0 }}>⚠️</span>
                    <span>{step.warning}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AssemblyGuide;
