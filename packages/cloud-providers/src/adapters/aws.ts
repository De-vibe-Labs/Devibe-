import { createMockAdapter } from "../mock.js";

export const awsAdapter = createMockAdapter({
  id: "aws",
  displayName: "AWS",
  defaultRegion: "us-east-1",
  capabilities: {
    compute: ["lambda", "ecs-fargate", "eks-fargate"],
    database: ["rds-serverless", "dynamodb", "aurora"],
    storage: ["s3"],
    queues: ["sqs", "eventbridge"],
    ai: ["bedrock"],
    frontend: ["cloudfront", "amplify"],
  },
  blueprint: [
    { kind: "compute", name: "api-lambda", monthlyUsd: 18, meta: { runtime: "lambda", capacity: 1 } },
    { kind: "database", name: "aurora-serverless", monthlyUsd: 25, meta: { engine: "postgres" } },
    { kind: "storage", name: "s3-artifacts", monthlyUsd: 3, meta: { product: "s3" } },
    { kind: "queue", name: "sqs-events", monthlyUsd: 1, meta: { product: "sqs" } },
    { kind: "ai", name: "bedrock-gateway", monthlyUsd: 10, meta: { product: "bedrock" } },
    { kind: "frontend", name: "cloudfront", monthlyUsd: 5, meta: { product: "cloudfront" } },
  ],
});
