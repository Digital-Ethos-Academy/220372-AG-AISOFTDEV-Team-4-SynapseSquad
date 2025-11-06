import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, GitBranch, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';

export function TaskDependencyGraph({ currentTaskId, allTasks = [], onSelectTask }) {
  const { apiCall } = useAuth();
  const [dependencies, setDependencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingDependency, setIsAddingDependency] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');

  // Fetch all dependencies from the API
  const fetchDependencies = useCallback(async () => {
    if (!currentTaskId) return;
    
    setIsLoading(true);
    try {
  console.log('Making API call to /tasks_dependencies with task filter');
  const response = await apiCall(`/tasks_dependencies?task_id=${currentTaskId}`);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Failed to fetch dependencies: ${response.status} ${errorText}`);
      }
      const deps = await response.json();
      console.log('Dependencies received (already filtered server-side):', deps);
      setDependencies(deps);
    } catch (error) {
      console.error('Error fetching dependencies:', error);
      toast.error('Failed to load task dependencies');
    } finally {
      setIsLoading(false);
    }
  }, [currentTaskId, apiCall]);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  // Create a new dependency
  const handleCreateDependency = async () => {
    if (!selectedTaskId || !currentTaskId) return;

    try {
  const response = await apiCall('/tasks_dependencies', {
        method: 'POST',
        body: JSON.stringify({
          task_id: currentTaskId,
          depends_on_task_id: parseInt(selectedTaskId)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create dependency');
      }

      toast.success('Dependency added successfully');
      setSelectedTaskId('');
      setIsAddingDependency(false);
      fetchDependencies();
    } catch (error) {
      console.error('Error creating dependency:', error);
      toast.error('Failed to add dependency');
    }
  };

  // Delete a dependency
  const handleDeleteDependency = async (taskId, dependsOnTaskId) => {
    try {
      const response = await apiCall(`/tasks_dependencies?task_id=${taskId}&depends_on_task_id=${dependsOnTaskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete dependency');
      }

      toast.success('Dependency removed successfully');
      fetchDependencies();
    } catch (error) {
      console.error('Error deleting dependency:', error);
      toast.error('Failed to remove dependency');
    }
  };

  // Get task by ID
  const getTaskById = (taskId) => {
    return allTasks.find(task => task.id === taskId) || { 
      id: taskId, 
      title: `Task ${taskId}`, 
      status: 'unknown' 
    };
  };

  // Get dependencies where current task depends on others
  const dependsOn = dependencies.filter(dep => dep.task_id === currentTaskId);
  
  // Get dependencies where other tasks depend on current task
  const dependents = dependencies.filter(dep => dep.depends_on_task_id === currentTaskId);

  // Available tasks to add as dependencies (excluding current task and already dependent tasks)
  const availableTasks = allTasks.filter(task => 
    task.id !== currentTaskId && 
    !dependsOn.some(dep => dep.depends_on_task_id === task.id)
  );

  if (!currentTaskId) {
    return (
      <div className="text-center text-slate-500 py-8">
        <GitBranch className="w-10 h-10 mx-auto mb-3 opacity-40 text-indigo-300" />
        <p className="font-medium">No task selected</p>
        <p className="text-sm text-slate-400">Select a task to view its dependencies</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-lg">
            <GitBranch className="w-5 h-5 text-indigo-600" />
          </div>
          <Label className="text-lg font-semibold text-slate-800">Task Dependencies</Label>
        </div>
        <Button
          onClick={() => setIsAddingDependency(true)}
          size="sm"
          disabled={availableTasks.length === 0}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Dependency
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-4">
          <p className="text-slate-500">Loading dependencies...</p>
        </div>
      )}

      {/* Add Dependency Form */}
      {isAddingDependency && (
        <div className="border border-indigo-200 rounded-lg p-4 space-y-4 bg-gradient-to-r from-indigo-50 to-purple-50">
          <Label className="text-indigo-800 font-medium">This task depends on:</Label>
          <div className="flex gap-2">
            <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a task..." />
              </SelectTrigger>
              <SelectContent>
                {availableTasks.map(task => (
                  <SelectItem key={task.id} value={task.id.toString()}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleCreateDependency}
              disabled={!selectedTaskId}
              size="sm"
            >
              Add
            </Button>
            <Button 
              onClick={() => {
                setIsAddingDependency(false);
                setSelectedTaskId('');
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Dependencies This Task Has */}
      {dependsOn.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"></div>
            This task depends on:
          </Label>
          <div className="space-y-2">
            {dependsOn.map(dep => {
              const dependencyTask = getTaskById(dep.depends_on_task_id);
              return (
                <div key={dep.id} className="flex items-center justify-between p-4 border border-emerald-200 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <button
                    onClick={() => onSelectTask && onSelectTask(dependencyTask)}
                    className="flex items-center gap-3 flex-1 text-left hover:bg-emerald-100 rounded-lg p-2 -m-2 transition-colors duration-200"
                  >
                    <ArrowRight className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-semibold text-slate-900">{dependencyTask.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            dependencyTask.status === 'completed' ? 'default' :
                            dependencyTask.status === 'in_progress' ? 'secondary' :
                            dependencyTask.status === 'blocked' ? 'destructive' : 'outline'
                          }
                          className="text-xs capitalize"
                        >
                          {dependencyTask.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </button>
                  <Button
                    onClick={() => handleDeleteDependency(currentTaskId, dep.depends_on_task_id)}
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tasks That Depend On This Task */}
      {dependents.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-800 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full"></div>
            Tasks that depend on this one:
          </Label>
          <div className="space-y-2">
            {dependents.map(dep => {
              const dependentTask = getTaskById(dep.task_id);
              return (
                <div key={dep.id} className="flex items-center justify-between p-4 border border-violet-200 rounded-xl bg-gradient-to-r from-violet-50 to-purple-50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <button
                    onClick={() => onSelectTask && onSelectTask(dependentTask)}
                    className="flex items-center gap-3 flex-1 text-left hover:bg-violet-100 rounded-lg p-2 -m-2 transition-colors duration-200"
                  >
                    <ArrowRight className="w-5 h-5 text-violet-600 rotate-180" />
                    <div>
                      <p className="font-semibold text-slate-900">{dependentTask.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant={
                            dependentTask.status === 'completed' ? 'default' :
                            dependentTask.status === 'in_progress' ? 'secondary' :
                            dependentTask.status === 'blocked' ? 'destructive' : 'outline'
                          }
                          className="text-xs capitalize"
                        >
                          {dependentTask.status?.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </button>
                  <Button
                    onClick={() => handleDeleteDependency(dep.task_id, currentTaskId)}
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-100 transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && dependencies.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <GitBranch className="w-12 h-12 mx-auto mb-3 opacity-40 text-indigo-300" />
          <p className="font-medium text-slate-700">No dependencies found</p>
          <p className="text-sm text-slate-500">Add dependencies to track task relationships</p>
        </div>
      )}
    </div>
  );
}