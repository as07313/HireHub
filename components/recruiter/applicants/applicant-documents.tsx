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
      id: applicant.resume.id, // Add resumeId here
      name: applicant.resume.fileName || "Resume.pdf",
      type: "resume",
      size: "Document",
      lastModified: new Date(applicant.resume.uploadDate).toLocaleDateString(),
      filePath: applicant.resume.filePath // This is the R2 key
    })
  }
  
  // Add cover letter if available
  if (applicant.coverLetter) {
    documents.push({
      name: "Cover_Letter.pdf", // Or generate a more specific name
      type: "cover_letter",
      size: "Document",
      lastModified: new Date(applicant.appliedDate).toLocaleDateString(),
      content: applicant.coverLetter
    })
  }

  // Handle document actions
  const handleViewDocument = (doc: any) => {
    if (doc.type === "resume" && doc.filePath) {
      // Consider if viewing should also use a secure endpoint or presigned URL
      window.open(doc.filePath, "_blank") // This might be a direct R2 link or need adjustment
    } else if (doc.type === "cover_letter" && doc.content) {
      alert("Cover Letter Content: " + doc.content.substring(0, 100) + "...")
    }
  }

  const handleDownloadDocument = (doc: any) => {
    if (doc.type === "resume" && doc.id) { // Check for doc.id (resumeId)
      // The API endpoint is /api/resume/download/[id]
      // doc.id should be the resumeId
      const downloadUrl = `/api/resumes/download/${doc.filePath}`;
      window.open(downloadUrl, '_self'); // Use _self to attempt download in the same tab
    } else if (doc.type === "cover_letter" && doc.content) {
      // For cover letters stored as text content
      const blob = new Blob([doc.content], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = doc.name || "Cover_Letter.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  };

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
                    title="View Document"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDownloadDocument(doc)}
                    disabled={!(doc.filePath || (doc.type === "cover_letter" && doc.content))}
                    title="Download Document"
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