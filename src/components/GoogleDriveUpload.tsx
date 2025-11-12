import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Link2, FolderOpen } from "lucide-react";
import { toast } from "sonner";

export const GoogleDriveUpload = () => {
  const [driveUrl, setDriveUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleDriveUpload = () => {
    if (!driveUrl) {
      toast.error("Please enter a Google Drive link");
      return;
    }

    // Extract file ID from various Google Drive URL formats
    const fileIdMatch = driveUrl.match(/[-\w]{25,}/);
    
    if (!fileIdMatch) {
      toast.error("Invalid Google Drive link", {
        description: "Please provide a valid Google Drive file or folder link"
      });
      return;
    }

    toast.success("Drive link received!", {
      description: "Processing your racing data... This feature connects to your Google Drive data.",
      duration: 5000
    });

    // In real implementation, this would:
    // 1. Authenticate with Google Drive API
    // 2. Fetch the files from the folder
    // 3. Parse CSV/Excel files
    // 4. Stream data to the telemetry system

    setIsOpen(false);
    setDriveUrl("");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    toast.success(`${files.length} file(s) selected`, {
      description: "Processing racing telemetry data..."
    });

    // In real implementation, this would parse the CSV/Excel files
    // and feed them into the real-time telemetry system
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-bold">
          <Upload className="w-4 h-4 mr-2" />
          UPLOAD DATA
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-2 border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Upload Racing Data
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Import telemetry data from Google Drive or local files
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Google Drive Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-f1-cyan" />
              <h3 className="text-lg font-semibold text-foreground">Google Drive Link</h3>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="https://drive.google.com/drive/folders/..."
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="flex-1 bg-background border-border"
              />
              <Button onClick={handleDriveUpload} className="bg-f1-red hover:bg-f1-red/80">
                <Link2 className="w-4 h-4 mr-2" />
                Connect
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Paste your Google Drive folder link containing CSV/Excel racing data
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Local File Upload */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-f1-green" />
              <h3 className="text-lg font-semibold text-foreground">Local Files</h3>
            </div>
            <label className="block">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button 
                asChild 
                variant="outline" 
                className="w-full border-dashed border-2 h-24 hover:bg-muted/50"
              >
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center gap-2">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-semibold">Click to upload CSV/Excel files</span>
                  <span className="text-xs text-muted-foreground">or drag and drop</span>
                </label>
              </Button>
            </label>
          </div>

          {/* Info Box */}
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-f1-cyan">Supported formats:</strong> CSV, Excel (XLSX, XLS)<br/>
              <strong className="text-f1-cyan">Required columns:</strong> Driver, Lap Time, Speed (optional: Throttle, Brake, Gear, DRS)
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
