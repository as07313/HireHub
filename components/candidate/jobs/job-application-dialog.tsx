// components/candidate/jobs/job-application-dialog.tsx
"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { Upload, Loader2, Check } from "lucide-react"

interface JobApplicationDialogProps {
  jobId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Resume {
  _id: string;
  fileName: string;
}

export function JobApplicationDialog({ jobId, open, onOpenChange }: JobApplicationDialogProps) {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [selectedResume, setSelectedResume] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [processingStage, setProcessingStage] = useState<'idle' | 'processing' | 'processed'>('idle')
  const [progress, setProgress] = useState(0)
  const [isLoadingResumes, setIsLoadingResumes] = useState(false)
  const selectKey = useRef(0)


  // Fetch user's resumes
    const fetchResumes = async () => {
      try {
        setIsLoadingResumes(true);
        const token = localStorage.getItem('token');
        const response = await fetch('/api/resume', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch resumes');
        const data = await response.json();
        setResumes(data);
      } catch (error) {
        toast.error('Failed to load resumes');
      }
      finally {
        setIsLoadingResumes(false);
      }
    };

    useEffect(()=> {
      if (open) {
        fetchResumes();
      }
  }, [open]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData()
      formData.append('file', file)
      formData.append('isForApplication', 'true')

      const token = localStorage.getItem('token')
      const response = await fetch('/api/resume/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload resume')
      }

      const newResume = await response.json();
      setResumes(prev => [...prev, newResume]);
      setSelectedResume(newResume._id);
      selectKey.current += 1;
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload resume');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedResume) {
      toast.error("Please select a resume");
      return;
    }
  
    setIsSubmitting(true);
    setProcessingStage('processing');
  
    try {
      // Simulate progress while processing
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);
  
      // Submit the application directly - this will trigger resume queuing
      const token = localStorage.getItem('token');
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          jobId,
          resumeId: selectedResume,
          coverLetter,
          processResume: true  // This flag can be used server-side to trigger queue processing
        })
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }
  
      // Complete the progress bar and show success
      clearInterval(progressInterval);
      setProgress(100);
      setProcessingStage('processed');
  
      toast.success("Application submitted successfully!");
      onOpenChange(false);
      setCoverLetter("");
      setSelectedResume("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setIsSubmitting(false);
      setProcessingStage('idle');
      setProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Apply for this position</DialogTitle>
          <DialogDescription>
            Complete your application by selecting a resume and adding a cover letter.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Resume</label>
            <div className="flex gap-2">
              <Select value={selectedResume} onValueChange={setSelectedResume}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((resume, index) => (
                    <SelectItem key={index} value={resume._id}>
                      {resume.fileName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={() => document.getElementById('resume-upload')?.click()}
                disabled={isUploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload New'}
              </Button>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          {processingStage !== 'idle' && (
            <div className="space-y-2 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {processingStage === 'processing' ? (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium">
                    {processingStage === 'processing' 
                      ? 'Processing resume...' 
                      : 'Resume processed successfully'}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Letter</label>
            <Textarea
              placeholder="Write your cover letter here..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedResume}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}