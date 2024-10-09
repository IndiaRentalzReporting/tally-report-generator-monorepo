import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC<{ className?: string }> = ({
  className = ''
}) => (
  <Loader2 className={`w-8 h-8 animate-spin invert-0 mx-auto ${className}`} />
);