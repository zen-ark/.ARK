import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  interest: "aeo-audit" | "discovery-sprint" | "full-transformation";
  message: string;
}

export default function AutomationContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    interest: "aeo-audit",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form submitted:", formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", interest: "aeo-audit", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } catch (error) {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto space-y-6 bg-bg-surface p-8 rounded-12 border border-border-default"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-text-subtle">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-bg-elevated border border-border-default rounded-6 text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-text-subtle">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-bg-elevated border border-border-default rounded-6 text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="interest" className="block text-sm font-medium mb-2 text-text-subtle">
            I'm interested in...
          </label>
          <select
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-bg-elevated border border-border-default rounded-6 text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors appearance-none"
          >
            <option value="aeo-audit">AEO Audit (Get found by AI)</option>
            <option value="discovery-sprint">Discovery Sprint (Find efficiency gaps)</option>
            <option value="full-transformation">Full Transformation (Digital Brain)</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2 text-text-subtle">
            Message (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-bg-elevated border border-border-default rounded-6 text-text-primary focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors resize-none"
            placeholder="Tell us about your goals..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-4">
        {submitStatus === "success" && (
          <p className="text-sm text-success">Message sent successfully!</p>
        )}
        {submitStatus === "error" && (
          <p className="text-sm text-error">Something went wrong. Please try again.</p>
        )}
        {submitStatus === "idle" && <div />}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-brand hover:opacity-90 text-text-inverse rounded-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Start Conversation"}
        </button>
      </div>
    </form>
  );
}
