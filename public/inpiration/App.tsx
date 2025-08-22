import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Homepage } from './components/Homepage';
import { EventDetail } from './components/EventDetail';
import { UserDashboard } from './components/UserDashboard';
import { CreateEvent } from './components/CreateEvent';
import { ResalePage } from './components/ResalePage';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleViewChange = (view: string, eventId?: string) => {
    // Mark if coming from Buy Now button
    if (view === 'event' && eventId) {
      sessionStorage.setItem('buyNowClicked', 'true');
    }
    
    setCurrentView(view);
    if (eventId) {
      setSelectedEventId(eventId);
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedEventId(null);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
      case 'browse':
        return <Homepage onViewChange={handleViewChange} />;
      case 'event':
        return selectedEventId ? (
          <EventDetail eventId={selectedEventId} onBack={handleBackToHome} />
        ) : (
          <Homepage onViewChange={handleViewChange} />
        );
      case 'dashboard':
        return <UserDashboard />;
      case 'create':
        return <CreateEvent />;
      case 'resale':
        return <ResalePage onViewChange={handleViewChange} />;
      case 'favorites':
        return <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">Favorite Events</h1>
            <p className="text-foreground-muted text-lg">Your liked events will appear here</p>
          </div>
        </div>;
      default:
        return <Homepage onViewChange={handleViewChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated background patterns - NO GREEN */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-chart-2 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000" />
        </div>
      </div>
      
      <Navigation activeView={currentView} onViewChange={handleViewChange} />
      {renderCurrentView()}
    </div>
  );
}