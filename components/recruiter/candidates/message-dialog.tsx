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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface MessageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidate: any
}

export function MessageDialog({
  open,
  onOpenChange,
  candidate,
}: MessageDialogProps) {
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSubmitting(true)
    try {
      // TODO: Implement message sending logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Message sent successfully")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to send message")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Message to {candidate.name}</DialogTitle>
          <DialogDescription>
            Send a direct message to the candidate
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Write your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[200px]"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}