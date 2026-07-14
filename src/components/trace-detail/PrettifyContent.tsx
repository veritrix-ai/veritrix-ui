import { useState } from "react";
import { Check, Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import type { ParsedLlmMessages } from "@/lib/span-content";
import type { Span } from "@/lib/types";

interface PrettifyContentProps {
  span: Span;
  messages: ParsedLlmMessages;
}

export function LlmPrettifyContent({ span, messages }: PrettifyContentProps) {
  const hasContent =
    messages.systemContext ||
    messages.userInput ||
    messages.assistantOutput ||
    messages.rawInput ||
    messages.rawOutput;

  if (!hasContent) {
    return (
      <p className="text-sm text-muted-foreground">
        No prettified content available for this span.
      </p>
    );
  }

  const userContent =
    messages.userInput ??
    (!messages.systemContext && messages.rawInput ? messages.rawInput : null);

  const assistantContent = messages.assistantOutput ?? messages.rawOutput ?? null;

  return (
    <div className="space-y-8">
      {(messages.inputTruncated || messages.outputTruncated) && (
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Content may be truncated at 500 characters.
        </p>
      )}

      {messages.systemContext && (
        <SystemContextBlock content={messages.systemContext} />
      )}

      {userContent && <UserMessageBubble content={userContent} />}

      {assistantContent && <AssistantMessageBlock content={assistantContent} />}

      {span.status === "error" && span.error_message && (
        <div className="rounded-lg border-0 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {span.error_message}
        </div>
      )}
    </div>
  );
}

function SystemContextBlock({ content }: { content: string }) {
  return (
    <section>
      <div className="flex gap-4">
        <RoleAvatar label="S" />
        <div className="min-w-0 flex-1">
          <h4 className="text-xl font-semibold tracking-tight text-foreground">
            System context
          </h4>
          <div className="mt-4 text-sm leading-7 text-foreground">
            <FormattedText content={content} />
          </div>
          <ContentActions content={content} />
        </div>
      </div>
    </section>
  );
}

function UserMessageBubble({ content }: { content: string }) {
  return (
    <section className="flex justify-end">
      <div className="max-w-[85%] rounded-2xl bg-muted px-4 py-3 text-sm leading-6 text-foreground">
        {content}
      </div>
    </section>
  );
}

function AssistantMessageBlock({ content }: { content: string }) {
  return (
    <section>
      <div className="flex gap-4">
        <RoleAvatar label="A" dark />
        <div className="min-w-0 flex-1">
          <div className="text-sm leading-7 text-foreground">
            <FormattedText content={content} />
          </div>
          <ContentActions content={content} />
        </div>
      </div>
    </section>
  );
}

function RoleAvatar({ label, dark = false }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
        dark
          ? "bg-foreground text-background"
          : "bg-muted text-muted-foreground"
      }`}
    >
      {label}
    </span>
  );
}

function ContentActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-4 flex items-center gap-1">
      <ActionButton label={copied ? "Copied" : "Copy"} onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </ActionButton>
      <ActionButton label="Good response">
        <ThumbsUp className="h-4 w-4" />
      </ActionButton>
      <ActionButton label="Bad response">
        <ThumbsDown className="h-4 w-4" />
      </ActionButton>
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function FormattedText({ content }: { content: string }) {
  const parts = content.split(/(`[^`]+`)/g);

  return (
    <p className="whitespace-pre-wrap">
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code
              key={index}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[13px] text-foreground"
            >
              {part.slice(1, -1)}
            </code>
          );
        }

        return <span key={index}>{part}</span>;
      })}
    </p>
  );
}
