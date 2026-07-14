import type { Span } from "@/lib/types";

const PREVIEW_LIMIT = 500;

export interface ParsedLlmMessages {
  systemContext: string | null;
  userInput: string | null;
  assistantOutput: string | null;
  rawInput: string;
  rawOutput: string;
  inputTruncated: boolean;
  outputTruncated: boolean;
}

export function getSpanDisplayName(span: Span): string {
  const spanName = span.attributes["agentops.span_name"] ?? span.attributes["span_name"];
  if (typeof spanName === "string" && spanName.trim()) {
    return spanName;
  }

  if (span.span_type === "llm") {
    const snippet = span.output_preview || span.input_preview;
    if (snippet) {
      const cleaned = snippet.replace(/\s+/g, " ").trim();
      if (cleaned.length > 48) {
        return `${cleaned.slice(0, 48)}…`;
      }
      return cleaned;
    }
  }

  return span.agent_name;
}

export function getSpanAgentName(span: Span): string {
  const agentName = span.attributes["agentops.agent_name"];
  if (typeof agentName === "string" && agentName.trim()) {
    return agentName;
  }

  return span.agent_name;
}

export function isPreviewTruncated(value: string): boolean {
  return value.length >= PREVIEW_LIMIT;
}

export function tryParseJson(value: string): unknown | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
    return null;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

export function formatContent(value: unknown): string {
  if (value == null) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return JSON.stringify(value, null, 2);
}

function flattenGenerationOutput(parsed: unknown): string | null {
  if (typeof parsed === "string") {
    return parsed;
  }

  if (Array.isArray(parsed)) {
    const parts = parsed
      .flatMap((entry) => {
        if (typeof entry === "string") {
          return [entry];
        }
        if (Array.isArray(entry)) {
          return entry
            .map((nested) => (typeof nested === "string" ? nested : null))
            .filter((nested): nested is string => Boolean(nested));
        }
        return [];
      })
      .filter(Boolean);

    if (parts.length > 0) {
      return parts.join("\n\n");
    }
  }

  return null;
}

function looksLikeSystemPrompt(text: string): boolean {
  const normalized = text.toLowerCase();
  return (
    normalized.includes("you are part of a multi-agent system") ||
    normalized.includes("you are a helpful") ||
    normalized.includes("you are an") ||
    normalized.startsWith("you are ") ||
    normalized.includes("system prompt") ||
    (text.length > 180 && normalized.includes("you are"))
  );
}

function parsePromptList(prompts: string[]): { system: string | null; user: string | null } {
  if (prompts.length === 0) {
    return { system: null, user: null };
  }

  if (prompts.length === 1) {
    if (looksLikeSystemPrompt(prompts[0])) {
      return { system: prompts[0], user: null };
    }
    return { system: null, user: prompts[0] };
  }

  const systemParts: string[] = [];
  const userParts: string[] = [];

  for (const prompt of prompts) {
    if (looksLikeSystemPrompt(prompt) && userParts.length === 0) {
      systemParts.push(prompt);
    } else {
      userParts.push(prompt);
    }
  }

  return {
    system: systemParts.length > 0 ? systemParts.join("\n\n") : null,
    user: userParts.length > 0 ? userParts.join("\n\n") : null,
  };
}

function splitSystemFromUser(text: string): { system: string | null; user: string | null } {
  if (!looksLikeSystemPrompt(text)) {
    return { system: null, user: text };
  }

  const paragraphs = text.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);
  if (paragraphs.length >= 2) {
    const last = paragraphs[paragraphs.length - 1];
    if (last.length <= 200 && !looksLikeSystemPrompt(last)) {
      return {
        system: paragraphs.slice(0, -1).join("\n\n"),
        user: last,
      };
    }
  }

  return { system: text, user: null };
}

export function parseLlmMessages(span: Span): ParsedLlmMessages {
  const rawInput = span.input_preview.trim();
  const rawOutput = span.output_preview.trim();
  let systemContext: string | null = null;
  let userInput: string | null = null;
  let assistantOutput: string | null = rawOutput || null;

  const parsedInput = rawInput ? tryParseJson(rawInput) : null;
  const parsedOutput = rawOutput ? tryParseJson(rawOutput) : null;

  if (Array.isArray(parsedInput) && parsedInput.every((entry) => typeof entry === "string")) {
    const parsed = parsePromptList(parsedInput as string[]);
    systemContext = parsed.system;
    userInput = parsed.user;
  } else if (typeof parsedInput === "string") {
    const split = splitSystemFromUser(parsedInput);
    systemContext = split.system;
    userInput = split.user;
  } else if (rawInput) {
    const split = splitSystemFromUser(rawInput);
    systemContext = split.system;
    userInput = split.user;
  }

  const flattenedOutput = parsedOutput ? flattenGenerationOutput(parsedOutput) : null;
  if (flattenedOutput) {
    assistantOutput = flattenedOutput;
  }

  return {
    systemContext,
    userInput,
    assistantOutput,
    rawInput,
    rawOutput,
    inputTruncated: isPreviewTruncated(span.input_preview),
    outputTruncated: isPreviewTruncated(span.output_preview),
  };
}

export function parseSpanIo(span: Span): {
  input: string | null;
  output: string | null;
  inputParsed: unknown | null;
  outputParsed: unknown | null;
  inputTruncated: boolean;
  outputTruncated: boolean;
} {
  const inputParsed = span.input_preview ? tryParseJson(span.input_preview) : null;
  const outputParsed = span.output_preview ? tryParseJson(span.output_preview) : null;

  return {
    input: span.input_preview ? formatContent(inputParsed ?? span.input_preview) : null,
    output: span.output_preview ? formatContent(outputParsed ?? span.output_preview) : null,
    inputParsed,
    outputParsed,
    inputTruncated: isPreviewTruncated(span.input_preview),
    outputTruncated: isPreviewTruncated(span.output_preview),
  };
}

export function getSpanTags(span: Span): string[] {
  const tag = span.attributes["agentops.tag"];
  if (typeof tag === "string" && tag.trim()) {
    return [tag];
  }

  if (Array.isArray(tag)) {
    return tag.filter((entry): entry is string => typeof entry === "string");
  }

  return [];
}
