// components/recruiter/applicants/applicant-actions.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Mail, Video, UserX } from 'lucide-react';
import { toast } from 'sonner';
import { InterviewDialog } from '@/components/recruiter/applicants/interview-dialog';

// ...existing imports...
import { updateApplicantStage } from '@/app/actions/recruiter/update-applicant-stage'; // Import the server action

interface ApplicantActionsProps {
  jobId: string;
  applicant: any; // Consider using a more specific type like JobApplicant
}

export function ApplicantActions({ jobId, applicant }: ApplicantActionsProps) {
  // Use separate states: one for the actual current stage, one for the select input value
  const [currentStage, setCurrentStage] = useState(applicant.stage);
  const [selectedStage, setSelectedStage] = useState(applicant.stage);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showInterviewDialog, setShowInterviewDialog] = useState(false);
  
  console.log("applicant data", applicant)

  const handleStageUpdate = async () => {
    // Prevent update if the stage hasn't changed
    if (selectedStage === currentStage) {
      toast.info("Stage is already set to this value.");
      return;
    }

    setIsUpdating(true);
    try {
      // Call the server action directly
      console.log("Client: Updating stage for applicant ID:", applicant.id); // <-- Add this log
      console.log("Client: Selected stage:", selectedStage); // <-- Add this log
      console.log("Client: Current stage:", currentStage); // <-- Add this log
      const result = await updateApplicantStage(applicant.id, jobId, selectedStage);

      if (result.success) {
        setCurrentStage(selectedStage); // Update the actual current stage state on success
        toast.success('Application stage updated successfully');
      } else {
        // Revert the select dropdown if the update failed
        setSelectedStage(currentStage);
        toast.error(result.error || 'Failed to update stage. Please try again.');
      }
    } catch (error) {
      // Handle unexpected errors during the server action call
      setSelectedStage(currentStage); // Revert select on error
      toast.error('An unexpected error occurred.');
      console.error("Stage update error:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handler for the Reject button
  const handleReject = async () => {
    if (currentStage === 'rejected') return; // Already rejected

    setIsUpdating(true);
    const result = await updateApplicantStage(applicant.id, jobId, 'rejected');
    if (result.success) {
      setCurrentStage('rejected');
      setSelectedStage('rejected'); // Sync select box
      toast.success('Application rejected');
    } else {
      toast.error(result.error || 'Failed to reject application');
    }
    setIsUpdating(false);
  };


  return (
    <>
      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Application Stage</h2>
          {/* Bind Select to selectedStage */}
          <Select value={selectedStage} onValueChange={setSelectedStage}>
            <SelectTrigger>
              {/* Display the selected stage */}
              <SelectValue placeholder="Select stage..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              {/* Add 'shortlist' if it's a valid stage in your model */}
              {/* <SelectItem value="shortlist">Shortlist</SelectItem> */}
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="offer">Offer</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full mt-4"
            onClick={handleStageUpdate}
            // Disable if updating or if the selected stage is the same as the current one
            disabled={isUpdating || selectedStage === currentStage}
          >
            {isUpdating ? 'Updating...' : 'Update Stage'}
          </Button>
        </div>

        <Separator />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>

          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => setShowInterviewDialog(true)}
            disabled={isUpdating} // Disable while any update is happening
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>

          {/* Reject Button */}
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleReject}
            disabled={isUpdating || currentStage === 'rejected'} // Disable if updating or already rejected
          >
            <UserX className="mr-2 h-4 w-4" />
            Reject Application
          </Button>
        </div>
      </Card>

      <InterviewDialog
        open={showInterviewDialog}
        onOpenChange={setShowInterviewDialog}
        candidate={applicant}
      />
    </>
  );
}