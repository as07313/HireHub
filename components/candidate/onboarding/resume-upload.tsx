// components/candidate/onboarding/resume-upload.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, X } from "lucide-react"
import { toast } from "sonner"

interface UploadedFile {
  file: File
  id: string
  parsedData?: any
  progress: number
}

export function ResumeUpload({ onNext }: { onNext: () => void }) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!["application/pdf", "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
          .includes(file.type)) {
      toast.error("Please upload a PDF or Word document")
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB")
      return
    }

    try {
      setUploading(true)
      const newFile: UploadedFile = {
        file,
        id: Date.now().toString(),
        progress: 0
      }
      setFiles(prev => [...prev, newFile])

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to parse resume')
      }

      const parsedData = await response.json()
      
      setFiles(prev => prev.map(f => 
        f.id === newFile.id 
          ? { ...f, parsedData, progress: 100 }
          : f
      ))

      toast.success("Resume parsed successfully")

    } catch (error) {
      toast.error("Failed to parse resume")
      setFiles(prev => prev.filter(f => f.id !== Date.now().toString()))
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Upload Resume</h2>
        <p className="text-muted-foreground">
          Upload your resume to automatically fill your profile
        </p>
      </div>

      <div className="grid gap-4">
        {files.map((file) => (
          <Card key={file.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">{file.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveFile(file.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {file.progress < 100 && (
              <Progress value={file.progress} className="mt-2 h-2" />
            )}
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => document.getElementById('resume-upload')?.click()}
          disabled={uploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Resume
        </Button>
        {files.length > 0 && (
          <Button onClick={onNext}>
            Continue
          </Button>
        )}
      </div>
      
      <input
        id="resume-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
    </div>
  )
}