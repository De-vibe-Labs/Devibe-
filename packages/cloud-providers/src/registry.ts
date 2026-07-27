import type { CloudProviderId } from "@devibe/project-config";
import type { CloudProviderInterface } from "./types.js";
import { cloudflareAdapter } from "./adapters/cloudflare.js";
import { awsAdapter } from "./adapters/aws.js";
import { gcpAdapter } from "./adapters/gcp.js";
import { azureAdapter } from "./adapters/azure.js";

const REGISTRY: Record<CloudProviderId, CloudProviderInterface> = {
  cloudflare: cloudflareAdapter,
  aws: awsAdapter,
  gcp: gcpAdapter,
  azure: azureAdapter,
};

export function getAdapter(id: CloudProviderId): CloudProviderInterface {
  const adapter = REGISTRY[id];
  if (!adapter) {
    throw new Error(`Unknown cloud provider: ${id}`);
  }
  return adapter;
}

export function listAdapters(): CloudProviderInterface[] {
  return Object.values(REGISTRY);
}

export function resolveAdapters(ids: CloudProviderId[]): CloudProviderInterface[] {
  return ids.map(getAdapter);
}
