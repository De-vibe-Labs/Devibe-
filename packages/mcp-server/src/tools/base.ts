import type { z, ZodRawShape } from "zod";

export interface ToolContext {
  actorId: string;
}

export interface DevibeTool<Shape extends ZodRawShape = ZodRawShape> {
  name: string;
  title: string;
  description: string;
  inputSchema: Shape;
  handler: (
    args: z.objectOutputType<Shape, z.ZodTypeAny>,
    ctx: ToolContext,
  ) => Promise<unknown>;
}

export function defineTool<Shape extends ZodRawShape>(
  tool: DevibeTool<Shape>,
): DevibeTool<Shape> {
  return tool;
}
