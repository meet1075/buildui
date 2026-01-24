import { inngest } from "./client";
import {
  gemini,
  createAgent,
  createTool,
  createNetwork,
} from "@inngest/agent-kit";
import Sandbox from "@e2b/code-interpreter";
import { z } from "zod";
import { PROMPT } from "@/prompt";
import { lastAssistantTextMessageContent } from "./utils";

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("buildui");
      return sandbox.sandboxId;
    });

    const codeAgent = createAgent({
      name: "Code-Agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: gemini({ model: "gemini-2.5-flash" }),
      tools: [
        // 1st tool: terminal
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const result = await sandbox.commands.run(command, {
                  onStdout: (data: string) => {
                    buffers.stdout += data;
                  },
                  onStderr: (data: string) => {
                    buffers.stderr += data;
                  },
                });
                return result.stdout;
              } catch (error) {
                console.log(
                  `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
                );
                return `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
              }
            });
          },
        }),
        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sandbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              })
            ),
          }),
          handler: async ({ files }, { step, network }) => {
            const newFile = await step?.run("createOrUpdateFiles", async () => {
              try {
                const updatedFiles: Record<string, string> = 
                  (network?.state?.data.files as Record<string, string>) || {};
                const sandbox = await Sandbox.connect(sandboxId);
                for (const file of files) {
                  await sandbox.files.write(file.path, file.content);
                  updatedFiles[file.path] = file.content;
                }
                return updatedFiles;
              } catch (error) {
                return "error: " + error;
              }
            });
            if (typeof newFile === "object") {
              network.state.data.files = newFile;
            }
          },
        }),
        createTool({
          name: "readFiles",
          description: "Read files from the sandbox",
          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sandbox = await Sandbox.connect(sandboxId);
                const contents: Array<{ path: string; content: string }> = [];
                for (const file of files) {
                  const content = await sandbox.files.read(file);
                  contents.push({ path: file, content });
                }
                return JSON.stringify(contents);
              } catch (error) {
                return "error: " + error;
              }
            });
          },
        }),
      ],
      lifecycle:{
        onResponse:async({result, network})=>{
          const lastAssistantMessageText=lastAssistantTextMessageContent(result);
          if(lastAssistantMessageText && network){
            if(lastAssistantMessageText.includes("<task_summary>") ){
              network.state.data.summary=lastAssistantMessageText
          }
        }
        return result;
      }
    }
    });

    const network = createNetwork({
      name: "code-agent-network",
      agents: [codeAgent],
      maxIter: 10,
      router: async ({ network }) => {
        const summary = network.state.data.summary;
        if (summary) {
          return;
        }
        return codeAgent;
      },
    });

    const result = await network.run(event.data.value);
    const isError =!result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0;

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    });

    return {
      url: sandboxUrl,
      title: "untitled",
      files: result.state.data.files || {},
      summary: result.state.data.summary || "",
    };
  }
);