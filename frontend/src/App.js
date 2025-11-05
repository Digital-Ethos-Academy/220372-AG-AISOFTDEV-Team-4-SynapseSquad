import React, { useState, useEffect } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { TaskList } from './components/TaskList';
import { TaskDetailsPanel } from './components/TaskDetailsPanel';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

function App() {
  const [selectedView, setSelectedView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Task management state
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [tasksError, setTasksError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/status`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatus(data);
      } catch (err) {
        setError("Failed to fetch status from the backend.");
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        setTasksLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/tasks`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setTasksError("Failed to fetch tasks from the backend.");
        console.error("Error fetching tasks:", err);
      } finally {
        setTasksLoading(false);
      }
    };

    fetchStatus();
    fetchTasks();
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  // Task management functions
  const handleCreateTask = async (task) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      
      toast.success('Task created successfully!');
    } catch (err) {
      console.error("Error creating task:", err);
      const isNetworkError = err.name === 'TypeError' || err.message.includes('fetch');
      const errorMessage = isNetworkError 
        ? 'Unable to connect to the server. Please check your connection and try again.'
        : err.message || 'An unexpected error occurred while creating the task.';
      
      toast.error('Failed to create task', {
        description: errorMessage,
      });
    }
  };

  const handleUpdateTask = async (updatedTask) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/tasks/${updatedTask.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const taskFromServer = await response.json();
      setTasks(tasks.map(t => t.id === taskFromServer.id ? taskFromServer : t));
      setSelectedTask(taskFromServer);
      
      toast.success('Task updated successfully!');
    } catch (err) {
      console.error("Error updating task:", err);
      const isNetworkError = err.name === 'TypeError' || err.message.includes('fetch');
      const errorMessage = isNetworkError 
        ? 'Unable to connect to the server. Please check your connection and try again.'
        : err.message || 'An unexpected error occurred while updating the task.';
      
      toast.error('Failed to update task', {
        description: errorMessage,
      });
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACK_END_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.detail || errorData?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setTasks(tasks.filter(t => t.id !== id));
      if (selectedTask?.id === id) {
        setSelectedTask(null);
      }
      
      toast.success('Task deleted successfully!');
    } catch (err) {
      console.error("Error deleting task:", err);
      const isNetworkError = err.name === 'TypeError' || err.message.includes('fetch');
      const errorMessage = isNetworkError 
        ? 'Unable to connect to the server. Please check your connection and try again.'
        : err.message || 'An unexpected error occurred while deleting the task.';
      
      toast.error('Failed to delete task', {
        description: errorMessage,
      });
    }
  };

  const renderMainContent = () => {
    switch (selectedView) {
      case 'dashboard':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Dashboard</h2>
              <p className="text-gray-500 mb-8">Welcome to Agile TaskIQ Dashboard</p>
              
              {/* Status information */}
              <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-800 mb-4">System Status</h3>
                {loading && <div className="text-blue-600">Loading status...</div>}
                {error && <div className="text-red-600">Status Error: {error}</div>}
                {status && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">API Status:</span>
                      <span className={status.status === 'healthy' ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                        {status.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Message:</span>
                      <span className="text-gray-800">{status.message}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="text-gray-800">{status.version}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
            <div className="lg:w-[400px] w-full lg:overflow-auto">
              {tasksLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-blue-600">Loading tasks...</div>
                </div>
              ) : tasksError ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-red-600">Error: {tasksError}</div>
                </div>
              ) : (
                <TaskList 
                  tasks={tasks} 
                  selectedTask={selectedTask}
                  onSelectTask={setSelectedTask}
                  onCreateTask={handleCreateTask}
                />
              )}
            </div>
            <div className="flex-1 lg:sticky lg:top-0 lg:self-start lg:h-[calc(100vh-8rem)]">
              <TaskDetailsPanel 
                task={selectedTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>
        );
      case 'ai-tools':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">AI Tools</h2>
              <p className="text-gray-500">AI-powered task management tools coming soon</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">Settings</h2>
              <p className="text-gray-500">Application settings coming soon</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600">Welcome</h2>
              <p className="text-gray-500 mt-2">Select a view from the sidebar</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row">
      <Toaster />
      {/* Top Bar - Mobile only */}
      <TopBar onMenuToggle={handleMenuToggle} />
      
      {/* Sidebar */}
      <Sidebar 
        selectedView={selectedView}
        onSelectView={setSelectedView}
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <main className="flex-1 p-3 lg:p-6 lg:overflow-visible overflow-auto">
          <div className="container h-full">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
