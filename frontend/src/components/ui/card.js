import React from 'react';
import { combineClasses, variants } from '../lib/theme';

// Base Card Component
export const Card = React.forwardRef(({ 
  className = '', 
  variant = 'default',
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses(variants.card[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header
export const CardHeader = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

// Card Title
export const CardTitle = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  return (
    <h3
      ref={ref}
      className={combineClasses(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

// Card Description
export const CardDescription = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  return (
    <p
      ref={ref}
      className={combineClasses('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

// Card Content
export const CardContent = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

// Card Footer
export const CardFooter = React.forwardRef(({ 
  className = '', 
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={combineClasses('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  );
});

CardFooter.displayName = 'CardFooter';

export default {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};