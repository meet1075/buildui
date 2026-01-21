import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";


export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "agent/hello" },
  async ({ event, step }) => {
    const helloAgent=createAgent({
        name:"Hello-Agent",
        description:"A simple agent that says hello ",
        system:"You are helpful assistant. Always greet the enthusiasm.",
        model:gemini({model:"gemini-2.5-flash"})
    })
    const {output}=await helloAgent.run("Say Hello to the user!");

    return{
        message: output[0].type === 'text' ? output[0].content : 'Hello!'
    }
  },
);