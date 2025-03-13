// components/recruiter/jobs/jobs-filter.tsx
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GridIcon, List, Search } from "lucide-react"

interface JobsFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  viewType: string
  onViewChange: (view: string) => void
}

export function JobsFilter({ searchQuery, onSearchChange, viewType, onViewChange }: JobsFilterProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search jobs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      
      <div className="flex gap-1 border rounded-md p-1">
        <Button
          variant={viewType === 'list' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('list')}
          className="h-8 w-8 p-0 flex items-center justify-center"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={viewType === 'grid' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => onViewChange('grid')}
          className="h-8 w-8 p-0 flex items-center justify-center"
        >
          <GridIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}