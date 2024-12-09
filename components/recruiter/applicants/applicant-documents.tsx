"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Download, Eye } from "lucide-react"

interface ApplicantDocumentsProps {
  applicant: any
}

const documents = [
  {
    name: "Resume.pdf",
    type: "resume",
    size: "245 KB",
    lastModified: "2024-03-15",
  },
  {
    name: "Cover_Letter.pdf",
    type: "cover_letter",
    size: "180 KB",
    lastModified: "2024-03-15",
  },
  {
    name: "Portfolio.pdf",
    type: "portfolio",
    size: "1.2 MB",
    lastModified: "2024-03-15",
  },
]

export function ApplicantDocuments({ applicant }: ApplicantDocumentsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-muted-foreground">
          View and download candidate&apos;s documents
        </p>
      </div>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="rounded-lg border p-2">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {doc.size} • Uploaded on {doc.lastModified}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}