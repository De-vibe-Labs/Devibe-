import { SiteNav } from "../components/SiteNav";

const RESOURCES = [
  "Namespaces",
  "Deployments",
  "Services",
  "Ingress",
  "Secrets",
  "ConfigMaps",
  "Autoscaling (HPA)",
  "Monitoring",
  "Helm Charts",
];

export function KubernetesPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <SiteNav />
      <main className="mx-auto max-w-5xl px-6 pt-24 pb-16">
        <p className="text-xs uppercase tracking-[0.2em] text-text-subtle">Kubernetes Manager</p>
        <h1 className="mt-2 text-3xl font-semibold">Cluster automation</h1>
        <p className="mt-2 text-sm text-text-muted">
          Generate manifests via MCS Kubernetes MCP. CLI: <code className="text-primary">monaco k8s</code>
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <div key={r} className="dv-card p-4 text-sm">
              <p className="font-medium">{r}</p>
              <p className="mt-1 text-xs text-text-subtle">Auto-generated · dry-run ready</p>
            </div>
          ))}
        </div>
        <pre className="mt-8 overflow-auto rounded-xl border border-border bg-surface p-4 font-mono text-[11px] text-accent">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: monaco-cloud-app
  namespace: monaco-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: monaco-cloud
  template:
    metadata:
      labels:
        app: monaco-cloud
    spec:
      containers:
        - name: app
          image: registry.monaco.cloud/app:latest
          ports:
            - containerPort: 8080`}</pre>
      </main>
    </div>
  );
}
