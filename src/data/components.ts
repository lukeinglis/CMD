import type { ComponentDefinition } from '../types';

/**
 * All component data lives here. To update demo links or descriptions,
 * edit this file only. No need to touch any component code.
 */
export const components: ComponentDefinition[] = [
  {
    id: 1,
    slug: 'data-processing',
    title: 'Data Processing',
    subtitle: 'Turn Documents into AI-Ready Data at Scale',
    tagline: 'From raw documents to structured, AI-ready datasets',
    color: '#fbbf24',
    icon: '\u{1F4C4}',
    description:
      'Transform raw, unstructured data into clean, AI-ready formats at enterprise scale. Docling parses complex documents (PDFs, slides, filings) into structured output. Kubeflow Spark Operator and RayData handle distributed processing for massive datasets, all running on Red Hat OpenShift AI.',
    bullets: [
      'Docling converts PDFs, presentations, and filings into structured, machine-readable data',
      'Kubeflow Spark Operator enables distributed data processing at scale',
      'RayData provides scalable, parallel data pipelines with Ray',
      'Runtime images scanned and built by Red Hat for trusted supply chain',
      'Credential management for connecting to databases, SharePoint, Confluence, and more',
    ],
    demoStatus: 'coming-soon',
    relationships: [
      'Feeds structured data into AutoRAG for retrieval pipelines',
      'Produces training-ready datasets for SDG and Training workflows',
      'Prepares evaluation corpora for Eval Hub benchmarks',
    ],
  },
  {
    id: 2,
    slug: 'automl',
    title: 'AutoML',
    subtitle: 'Automate Predictive Model Development',
    tagline: 'From historical data to production-ready ML models',
    color: '#a78bfa',
    icon: '\u{1F916}',
    description:
      'Automate the end-to-end development of machine learning workflows. Provide your historical data and AutoML handles feature engineering, hyperparameter optimization, model selection, and validation. A complex process that used to take months becomes a streamlined, automated workflow anyone can initiate.',
    bullets: [
      'Automated feature engineering from raw tabular data',
      'Hyperparameter optimization and model selection across multiple algorithms',
      'Built-in validation with confusion matrices, ROC curves, and F1 scores',
      'UI and notebooks for end-to-end AutoML pipelines',
      'Roadmap: expose trained predictive models as MCP tools for agentic workflows',
    ],
    videoSrc: 'videos/automl.mp4',
    demoUrl: 'https://drive.google.com/file/d/1AkdAIqSo-zVDOStVRNbaHpvObrVLgGiA/view',
    demoLabel: 'Watch AutoML Demo',
    demoStatus: 'video',
    relationships: [
      'Predictive models complement AutoRAG explanations in AI applications',
      'Trained models can be evaluated and benchmarked with Eval Hub',
      'Outputs can be exposed as MCP tools for agentic use via ITS',
    ],
  },
  {
    id: 3,
    slug: 'autorag',
    title: 'AutoRAG',
    subtitle: 'Optimize RAG Pipelines in Minutes, Not Days',
    tagline: 'Automated retrieval-augmented generation pipeline optimization',
    color: '#60a5fa',
    icon: '\u{1F50D}',
    description:
      'Building a production-grade RAG pipeline from scratch is notoriously difficult. AutoRAG eliminates the guesswork by automatically evaluating thousands of configurations to find the optimal setup for your specific data. Chunk sizes, embedding models, vector stores, and retrieval settings are all tested and scored.',
    bullets: [
      'Automated pipeline testing across multiple RAG algorithms and techniques',
      'Hyperparameter optimization for chunk size, embeddings, vector stores, and top-K settings',
      'Advanced evaluation metrics including Answer Correctness and Faithfulness',
      'UI and notebooks for end-to-end AutoRAG pipelines',
      'Roadmap: advanced context intelligence with Agentic RAG and Graph RAG',
    ],
    videoSrc: 'videos/autorag.mp4',
    demoUrl: 'https://drive.google.com/file/d/13HLxQeLyNGv8DnvuojprUEU-XXpRrkHQ/view',
    demoLabel: 'Watch AutoRAG Demo',
    demoStatus: 'video',
    relationships: [
      'Consumes structured data produced by Data Processing',
      'RAG pipelines are evaluated and scored with Eval Hub metrics',
      'SDG generates synthetic evaluation datasets for RAG quality testing',
    ],
  },
  {
    id: 4,
    slug: 'eval',
    title: 'Eval Hub',
    subtitle: 'Evaluate Accuracy, Performance, and Risk',
    tagline: 'Comprehensive evaluation for models, RAG, and agents',
    color: '#34d399',
    icon: '\u{1F4CA}',
    description:
      'Evaluate any AI system: models, RAG pipelines, agents, and applications using popular or custom frameworks. Benchmark performance and safety against criteria that matter to your domain. Industry-specific evaluation collections let you validate AI systems against real-world scenarios.',
    bullets: [
      'Evaluate models, RAG systems, agents, and full applications',
      'Benchmark against performance, safety, and risk criteria',
      'Measure agent capabilities: autonomy, tool execution, and reasoning quality',
      'Industry-specific test suites tailored to your domain',
      'REST API, client SDK, and integrated UI for orchestrating evaluations',
    ],
    videoSrc: 'videos/evalhub.mp4',
    demoUrl: 'https://drive.google.com/file/d/1DxdwPRyGDUqHy5_VeFjt95pb038wTtE_/view',
    demoLabel: 'Watch Eval Hub Demo',
    demoStatus: 'video',
    relationships: [
      'Scores and benchmarks AutoRAG pipeline configurations',
      'Validates models produced by Training and AutoML',
      'Consumes synthetic evaluation datasets generated by SDG',
    ],
  },
  {
    id: 5,
    slug: 'sdg',
    title: 'SDG',
    subtitle: 'Synthetic Data Generation for AI Evaluation and Training',
    tagline: 'Generate the data your AI systems need to improve',
    color: '#fb7185',
    icon: '\u{1F9EA}',
    description:
      'Synthetic Data Generation is the control plane for AI evaluation and training data. Generate domain-specific datasets for RAG evaluation, tool-calling fine-tuning, and adversarial safety testing. SDG Hub scales data generation and integrates with downstream evaluation and training workflows.',
    bullets: [
      'Generate evaluation datasets for RAG systems using SDG Hub',
      'Create tool-calling training data for custom MCP servers',
      'Adversarial safety data for red-teaming and guardrail validation',
      'First-class multilingual support across all generation flows',
      'Scalable generation via Kubeflow Pipelines integration',
    ],
    videoSrc: 'videos/sdg.mp4',
    demoUrl: 'https://drive.google.com/file/d/1LBvT1VFJg9VNzBGG-Cw_A5Eg5glotJBd/view',
    demoLabel: 'Watch SDG Demo',
    demoStatus: 'video',
    relationships: [
      'Generates evaluation datasets consumed by Eval Hub',
      'Produces fine-tuning data used by Training workflows',
      'Creates adversarial test sets to validate model safety and guardrails',
    ],
  },
  {
    id: 6,
    slug: 'training',
    title: 'Training',
    subtitle: 'Post-Training Domain Customization',
    tagline: 'Fine-tune and customize models for your domain',
    color: '#f97316',
    icon: '\u{1F3AF}',
    description:
      'Customize foundation models for your domain with enterprise-grade post-training workflows. Training Hub supports LoRA/QLoRA fine-tuning, Continued Pre-Training (CPT), and integrates with Kubeflow Trainer v2 for distributed training at scale. Track experiments with MLflow and manage the full model lifecycle.',
    bullets: [
      'LoRA/QLoRA fine-tuning with Unsloth backend for efficient adaptation',
      'Continued Pre-Training (CPT) for deep domain knowledge ingestion',
      'Minimal Training AI Pipeline for governed end-to-end workflows',
      'MLflow experiment tracking and model lifecycle management',
      'Universal Training Workbench for interactive development',
    ],
    demoStatus: 'coming-soon',
    relationships: [
      'Consumes synthetic training data generated by SDG',
      'Trained models are validated and benchmarked by Eval Hub',
      'Fine-tuned models can leverage ITS for enhanced inference',
    ],
  },
  {
    id: 7,
    slug: 'its',
    title: 'ITS',
    subtitle: 'Inference-Time Scaling',
    tagline: 'Scale model reasoning at inference time',
    color: '#22d3ee',
    icon: '\u26A1',
    description:
      'Inference-Time Scaling enhances model output quality by applying additional compute at inference time. Instead of training larger models, ITS uses scaling algorithms (Best-of-N, MCTS, beam search) to improve reasoning, accuracy, and reliability from existing models. Available as an SDK and gateway.',
    bullets: [
      'SDK available in Red Hat AI Python Index for direct integration',
      'Gateway enables ITS without application code changes',
      'Multiple scaling algorithms: Best-of-N, MCTS, beam search, and more',
      'Agentic patterns enabled for tool-calling and multi-step reasoning',
      'Roadmap: integration into Red Hat AI Gateway, reward-based algorithms',
    ],
    videoSrc: 'videos/its.mp4',
    demoUrl: 'https://red.ht/its-hub-demo',
    demoLabel: 'Launch ITS Demo',
    demoStatus: 'live',
    relationships: [
      'Enhances output quality of models fine-tuned by Training',
      'Improves RAG response quality when paired with AutoRAG pipelines',
      'Can be integrated with Eval Hub for evaluating scaled inference results',
    ],
  },
];

/** Total pages: intro (0) + 7 components (1-7) + summary (8) */
export const TOTAL_PAGES = 9;
