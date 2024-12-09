"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, FileText, Plus } from "lucide-react"
import { toast } from "sonner"

interface ResumeUploadProps {
  onNext: () => void
}

export function ResumeUpload({ onNext }: ResumeUploadProps) {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === "application/pdf" || 
          file.type === "application/msword" || 
          file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFiles([...files, file])
      } else {
        toast.error("Please upload a PDF or Word document")
      }
    }
  }

  const handleSubmit = () => {
    if (files.length === 0) {
      toast.error("Please upload at least one resume")
      return
    }
    // TODO: Implement resume upload logic
    toast.success("Resume uploaded successfully")
    onNext()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Upload Your Resume</h2>
        <p className="text-sm text-muted-foreground">
          Upload your resume in PDF or Word format. You can upload multiple versions.
        </p>
      </div>

      <div className="grid gap-4">
        {files.map((file, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFiles(files.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}

        <label className="block">
          <Card className="p-8 border-dashed cursor-pointer hover:border-primary/50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <div className="p-3 bg-primary/10 rounded-full">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <p className="font-medium">Add Resume</p>
              <p className="text-sm text-muted-foreground">
                PDF or Word documents up to 10MB
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </Card>
        </label>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          Next: Set Preferences
        </Button>
      </div>
    </div>
  )
}