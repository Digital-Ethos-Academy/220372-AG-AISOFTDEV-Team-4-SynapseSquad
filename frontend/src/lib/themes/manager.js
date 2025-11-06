/**
 * Theme Manager for SynapseSquad
 * Handles theme switching and persistence
 */

export const themes = {
  default: 'SynapseSquad Default',
  ocean: 'Ocean Depth',
  forest: 'Forest Growth',
  sunset: 'Sunset Warmth',
  purple: 'Creative Purple',
};

export const setThemeVariant = (variant) => {
  const root = document.documentElement;
  
  // Remove existing theme variants
  Object.keys(themes).forEach(theme => {
    root.removeAttribute(`data-theme`);
  });
  
  // Apply new theme variant if not default
  if (variant !== 'default') {
    root.setAttribute('data-theme', variant);
  }
  
  // Save to localStorage
  localStorage.setItem('synapseSquad-theme-variant', variant);
};

export const getThemeVariant = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('synapseSquad-theme-variant') || 'default';
  }
  return 'default';
};

export const initializeThemeVariant = () => {
  const savedVariant = getThemeVariant();
  setThemeVariant(savedVariant);
  return savedVariant;
};

// Theme utilities for dynamic styling
export const getThemeColors = () => {
  if (typeof window === 'undefined') return {};
  
  const style = getComputedStyle(document.documentElement);
  
  return {
    background: style.getPropertyValue('--background').trim(),
    foreground: style.getPropertyValue('--foreground').trim(),
    primary: style.getPropertyValue('--primary').trim(),
    accent: style.getPropertyValue('--accent').trim(),
    secondary: style.getPropertyValue('--secondary').trim(),
    muted: style.getPropertyValue('--muted').trim(),
    destructive: style.getPropertyValue('--destructive').trim(),
  };
};

export default {
  themes,
  setThemeVariant,
  getThemeVariant,
  initializeThemeVariant,
  getThemeColors,
};