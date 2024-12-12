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

interface ApplicantActionsProps {
  jobId: string;
  applicant: any;
}

export function ApplicantActions({ jobId, applicant }: ApplicantActionsProps) {
  const [newStage, setNewStage] = useState(applicant.stage);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStageUpdate = async () => {
    setIsUpdating(true);
    try {
      // TODO: Implement stage update logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Application stage updated');
    } catch (error) {
      toast.error('Failed to update stage');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Application Stage</h2>
        <Select value={newStage} onValueChange={setNewStage}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="screening">Screening</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="offer">Offer</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          className="w-full mt-4" 
          onClick={handleStageUpdate}
          disabled={isUpdating || newStage === applicant.stage}
        >
          {isUpdating ? 'Updating...' : 'Update Stage'}
        </Button>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        
        <Button variant="outline" className="w-full justify-start">
          <Calendar className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Video className="mr-2 h-4 w-4" />
          Start Video Call
        </Button>
        
        <Button variant="outline" className="w-full justify-start">
          <Mail className="mr-2 h-4 w-4" />
          Send Message
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start text-red-600 hover:text-red-600"
        >
          <UserX className="mr-2 h-4 w-4" />
          Reject Application
        </Button>
      </div>
    </Card>
  );
}