import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';

export function CreateTaskDialog({ open, onOpenChange, onCreateTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('pending');
  const [estimatedDuration, setEstimatedDuration] = useState(4);
  const [tshirtSize, setTshirtSize] = useState('M');
  const [priorityScore, setPriorityScore] = useState(50);
  const [error, setError] = useState('');

  // Update estimated duration when t-shirt size changes
  const handleTshirtSizeChange = (size) => {
    setTshirtSize(size);
    
    // Duration suggestions based on t-shirt size
    const durationMap = {
      'XS': 2,
      'S': 4,
      'M': 8,
      'L': 16,
      'XL': 24,
    };
    
    if (size) {
      setEstimatedDuration(durationMap[size]);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim()) {
      setError('Description cannot be empty');
      return;
    }
    if (!deadline) {
      setError('Deadline is required');
      return;
    }

    onCreateTask({
      title,
      description,
      deadline,
      status,
      estimated_duration: estimatedDuration,
      tshirt_size: tshirtSize,
      priority_score: priorityScore,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDeadline('');
    setStatus('pending');
    setEstimatedDuration(4);
    setTshirtSize('M');
    setPriorityScore(50);
    setError('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setDeadline('');
    setStatus('pending');
    setEstimatedDuration(4);
    setTshirtSize('M');
    setPriorityScore(50);
    setError('');
    onOpenChange(false);
  };

  const getPriorityLevel = (score) => {
    if (score >= 70) return { label: 'High', variant: 'destructive' };
    if (score >= 40) return { label: 'Medium', variant: 'default' };
    return { label: 'Low', variant: 'secondary' };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Enter task description..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError('');
              }}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Deadline</Label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  setError('');
                }}
              />
            </div>
          </div>

          {/* T-Shirt Size Selector */}
          <div className="space-y-2">
            <Label>T-Shirt Size (Task Complexity)</Label>
            <div className="flex gap-2">
              {(['XS', 'S', 'M', 'L', 'XL']).map((size) => (
                <Button
                  key={size}
                  type="button"
                  variant={tshirtSize === size ? 'default' : 'outline'}
                  className="flex-1"
                  onClick={() => handleTshirtSizeChange(size)}
                >
                  {size}
                </Button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Duration suggestion will auto-adjust based on size
            </p>
          </div>

          {/* Estimated Duration with Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Estimated Duration</Label>
              <span className="text-sm text-slate-600">{estimatedDuration} hours</span>
            </div>
            <Slider
              value={[estimatedDuration]}
              onValueChange={([value]) => setEstimatedDuration(value)}
              min={1}
              max={24}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>1 hour</span>
              <span>24 hours</span>
            </div>
          </div>

          {/* Priority Score Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Priority Score</Label>
              <Badge variant={priorityScore >= 70 ? 'destructive' : priorityScore >= 40 ? 'default' : 'secondary'}>
                {getPriorityLevel(priorityScore).label}
              </Badge>
            </div>
            <Slider
              value={[priorityScore]}
              onValueChange={([value]) => setPriorityScore(value)}
              min={1}
              max={100}
              step={1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low (1)</span>
              <span className="text-slate-900 font-medium">{priorityScore}</span>
              <span>High (100)</span>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}