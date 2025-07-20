import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ROUTES } from '../constants/routes';
import { OnboardingStep } from '../types/screens';

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'ようこそ',
    description:
      'Morrowへイベントのカウントダウン共有アプリです。大切な日を友達や家族と一緒に楽しみに待ちましょう。',
    icon: '🎉',
  },
  {
    id: 2,
    title: '機能紹介',
    description:
      'イベント作成、カウントダウン表示、共有機能など、楽しい機能をご紹介します。大切な予定やイベントを簡単に登録できます。',
    icon: '📅',
  },
  {
    id: 3,
    title: '利用方法',
    description:
      '簡単なステップでイベントを作成し、リアルタイムで残り時間を表示します。日、時間、分、秒まで正確にカウントダウンします。',
    icon: '⏰',
  },
  {
    id: 4,
    title: '準備完了',
    description:
      'さあ、はじめましょう！作成したイベントを友人や家族と共有できます。みんなで一緒に楽しい瞬間を待ちましょう。',
    icon: '👥',
  },
];

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding and navigate to home
      localStorage.setItem('hasSeenOnboarding', 'true');
      navigate(ROUTES.HOME);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    navigate(ROUTES.HOME);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Progress indicator */}
        <div className="mb-8">
          <div
            data-testid="progress-bar"
            className="flex justify-center space-x-2 mb-4"
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemax={onboardingSteps.length}
          >
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-orange-600' : 'bg-orange-200'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-gray-600 text-sm">
            {currentStep + 1} / {onboardingSteps.length}
          </p>
        </div>

        {/* Step content */}
        <Card padding="lg" className="text-center mb-8">
          <div className="text-6xl mb-6">{step.icon}</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {step.title}
          </h1>
          <p className="text-gray-600 leading-relaxed mb-6">
            {step.description}
          </p>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            data-testid="skip-btn"
            variant="secondary"
            size="md"
            onClick={handleSkip}
            className="text-gray-600"
            tabIndex={1}
          >
            スキップ
          </Button>

          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                data-testid="prev-btn"
                variant="secondary"
                size="md"
                onClick={handlePrevious}
                tabIndex={2}
              >
                戻る
              </Button>
            )}
            <Button
              data-testid={currentStep === onboardingSteps.length - 1 ? "start-btn" : "next-btn"}
              variant="primary"
              size="md"
              onClick={handleNext}
              tabIndex={3}
            >
              {currentStep === onboardingSteps.length - 1 ? '始めましょう' : '次へ'}
            </Button>
          </div>
        </div>

        {/* Navigation links for tests */}
        <div className="mt-8 text-center">
          <Link
            to={ROUTES.EVENTS}
            data-testid="events-link"
            className="inline-block px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
          >
            イベント
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
