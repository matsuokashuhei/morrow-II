import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Steps } from '@/components/ui';

interface OnboardingStep {
  title: string;
  description: string;
  content: React.ReactNode;
  image?: string;
}

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const onboardingSteps: OnboardingStep[] = [
    {
      title: 'Welcome to Morrow',
      description: 'Your personal event countdown companion',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Morrow!
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Create memorable countdowns for life's most important moments. 
            From birthdays to holidays, never miss what matters most.
          </p>
        </div>
      ),
    },
    {
      title: 'Create Events',
      description: 'Easily add and manage your upcoming events',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">📅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Create Events
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Add your special dates with just a few taps. Set custom titles, 
            descriptions, and get beautiful countdown displays.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 text-left max-w-sm mx-auto">
            <div className="font-semibold text-gray-800">My Birthday</div>
            <div className="text-sm text-gray-600">March 15, 2024</div>
            <div className="text-orange-600 font-bold mt-2">45 days to go!</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Share & Connect',
      description: 'Share your excitement with friends and family',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">👥</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Share & Connect
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Share your countdowns with loved ones. Build anticipation together 
            and make every moment special.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47A3 3 0 1015 8z" />
              </svg>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="h-6 w-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M7.414 15.414a2 2 0 01-2.828-2.828l3-3a2 2 0 012.828 0 1 1 0 001.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 00-1.414-1.414l-1.5 1.5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real-time Updates',
      description: 'Watch your countdowns tick down in real-time',
      content: (
        <div className="text-center space-y-6">
          <div className="text-6xl mb-6">⏰</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real-time Updates
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Experience the excitement with live countdown timers. 
            Watch as each second brings you closer to your special moment.
          </p>
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-orange-800 font-semibold">Summer Vacation</div>
            <div className="text-2xl font-bold text-orange-600 mt-2">
              45d 12h 30m 15s
            </div>
          </div>
        </div>
      ),
    },
  ];

  const stepsConfig = onboardingSteps.map((step, index) => ({
    title: `Step ${index + 1}`,
    description: step.title,
  }));

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem('onboardingCompleted', 'true');
      navigate('/');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex flex-col">
      {/* Header */}
      <div className="w-full px-4 py-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-orange-600">Morrow</div>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSkip}
            className="text-gray-600"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="w-full px-4 mb-8">
        <div className="max-w-2xl mx-auto">
          <Steps steps={stepsConfig} currentStep={currentStep} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center py-12 px-8">
            {onboardingSteps[currentStep].content}
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full px-4 py-8">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="min-w-24"
          >
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            {currentStep + 1} of {onboardingSteps.length}
          </div>
          
          <Button
            onClick={handleNext}
            className="min-w-24"
          >
            {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;