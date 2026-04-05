/**
 * Developer Console Component
 * 
 * Hidden developer console for inspecting system errors.
 * Toggle with Cmd/Ctrl + Shift + E
 */

import { useEffect, useState } from 'react';
import { useErrorTracking } from '../../hooks/useErrorTracking';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  X, 
  Download, 
  Trash2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import type { ErrorLevel, SystemError } from '../../types/error.types';

export function DeveloperConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedError, setSelectedError] = useState<SystemError | null>(null);
  const [filterLevel, setFilterLevel] = useState<ErrorLevel | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { errors, stats, clearErrors, exportErrors } = useErrorTracking('DeveloperConsole');

  // Toggle console with Cmd/Ctrl + Shift + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'E') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = () => {
    const dataStr = exportErrors();
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sostudy-errors-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyError = (error: SystemError) => {
    const errorText = JSON.stringify(error, null, 2);
    navigator.clipboard.writeText(errorText);
    setCopiedId(error.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredErrors = filterLevel === 'all' 
    ? errors 
    : errors.filter((e) => e.level === filterLevel);

  const getLevelIcon = (level: ErrorLevel) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getLevelColor = (level: ErrorLevel) => {
    switch (level) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl h-[80vh] bg-[#0A0A0A] rounded-[24px] border border-white/[0.08] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-white">
              Developer Console
            </h2>
            <div className="flex items-center gap-3 text-sm">
              <span className="text-white/60">
                Total: <span className="text-white font-medium">{stats.total}</span>
              </span>
              <span className="text-red-500/60">
                Errors: <span className="text-red-500 font-medium">{stats.errors}</span>
              </span>
              <span className="text-yellow-500/60">
                Warnings: <span className="text-yellow-500 font-medium">{stats.warnings}</span>
              </span>
              <span className="text-blue-500/60">
                Info: <span className="text-blue-500 font-medium">{stats.info}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value as ErrorLevel | 'all')}
              className="px-3 py-1.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">All Levels</option>
              <option value="error">Errors</option>
              <option value="warning">Warnings</option>
              <option value="info">Info</option>
            </select>

            {/* Export */}
            <button
              onClick={handleExport}
              className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
              title="Export Errors"
            >
              <Download className="w-4 h-4 text-white/60" />
            </button>

            {/* Clear */}
            <button
              onClick={clearErrors}
              className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
              title="Clear All Errors"
            >
              <Trash2 className="w-4 h-4 text-white/60" />
            </button>

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Error List */}
          <div className="w-1/2 border-r border-white/[0.08] overflow-y-auto">
            {filteredErrors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/40">
                <Info className="w-8 h-8 mb-2" />
                <p>No errors logged</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {filteredErrors.map((error) => (
                  <button
                    key={error.id}
                    onClick={() => setSelectedError(error)}
                    className={`w-full text-left px-4 py-3 hover:bg-white/[0.03] transition-colors ${
                      selectedError?.id === error.id ? 'bg-white/[0.05]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">{getLevelIcon(error.level)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${getLevelColor(error.level)}`}>
                            {error.level.toUpperCase()}
                          </span>
                          <span className="text-xs text-white/40">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-white mt-1 truncate">
                          {error.message}
                        </p>
                        {error.context?.component && (
                          <p className="text-xs text-white/40 mt-1">
                            {error.context.component}
                            {error.context.action && ` › ${error.context.action}`}
                          </p>
                        )}
                      </div>
                      {selectedError?.id === error.id ? (
                        <ChevronDown className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-white/40 flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Details */}
          <div className="w-1/2 overflow-y-auto">
            {selectedError ? (
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getLevelIcon(selectedError.level)}
                    <h3 className={`text-lg font-medium ${getLevelColor(selectedError.level)}`}>
                      {selectedError.level.toUpperCase()}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleCopyError(selectedError)}
                    className="p-2 hover:bg-white/[0.05] rounded-lg transition-colors"
                    title="Copy Error"
                  >
                    {copiedId === selectedError.id ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/60" />
                    )}
                  </button>
                </div>

                {/* Message */}
                <div>
                  <h4 className="text-xs font-medium text-white/40 mb-2">MESSAGE</h4>
                  <p className="text-sm text-white">{selectedError.message}</p>
                </div>

                {/* Timestamp */}
                <div>
                  <h4 className="text-xs font-medium text-white/40 mb-2">TIMESTAMP</h4>
                  <p className="text-sm text-white">
                    {new Date(selectedError.timestamp).toLocaleString()}
                  </p>
                </div>

                {/* Context */}
                {selectedError.context && (
                  <div>
                    <h4 className="text-xs font-medium text-white/40 mb-2">CONTEXT</h4>
                    <pre className="text-xs text-white/80 bg-white/[0.03] rounded-lg p-4 overflow-x-auto">
                      {JSON.stringify(selectedError.context, null, 2)}
                    </pre>
                  </div>
                )}

                {/* Stack Trace */}
                {selectedError.stack && (
                  <div>
                    <h4 className="text-xs font-medium text-white/40 mb-2">STACK TRACE</h4>
                    <pre className="text-xs text-white/80 bg-white/[0.03] rounded-lg p-4 overflow-x-auto font-mono">
                      {selectedError.stack}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-white/40">
                <p>Select an error to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/[0.08] bg-white/[0.02]">
          <p className="text-xs text-white/40 text-center">
            Press <kbd className="px-2 py-1 bg-white/[0.05] rounded text-white/60">Cmd/Ctrl + Shift + E</kbd> to toggle console
          </p>
        </div>
      </div>
    </div>
  );
}
