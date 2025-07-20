// Minimal configuration preview component
export default function ConfigurationPreview({ config }: { config?: any }) {
  return (
    <div className="border border-emerald-500/30 rounded p-4">
      <div className="text-emerald-400">Configuration Preview</div>
    </div>
  );
}