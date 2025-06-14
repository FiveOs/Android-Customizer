import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { InsertKernelConfiguration } from "@shared/schema";

interface ConfigurationPreviewProps {
  config: Partial<InsertKernelConfiguration>;
}

export default function ConfigurationPreview({ config }: ConfigurationPreviewProps) {
  const { toast } = useToast();

  const generatePythonConfig = () => {
    return {
      device: config.device || "",
      codename: config.codename || "",
      kernel_repo: config.kernelRepo || "",
      kernel_branch: config.kernelBranch || "",
      nethunter_patches_repo: config.nethunterPatchesRepo || "",
      nethunter_patches_branch: config.nethunterPatchesBranch || "",
      nethunter_patches_dir_relative: config.nethunterPatchesDirRelative || "",
      git_patch_level: config.gitPatchLevel || "1",
      output_dir: config.outputDir || "",
      defconfig_filename_template: config.defconfigFilenameTemplate || "",
      kernel_arch: config.kernelArch || "",
      kernel_cross_compile: config.kernelCrossCompile || "",
      kernel_image_name_patterns: config.kernelImageNamePatterns || [],
      features: {
        wifi_monitor_mode: config.features?.wifiMonitorMode || false,
        usb_gadget: config.features?.usbGadget || false,
        hid_support: config.features?.hidSupport || false,
        rtl8812au_driver: config.features?.rtl8812auDriver || false,
      },
      custom_kernel_configs: config.customKernelConfigs || [],
      wsl_distro_name: config.wslDistroName || "",
    };
  };

  const copyToClipboard = () => {
    const configJson = JSON.stringify(generatePythonConfig(), null, 2);
    navigator.clipboard.writeText(configJson).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Configuration has been copied to clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Failed to copy configuration to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader className="border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white">Configuration Preview</CardTitle>
            <CardDescription>Review your kernel build configuration</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyToClipboard}
            className="bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 max-h-64 overflow-y-auto log-viewer">
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(generatePythonConfig(), null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
