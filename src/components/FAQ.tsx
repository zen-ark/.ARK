import React, { useState } from "react";

export const faqData = [
  {
    question: "What is AI-Readiness?",
    answer: "AI-Readiness means structuring your digital presence so that Artificial Intelligence systems (like ChatGPT, Gemini, Perplexity) can accurately understand, index, and recommend your brand. It involves optimizing technical infrastructure, structured data, and content semantics to ensure your business is visible in the new era of search."
  },
  {
    question: "How can AI help my business?",
    answer: "AI can automate repetitive tasks, personalize customer experiences at scale, and provide deep insights through data analysis. For design and web presence, AI-driven tools can enhance accessibility, improve search rankings (AEO), and create dynamic, adaptive user interfaces that respond to user needs in real-time."
  },
  {
    question: "Why choose .ARK for AI-driven design?",
    answer: ".ARK combines high-end aesthetic sensibility with cutting-edge technical expertise. We don't just build websites; we build digital ecosystems optimized for both human delight and machine understanding. Our approach ensures your brand stands out visually while being technically robust enough to thrive in an AI-first world."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 px-6 bg-black text-[#f4f3e8] border-t border-[#404040]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold mb-16 uppercase tracking-tight font-['NB_International_Pro']">
          Frequently Asked <br /> Questions
        </h2>

        <div className="space-y-0 border-t border-[#404040]">
          {faqData.map((item, index) => (
            <div key={index} className="border-b border-[#404040]">
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full py-8 flex justify-between items-start text-left focus:outline-none group"
              >
                <span className="text-lg md:text-xl font-mono font-light pr-8 group-hover:text-[#d3fd45] transition-colors duration-300">
                  {item.question}
                </span>
                <span className="font-mono text-xl transform transition-transform duration-300 relative top-1">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  openIndex === index ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-base md:text-lg leading-relaxed text-gray-400 font-['NB_International_Pro'] max-w-2xl">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
