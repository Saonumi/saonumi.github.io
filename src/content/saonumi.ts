// Personal content is separate from layout and animation. Drafts can be replaced.
import { locale } from "../i18n/store";
import doctorCover from "../assets/images/projects/doctor-chatbot.webp";
import bastionCover from "../assets/images/projects/bastion.webp";
import voiceCover from "../assets/images/projects/saovoice.webp";
const copy = (vi: string, en: string) => ({ vi, en });

export const profile = {
  get name() { return locale.value === "vi" ? "Nguyễn Ngọc Sáng" : "Saonumi"; },
  role: "AI Researcher / Engineer",
  birthDate: "31-07-2005",
  get location() { return locale.value === "vi" ? "Hưng Yên - Việt Nam" : "Hưng Yên - Vietnam"; },
  email: "sang3172005@gmail.com",
  github: "https://github.com/Saonumi",
  tagline: copy(
    "Nghiên cứu và sáng tạo, biến ý tưởng thành những giải pháp có ích.",
    "Research and creativity that turn ideas into useful solutions."),
};

// About cards have their own content; the project and Skills sections stay separate.
export const aboutStatus = {
  get items() {
    return locale.value === "vi"
      ? ["Top 9 Olympic Toán FPT", "Thành viên SAP-LAB", "Top 20 Swin Hackathon 2026"]
      : ["Top 9 FPT Math Olympiad", "SAP-LAB member", "Top 20 Swin Hackathon 2026"];
  },
};

export const aboutSkills = [
  "Python / C++", "Machine Learning", "Deep Learning", "NLP", "RAG", "Text-to-Speech", "AI for SEC",
];

export const portfolioProjects = [
  {
    title: "Doctor Chatbot",
    category: copy("Agentic RAG cho Y học cổ truyền", "Agentic RAG for traditional medicine"),
    description: copy(
      "Trợ lý tra cứu dành cho phòng khám Đông y, hỗ trợ bác sĩ và nhân viên tìm thông tin trong tài liệu y học cổ truyền bằng câu hỏi tự nhiên. Kết hợp RAG, Text-to-SQL và Vision AI để truy xuất tài liệu có trích dẫn, tra cứu dữ liệu có cấu trúc và xử lý tài liệu scan.",
      "A knowledge assistant for traditional medicine clinics, helping practitioners and staff find information in reference documents through natural-language questions. Combines RAG, Text-to-SQL and Vision AI for cited document retrieval, structured-data queries and scanned document processing."),
    note: copy("Phân luồng bằng LLM, OCR tiếng Việt, kiểm tra an toàn SQL và SSE streaming.", "LLM intent routing, Vietnamese OCR, SQL safety checks and SSE streaming."),
    tools: ["Python", "FastAPI", "React", "FAISS", "Gemini", "SQL Server", "EasyOCR"],
    image: doctorCover,
    url: "https://github.com/Saonumi/doctor-chatbot",
    status: copy("Mã nguồn public", "Public repository"),
  },
  {
    title: "BASTION",
    category: copy("Multi-Agent AI cho SOC", "Multi-Agent AI for SOC"),
    description: copy(
      "Hỗ trợ đội ngũ trung tâm giám sát an ninh (SOC) sàng lọc cảnh báo và phân tích sự kiện từ email, cloud logs. Các agent Supervisor, Email Analyst, Forensic Analyst và Threat Intel phối hợp thu thập bằng chứng, làm giàu IOC và tổng hợp báo cáo để chuyên viên đánh giá, xử lý sự cố.",
      "Supports Security Operations Center (SOC) teams with alert triage and investigation of email and cloud-log events. Supervisor, Email Analyst, Forensic Analyst and Threat Intel agents coordinate evidence gathering, IOC enrichment and reporting to help analysts assess and respond to incidents."),
    note: copy("ML/DL filtering, MITRE ATT&CK mapping, Sigma rules và PII scrubbing.", "ML/DL filtering, MITRE ATT&CK mapping, Sigma rules and PII scrubbing."),
    tools: ["Python", "LangGraph", "PyTorch", "FastAPI", "AWS", "Pinecone", "React"],
    image: bastionCover,
    url: "https://github.com/longriver293/BASTION",
    status: copy("Mã nguồn public · Dự án nhóm", "Public repository · Team project"),
  },
  {
    title: "SAOVoice",
    category: "Context-Aware Emotional Text-to-Speech",
    description: copy(
      "Nghiên cứu Text-to-Speech cho long-context, giữ mạch cảm xúc liền mạch và tự nhiên xuyên suốt câu chuyện. Kết hợp LLM để phân tích ngữ cảnh với SLERP để nội suy quỹ đạo cảm xúc, điều khiển giọng kể qua VAD, projection network và LoRA.",
      "Research into long-context Text-to-Speech with a consistent, natural emotional arc throughout a story. Combines LLM context analysis with SLERP emotion-trajectory interpolation, guiding narration through VAD, a projection network and LoRA."),
    note: copy("Đã huấn luyện pilot trên CosyVoice2; tiếp tục thử nghiệm chuyển tiếp cảm xúc giữa các đoạn và hướng mở rộng sang tiếng Việt.", "Pilot training on CosyVoice2; ongoing work on emotional transitions between passages and expansion to Vietnamese."),
    tools: ["Python", "PyTorch", "CosyVoice2", "LLM", "SLERP", "VAD", "LoRA"],
    image: voiceCover,
    url: "",
    status: copy("Chưa public · Nghiên cứu & pilot", "Private · Research & pilot"),
  },
];

export const skillGroups = [
  {
    id: "nlp",
    title: "NLP / RAG",
    description: copy("Xây dựng RAG, phân luồng câu hỏi bằng LLM, xử lý tài liệu và chuyển ngôn ngữ tự nhiên thành SQL.", "RAG pipelines, LLM intent routing, document processing and natural-language-to-SQL systems."),
    tools: ["NLP", "RAG", "Text-to-SQL", "LangChain", "LangGraph", "FAISS", "Sentence-Transformers", "Semantic Chunking", "Multimodal RAG"],
  },
  {
    id: "speech",
    title: "SPEECH / DEEP LEARNING",
    description: copy("Text-to-Speech, xử lý dữ liệu giọng nói và thử nghiệm điều khiển cảm xúc theo ngữ cảnh.", "Text-to-Speech, speech data processing and context-aware emotional control experiments."),
    tools: ["Machine Learning", "Deep Learning", "PyTorch", "Text-to-Speech", "Audio Processing", "Model Evaluation"],
  },
  {
    id: "security",
    title: "AI / SECURITY",
    description: copy("Thu thập log, phân tích sự kiện an ninh và xây dựng pipeline Multi-Agent cho SOC. Nghiên cứu bảo mật Text-to-SQL, RAG và MAS.", "Log collection, security event analysis and Multi-Agent SOC pipelines. Security research for Text-to-SQL, RAG and MAS."),
    tools: ["SIEM", "Windows Event Logs", "Sysmon", "ClickHouse", "Anomaly Detection", "MITRE ATT&CK", "Sigma Rules", "Prompt Injection", "LLM Security", "Multi-Agent Systems", "Threat Modeling"],
  },
  {
    id: "engineering",
    title: "ENGINEERING / TOOLS",
    description: copy("Xây dựng backend, giao diện và pipeline dữ liệu cho ứng dụng AI. Kết nối API, cơ sở dữ liệu và công cụ chạy mô hình.", "Backends, interfaces and data pipelines for AI applications. API, database and model-runtime integration."),
    tools: ["Python", "C++", "FastAPI", "React", "SQL Server", "Git"],
  },
];
