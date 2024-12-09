"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface JobApplicationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function JobApplicationDialog({ open, onOpenChange }: JobApplicationDialogProps) {
  const [resume, setResume] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!resume) {
      toast.error("Please select a resume")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement job application logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Application submitted successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to submit application")
    } finally {
      setIsSubmitting(false)
    }
  }

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
            <label className="text-sm font-medium">Select Resume</label>
            <Select value={resume} onValueChange={setResume}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume1">Software_Engineer_Resume.pdf</SelectItem>
                <SelectItem value="resume2">Frontend_Developer_Resume.pdf</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}