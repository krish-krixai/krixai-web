export interface ArticleSection {
  id: string;
  title: string;
  content: string[]; // Array of paragraphs for easy rendering
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readingTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
  featured?: boolean;
  sections?: ArticleSection[];
}

export interface Topic {
  title: string;
  description: string;
  articleCount: number;
  iconName: string; // We'll map this to a Lucide icon in the UI
}

export interface Guide {
  slug: string;
  title: string;
  summary: string;
  readingTime: string;
}

export interface ProductUpdate {
  version: string;
  date: string;
  features: string[];
}

// Dummy sections to populate articles with some readable content
const DUMMY_SECTIONS: ArticleSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: [
      "As Large Language Models (LLMs) become increasingly integrated into mission-critical applications, the attack surface for malicious actors expands significantly. Security is no longer just about protecting the infrastructure; it's about protecting the prompts and the context window.",
      "In this guide, we'll explore the foundational vulnerabilities that affect modern AI systems and how runtime protection can act as a critical defense layer."
    ]
  },
  {
    id: "the-mechanics-of-the-attack",
    title: "The Mechanics of the Attack",
    content: [
      "Adversaries exploit the fact that LLMs cannot strictly separate instructions from data. When a user input contains a command that overrides the system prompt, the model dutifully executes it. This is fundamentally different from traditional SQL injection, as natural language lacks a strict syntax boundary.",
      "Attackers often use techniques like context ignoring, role-playing, and virtualization to trick the model into bypassing its alignment guardrails."
    ]
  },
  {
    id: "why-traditional-moderation-fails",
    title: "Why Traditional Moderation Fails",
    content: [
      "Many teams rely on standard content moderation APIs (like OpenAI's Moderation API) or simple regex matching. However, these tools are designed to catch hate speech, self-harm, and explicit content—not sophisticated adversarial framing.",
      "An attacker doesn't use explicit language to steal a system prompt; they use clever linguistic manipulation. Static filters are easily bypassed by encoding, obfuscation, or multi-turn conversational attacks."
    ]
  },
  {
    id: "the-runtime-solution",
    title: "The Runtime Solution",
    content: [
      "A runtime AI security firewall sits directly between your application logic and the LLM API. It analyzes the entire payload (system prompt + user input) in milliseconds before the request is ever sent to the model.",
      "By utilizing purpose-built detection models, a runtime firewall can classify intent and identify adversarial patterns that static rules miss. If a threat is detected, the request is blocked, logged, and the developer is alerted."
    ]
  },
  {
    id: "conclusion",
    title: "Conclusion",
    content: [
      "Securing AI applications requires a defense-in-depth approach. While model alignment and input sanitization are important, they are not silver bullets. Active runtime protection is necessary to defend against the rapidly evolving landscape of adversarial AI attacks.",
      "By implementing robust monitoring and real-time blocking, engineering teams can confidently deploy powerful AI features without compromising enterprise security."
    ]
  }
];

export const ARTICLES: Article[] = [
  {
    slug: "understanding-prompt-injection",
    title: "Understanding Prompt Injection: The Biggest Security Risk for LLM Applications",
    excerpt: "Learn how prompt injection attacks work, why traditional AI moderation is insufficient and how runtime AI security protects production AI applications.",
    author: "Krixai Team",
    publishDate: "July 12, 2026",
    readingTime: "8 min",
    category: "AI Security",
    tags: ["prompt injection", "runtime security", "llm"],
    imageUrl: "/illustrations/hero-inspect.png",
    featured: true,
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "prompt-injection-explained-real-examples",
    title: "Prompt Injection Explained with Real Examples",
    excerpt: "A deep dive into real-world prompt injection attacks, how they bypassed initial safety filters, and the mechanics behind the exploits.",
    author: "Security Research",
    publishDate: "July 05, 2026",
    readingTime: "6 min",
    category: "Prompt Injection",
    tags: ["examples", "exploits", "security"],
    imageUrl: "/illustrations/pipeline-detect.png",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "runtime-ai-security-vs-ai-moderation",
    title: "Runtime AI Security vs AI Moderation",
    excerpt: "Why content moderation APIs are not enough to protect your application from adversarial attacks, and why you need an active firewall.",
    author: "Engineering",
    publishDate: "June 28, 2026",
    readingTime: "5 min",
    category: "Runtime Protection",
    tags: ["moderation", "firewall", "architecture"],
    imageUrl: "/illustrations/hero-inspect.png",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "building-secure-ai-agents",
    title: "Building Secure AI Agents",
    excerpt: "Best practices for ensuring autonomous AI agents don't leak sensitive data or execute unauthorized actions when exposed to untrusted input.",
    author: "Product Team",
    publishDate: "June 20, 2026",
    readingTime: "10 min",
    category: "Engineering",
    tags: ["agents", "data leakage", "auth"],
    imageUrl: "/illustrations/agent-network.png",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "owasp-top-10-llm-applications",
    title: "OWASP Top 10 for LLM Applications Explained",
    excerpt: "Breaking down the OWASP Top 10 vulnerabilities for Large Language Models and how Krixai mitigates them out of the box.",
    author: "Krixai Team",
    publishDate: "June 12, 2026",
    readingTime: "12 min",
    category: "LLM Security",
    tags: ["owasp", "vulnerabilities", "compliance"],
    imageUrl: "/illustrations/threat-matrix.png",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "protecting-openai-applications-jailbreaks",
    title: "Protecting OpenAI Applications from Jailbreaks",
    excerpt: "How to implement defense-in-depth strategies to stop sophisticated jailbreak prompts from manipulating your GPT-4 integrations.",
    author: "Engineering",
    publishDate: "May 30, 2026",
    readingTime: "7 min",
    category: "AI Security",
    tags: ["openai", "jailbreak", "gpt-4"],
    imageUrl: "/illustrations/runtime-protection.png",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "inside-krixai-threat-detection-pipeline",
    title: "Inside the Krixai Threat Detection Pipeline",
    excerpt: "An architectural overview of how our ultra-low latency engine analyzes prompts and detects adversarial patterns in milliseconds.",
    author: "Engineering",
    publishDate: "May 15, 2026",
    readingTime: "9 min",
    category: "Engineering",
    tags: ["latency", "architecture", "engine"],
    imageUrl: "/blog/threat-detection.webp",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "choosing-ai-runtime-firewall",
    title: "Choosing an AI Runtime Firewall",
    excerpt: "Key criteria for evaluating AI security solutions, including latency impact, deployment models, and threat detection efficacy.",
    author: "Product Team",
    publishDate: "May 02, 2026",
    readingTime: "6 min",
    category: "Product Updates",
    tags: ["firewall", "evaluation", "metrics"],
    imageUrl: "/blog/runtime-firewall.webp",
    sections: DUMMY_SECTIONS,
  },
  {
    slug: "how-runtime-protection-works-production",
    title: "How Runtime Protection Works in Production",
    excerpt: "A practical guide to implementing a fail-open security architecture that protects your LLMs without impacting user experience.",
    author: "Krixai Team",
    publishDate: "April 20, 2026",
    readingTime: "8 min",
    category: "Runtime Protection",
    tags: ["production", "fail-open", "guide"],
    imageUrl: "/blog/runtime-protection.webp",
    sections: DUMMY_SECTIONS,
  }
];

export const TOPICS: Topic[] = [
  {
    title: "AI Security",
    description: "General concepts and best practices for securing AI systems.",
    articleCount: 12,
    iconName: "Shield",
  },
  {
    title: "Prompt Injection",
    description: "Analysis and mitigation of prompt injection attacks.",
    articleCount: 8,
    iconName: "Terminal",
  },
  {
    title: "LLM Security",
    description: "Protecting Large Language Models from exploitation.",
    articleCount: 15,
    iconName: "Cpu",
  },
  {
    title: "Runtime Protection",
    description: "Active threat detection and prevention architecture.",
    articleCount: 6,
    iconName: "Zap",
  },
  {
    title: "Engineering",
    description: "Technical deep-dives into building scalable AI infrastructure.",
    articleCount: 9,
    iconName: "Code",
  },
  {
    title: "Product Updates",
    description: "Latest features, releases, and improvements to Krixai.",
    articleCount: 4,
    iconName: "Megaphone",
  }
];

export const POPULAR_GUIDES: Guide[] = [
  {
    slug: "understanding-prompt-injection",
    title: "Prompt Injection Explained",
    summary: "The definitive guide to understanding how prompt injections work and how to stop them.",
    readingTime: "15 min",
  },
  {
    slug: "choosing-ai-runtime-firewall",
    title: "Runtime AI Security Guide",
    summary: "How to architect low-latency security layers for production LLM applications.",
    readingTime: "12 min",
  },
  {
    slug: "building-secure-ai-agents",
    title: "Building Secure AI Agents",
    summary: "Ensure your autonomous agents operate safely within defined boundaries.",
    readingTime: "20 min",
  },
  {
    slug: "owasp-top-10-llm-applications",
    title: "OWASP LLM Top 10",
    summary: "A practical breakdown of the top vulnerabilities and how to mitigate them.",
    readingTime: "18 min",
  },
  {
    slug: "protecting-openai-applications-jailbreaks",
    title: "Jailbreak Attack Prevention",
    summary: "Strategies for hardening your prompts and models against adversarial jailbreaks.",
    readingTime: "10 min",
  }
];

export const PRODUCT_UPDATES: ProductUpdate[] = [
  {
    version: "v1.2",
    date: "Released",
    features: [
      "Workspace Policies",
      "Threat Logs",
      "Analytics Dashboard",
    ]
  },
  {
    version: "v1.1",
    date: "Released",
    features: [
      "Real API Keys",
      "Workspace Management",
      "Usage Tracking",
    ]
  }
];
