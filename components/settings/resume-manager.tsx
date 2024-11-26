"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
}

export function ResumeManager() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      name: "Software_Engineer_Resume.pdf",
      size: "245 KB",
      lastModified: "2024-01-15",
    },
    {
      id: "2",
      name: "Frontend_Developer_Resume.pdf",
      size: "180 KB",
      lastModified: "2024-01-10",
    },
  ])

  const handleUpload = () => {
    // TODO: Implement resume upload logic
    toast.success("Resume uploaded successfully")
  }

  const handleDelete = (id: string) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id))
    toast.success("Resume deleted successfully")
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
          <Button onClick={handleUpload}>
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
    </Card>
  )
}