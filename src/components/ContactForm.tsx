import React, { useState } from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    // Simple form submission - you can replace this with your actual endpoint
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For now, just log the data (you can replace this with actual submission)
      console.log("Form submitted:", formData);
      
      setSubmitStatus("success");
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 3 seconds
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
      className="w-full max-w-2xl mx-auto space-y-6"
      aria-label="Contact form"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-2 text-text-subtle"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-6 text-text focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors duration-200"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-text-subtle"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-6 text-text focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors duration-200"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-2 text-text-subtle"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={6}
            className="w-full px-4 py-3 bg-bg-surface border border-border-default rounded-6 text-text focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent transition-colors duration-200 resize-none"
            placeholder="Tell us about your project..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {submitStatus === "success" && (
          <p className="text-sm text-success" role="status">
            Message sent successfully!
          </p>
        )}
        {submitStatus === "error" && (
          <p className="text-sm text-error" role="alert">
            Something went wrong. Please try again.
          </p>
        )}
        {submitStatus === "idle" && <div />}

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-accent text-accent-contrast rounded-6 font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-border-focus focus:ring-offset-2 focus:ring-offset-bg-canvas transition-opacity duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send Message"}
        </button>
      </div>
    </form>
  );
}

