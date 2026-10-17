import { Compass } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading adventures...', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="full-page-loader">
        <div className="spinner-icon-animation">
          <Compass size={40} className="animate-spin text-teal" />
        </div>
        <p className="loader-text">{message}</p>
      </div>
    );
  }

  return (
    <div className="component-loader">
      <Compass size={28} className="animate-spin text-teal" />
      <span className="loader-inline-text">{message}</span>
    </div>
  );
}
