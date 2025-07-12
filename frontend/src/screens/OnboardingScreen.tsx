import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: 'イベントを作成',
    description:
      '大切な予定やイベントを簡単に登録できます。誕生日、記念日、旅行など、楽しみにしている日を追加しましょう。',
    icon: '📅',
  },
  {
    id: 2,
    title: 'カウントダウンを楽しむ',
    description:
      'リアルタイムで残り時間を表示します。日、時間、分、秒まで正確にカウントダウンして、ワクワク感を高めます。',
    icon: '⏰',
  },
  {
    id: 3,
    title: '友達と共有',
    description:
      '作成したイベントを友人や家族と共有できます。みんなで一緒に楽しい瞬間を待ちましょう。',
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
      navigate('/');
    }
  };

  const handleSkip = () => {
    navigate('/');
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
          <div className="flex justify-center space-x-2 mb-4">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {step.title}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {step.description}
          </p>
        </Card>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="secondary"
            size="md"
            onClick={handleSkip}
            className="text-gray-600"
          >
            スキップ
          </Button>

          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button variant="secondary" size="md" onClick={handlePrevious}>
                戻る
              </Button>
            )}
            <Button variant="primary" size="md" onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? '始める' : '次へ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
