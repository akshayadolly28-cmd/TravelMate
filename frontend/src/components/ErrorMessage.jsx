import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message = 'Something went wrong while connecting to the server.', onRetry }) {
  return (
    <div className="error-alert-card">
      <div className="error-alert-icon">
        <AlertCircle size={22} />
      </div>
      <div className="error-alert-body">
        <h4 className="error-alert-title">Unable to Load Data</h4>
        <p className="error-alert-text">{message}</p>
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-error-retry">
            <RefreshCw size={14} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
