
import type { AgentResult, Message, TextMessage, TextContent } from "@inngest/agent-kit";

export function lastAssistantTextMessageContent(result: AgentResult): string | undefined {
    const lastAssistantTextMessageIndex = result.output.findLastIndex(
        (message: Message) => message.role === "assistant"
    );

    const message = result.output[lastAssistantTextMessageIndex] as TextMessage | undefined;

    return message?.content
        ? typeof message.content === "string"
            ? message.content
            : (message.content as TextContent[]).map((c) => c.text).join("")
        : undefined;
}