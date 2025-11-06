import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/card';
import { ThemeToggle } from './ThemeProvider';
import { getColorClasses, getStatusClasses } from '../lib/theme';

export const ThemeDemo = () => {
  const priorities = ['low', 'medium', 'high', 'critical'];
  const statuses = ['todo', 'in-progress', 'review', 'done', 'blocked'];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              SynapseSquad Custom Theme
            </h1>
            <p className="text-muted-foreground text-lg">
              A comprehensive design system for modern task management
            </p>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle>Color Palette</CardTitle>
            <CardDescription>
              Core theme colors used throughout the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-16 w-full bg-primary rounded-lg"></div>
                <p className="text-sm font-medium">Primary</p>
                <p className="text-xs text-muted-foreground">Main brand color</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full bg-accent rounded-lg"></div>
                <p className="text-sm font-medium">Accent</p>
                <p className="text-xs text-muted-foreground">Interactive elements</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full bg-secondary rounded-lg"></div>
                <p className="text-sm font-medium">Secondary</p>
                <p className="text-xs text-muted-foreground">Supporting color</p>
              </div>
              <div className="space-y-2">
                <div className="h-16 w-full bg-destructive rounded-lg"></div>
                <p className="text-sm font-medium">Destructive</p>
                <p className="text-xs text-muted-foreground">Error states</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Consistent text styles for excellent readability
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Heading 1</h1>
              <h2 className="text-3xl font-semibold mb-2">Heading 2</h2>
              <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
              <h4 className="text-xl font-semibold mb-2">Heading 4</h4>
            </div>
            <div>
              <p className="text-base mb-2">
                This is regular body text. It's designed for optimal readability
                across all devices and screen sizes.
              </p>
              <p className="text-sm text-muted-foreground">
                This is smaller text, often used for secondary information and descriptions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
            <CardDescription>
              Various button styles for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Button className="w-full">Primary</Button>
                <p className="text-xs text-muted-foreground">Main actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="secondary" className="w-full">Secondary</Button>
                <p className="text-xs text-muted-foreground">Supporting actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">Outline</Button>
                <p className="text-xs text-muted-foreground">Alternative style</p>
              </div>
              <div className="space-y-2">
                <Button variant="ghost" className="w-full">Ghost</Button>
                <p className="text-xs text-muted-foreground">Subtle actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="destructive" className="w-full">Destructive</Button>
                <p className="text-xs text-muted-foreground">Delete actions</p>
              </div>
              <div className="space-y-2">
                <Button variant="link" className="w-full">Link</Button>
                <p className="text-xs text-muted-foreground">Text links</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Priority Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Indicators</CardTitle>
            <CardDescription>
              Visual indicators for task priorities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {priorities.map(priority => {
                const colors = getColorClasses(priority);
                return (
                  <div key={priority} className="text-center space-y-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {priority} priority
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Badges */}
        <Card>
          <CardHeader>
            <CardTitle>Status Indicators</CardTitle>
            <CardDescription>
              Visual indicators for task statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {statuses.map(status => {
                const colors = getStatusClasses(status);
                return (
                  <div key={status} className="text-center space-y-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${colors.bg} ${colors.text} ${colors.border} border`}>
                      <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                      {status.replace('-', ' ')}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {status.replace('-', ' ')} status
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Card Variants */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Standard card style</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This is the default card variant with standard styling.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Enhanced shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This card has an elevated appearance with enhanced shadows.
              </p>
            </CardContent>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass Card</CardTitle>
              <CardDescription>Glassmorphism effect</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                This card features a modern glassmorphism effect.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle>Interactive Elements</CardTitle>
            <CardDescription>
              Hover and focus states for better user experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Badges</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium">Links</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-accent hover:text-accent/80 transition-colors">
                    Primary link with hover effect
                  </a>
                  <a href="#" className="block text-muted-foreground hover:text-foreground transition-colors">
                    Muted link with hover effect
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animation Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Animations</CardTitle>
            <CardDescription>
              Smooth animations enhance the user experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                className="hover-lift"
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                Hover Lift
              </Button>
              <Button 
                className="hover-glow"
                variant="outline"
              >
                Hover Glow
              </Button>
              <div className="loading-spinner w-8 h-8 mx-auto"></div>
              <div className="loading-skeleton w-full h-8 rounded"></div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-muted-foreground">
          <p>SynapseSquad Theme System - Built with Tailwind CSS & Shadcn/UI</p>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo;