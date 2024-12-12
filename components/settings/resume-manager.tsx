// components/settings/resume-manager.tsx
"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Upload, MoreVertical, Download, Pencil, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Resume {
  id: string
  name: string
  size: string
  lastModified: string
  progress?: number
  status: 'uploading' | 'completed' | 'error'
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [uploading, setUploading] = useState(false)
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["application/pdf", "application/msword", 
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"]
          .includes(file.type)) {
      toast.error("Please upload a PDF or Word document");
      return;
    }

    try {

      setUploading(true);
      const newResume: Resume = {
        id: Date.now().toString(),
        name: file.name,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        lastModified: new Date().toLocaleDateString(),
        progress: 0,
        status: 'uploading'
      };
      
      setResumes(prev => [...prev, newResume]);

      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token')
    
      const response = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to upload resume');
      }

      const result = await response.json();

      setResumes(prev => prev.map(r => 
        r.id === newResume.id 
          ? { ...r, progress: 100, status: 'completed' }
          : r
      ));

      toast.success("Resume uploaded successfully");

    } catch (error) {
      toast.error(error.message || "Failed to upload resume");
      setResumes(prev => prev.filter(r => r.id !== newResume.id));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Call API to delete resume
      await fetch(`/api/resume/${id}`, { method: 'DELETE' })
      
      setResumes((prev) => prev.filter((resume) => resume.id !== id))
      toast.success("Resume deleted successfully")
    } catch (error) {
      toast.error("Failed to delete resume")
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Resume Manager</h2>
            <p className="text-sm text-muted-foreground">
              Upload and manage your resumes
            </p>
          </div>
          <Button 
            onClick={() => document.getElementById('resume-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>

        <div className="space-y-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center space-x-4">
                <div className="rounded-lg border p-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{resume.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {resume.size} • Last modified {resume.lastModified}
                  </p>
                  {resume.status === 'uploading' && (
                    <Progress value={resume.progress} className="mt-2 h-1.5" />
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDelete(resume.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <input
        id="resume-upload"
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx"
        onChange={handleUpload}
      />
    </Card>
  )
}