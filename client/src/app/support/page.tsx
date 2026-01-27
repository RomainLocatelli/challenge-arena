'use client';

import { useState } from 'react';
import { faqData } from '../support/faqData';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] p-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Support Center</h1>
        <p className="text-[var(--foreground)] opacity-70">Find quick answers to your questions</p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-16">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>

        <div className="space-y-2">
          {faqData.map((item) => (
            <FAQItem key={item.id} question={item.question} answer={item.answer} />
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-3xl mx-auto text-center bg-[var(--button-area)] p-8 rounded-lg border border-[var(--header-button-area)]">
        <h2 className="text-2xl font-bold mb-4">Can&apos;t find an answer?</h2>
        <p className="text-[var(--foreground)] opacity-70 mb-6">Contact our support team</p>

        <a
          href="mailto:support@gamerchallenges.com?subject=Help Request - GamerChallenges"
          className="inline-block bg-[var(--button-select)] hover:bg-[var(--button-game-challenge-hover)] text-white font-semibold px-6 py-3 rounded-lg transition"
        >
          Send an email
        </a>
      </section>
    </div>
  );
}

// FAQItem component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b border-[var(--header-button-area)] py-4">
      <button
        onClick={handleClick}
        className="w-full flex justify-between items-center text-left hover:text-[var(--button-select)] transition"
      >
        <span className="font-semibold text-lg">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && <div className="mt-3 text-[var(--foreground)] opacity-80 pl-4">{answer}</div>}
    </div>
  );
}
