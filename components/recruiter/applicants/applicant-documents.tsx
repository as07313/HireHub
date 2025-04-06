"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Download, Eye } from "lucide-react"

interface ApplicantDocumentsProps {
  applicant: any
}

export function ApplicantDocuments({ applicant }: ApplicantDocumentsProps) {
  // Check if the applicant has any documents
  const hasDocuments = applicant?.resume || applicant?.coverLetter
  
  // Create documents array based on actual applicant data
  const documents = []
  
  // Add resume if available
  if (applicant.resume) {
    documents.push({
      name: applicant.resume.fileName || "Resume.pdf",
      type: "resume",
      size: "Document",
      lastModified: new Date(applicant.resume.uploadDate).toLocaleDateString(),
      filePath: applicant.resume.filePath
    })
  }
  
  // Add cover letter if available
  if (applicant.coverLetter) {
    documents.push({
      name: "Cover_Letter.pdf",
      type: "cover_letter",
      size: "Document",
      lastModified: new Date(applicant.appliedDate).toLocaleDateString(),
      content: applicant.coverLetter
    })
  }

  // Handle document actions
  const handleViewDocument = (doc: any) => {
    if (doc.type === "resume" && doc.filePath) {
      window.open(doc.filePath, "_blank")
    } else if (doc.type === "cover_letter" && doc.content) {
      // For cover letters, we could create a preview modal, but for now just alert
      alert("Cover Letter Content: " + doc.content.substring(0, 100) + "...")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Documents</h2>
        <p className="text-muted-foreground">
          View and download candidate&apos;s documents
        </p>
      </div>

      <div className="space-y-4">
        {documents.length > 0 ? (
          documents.map((doc, index) => (
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
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleViewDocument(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    disabled={!doc.filePath}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No documents available for this applicant</p>
          </Card>
        )}
      </div>
    </div>
  )
}