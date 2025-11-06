import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { themes, setThemeVariant, getThemeVariant } from '../lib/themes/manager';

export const ThemeSelector = ({ className = '' }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCurrentTheme(getThemeVariant());
  }, []);

  const handleThemeChange = (themeKey) => {
    setThemeVariant(themeKey);
    setCurrentTheme(themeKey);
    setIsOpen(false);
  };

  const themePreview = {
    default: {
      primary: '#030213',
      accent: '#2a67e0',
      background: '#ffffff',
    },
    ocean: {
      primary: '#0c4a6e',
      accent: '#0891b2',
      background: '#f0f9ff',
    },
    forest: {
      primary: '#365314',
      accent: '#16a34a',
      background: '#f7fcf0',
    },
    sunset: {
      primary: '#7c2d12',
      accent: '#ea580c',
      background: '#fef7ed',
    },
    purple: {
      primary: '#581c87',
      accent: '#a855f7',
      background: '#faf5ff',
    },
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <div className="flex gap-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: themePreview[currentTheme]?.primary }}
            />
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: themePreview[currentTheme]?.accent }}
            />
          </div>
          {themes[currentTheme]}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <Card className="absolute top-full mt-2 w-80 z-50 shadow-lg">
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">
                  Choose Theme
                </h3>
                
                {Object.entries(themes).map(([key, name]) => {
                  const preview = themePreview[key];
                  const isSelected = currentTheme === key;
                  
                  return (
                    <button
                      key={key}
                      onClick={() => handleThemeChange(key)}
                      className={`
                        w-full p-3 rounded-lg border-2 transition-all text-left
                        hover:border-accent hover:shadow-sm
                        ${isSelected 
                          ? 'border-accent bg-accent/5 shadow-sm' 
                          : 'border-border'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-md flex items-center justify-center"
                            style={{ backgroundColor: preview.background }}
                          >
                            <div className="flex gap-1">
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: preview.primary }}
                              />
                              <div 
                                className="w-2 h-2 rounded-full" 
                                style={{ backgroundColor: preview.accent }}
                              />
                            </div>
                          </div>
                          
                          <div>
                            <div className="font-medium text-sm">{name}</div>
                            <div className="text-xs text-muted-foreground">
                              {key === 'default' && 'Original SynapseSquad theme'}
                              {key === 'ocean' && 'Deep blue & aqua tones'}
                              {key === 'forest' && 'Natural green palette'}
                              {key === 'sunset' && 'Warm orange & red hues'}
                              {key === 'purple' && 'Creative purple shades'}
                            </div>
                          </div>
                        </div>
                        
                        {isSelected && (
                          <Badge variant="secondary" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;