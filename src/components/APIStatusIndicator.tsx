'use client';

import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle, Loader2, AlertTriangle } from 'lucide-react';
import type { ApiProvider } from '@/types';

interface APIStatusIndicatorProps {
  currentApi?: ApiProvider | null;
  wasFallback?: boolean;
  geminiStatus?: 'active' | 'inactive' | 'error' | 'loading';
  claudeStatus?: 'active' | 'inactive' | 'error' | 'loading';
  showDetails?: boolean;
}

export function APIStatusIndicator({
  currentApi,
  wasFallback = false,
  geminiStatus = 'inactive',
  claudeStatus = 'inactive',
  showDetails = false,
}: APIStatusIndicatorProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="w-3 h-3 text-green-500" />;
      case 'error':
        return <XCircle className="w-3 h-3 text-red-500" />;
      case 'loading':
        return <Loader2 className="w-3 h-3 animate-spin text-yellow-500" />;
      default:
        return <AlertCircle className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 border-green-500/30';
      case 'error':
        return 'bg-red-500/10 text-red-700 border-red-500/30';
      case 'loading':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/30';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!showDetails) {
    return (
      <div className="flex items-center gap-2">
        {currentApi && (
          <>
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {currentApi === 'gemini' ? 'Gemini API' : 'Claude API'}
            </Badge>
            {wasFallback && (
              <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-700 border-amber-500/30">
                <AlertTriangle className="w-3 h-3" />
                احتياطي
              </Badge>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Badge
        variant="outline"
        className={`gap-1 ${getStatusColor(geminiStatus)}`}
      >
        {getStatusIcon(geminiStatus)}
        Gemini
      </Badge>
      <Badge
        variant="outline"
        className={`gap-1 ${getStatusColor(claudeStatus)}`}
      >
        {getStatusIcon(claudeStatus)}
        Claude
      </Badge>
      {currentApi && (
        <span className="text-xs text-muted-foreground">
          (جاري الاستخدام: {currentApi === 'gemini' ? 'Gemini' : 'Claude'})
        </span>
      )}
    </div>
  );
}

export default APIStatusIndicator;
