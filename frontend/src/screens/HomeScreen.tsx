import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '@/components/ui';

const HomeScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    if (!onboardingCompleted) {
      navigate('/onboarding');
    }
  }, [navigate]);

  const features = [
    {
      icon: '📅',
      title: 'イベント作成',
      description: '大切な日程を簡単に登録してカウントダウンを開始',
    },
    {
      icon: '⏰',
      title: 'リアルタイム表示',
      description: '残り時間を美しくリアルタイムでカウントダウン',
    },
    {
      icon: '👥',
      title: '友達と共有',
      description: '友人や家族と一緒にイベントを楽しみに待つ',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Welcome to Morrow!
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
              Event Countdown Sharing App
            </p>
            <p className="text-lg sm:text-xl mb-12 text-orange-50 max-w-2xl mx-auto leading-relaxed">
              Create, manage, and share your upcoming events with friends and
              family. Make every moment count with beautiful countdown timers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-orange-50 w-full sm:w-auto"
              >
                今すぐ始める
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 w-full sm:w-auto"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              すべての大切な瞬間を
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Morrowで特別な日を管理し、友達や家族と一緒にその瞬間を楽しみに待ちましょう
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <div className="text-4xl sm:text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-50 py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to start counting?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Morrow to make their special moments unforgettable.
          </p>
          <Button size="lg" className="w-full sm:w-auto">
            Create Your First Event
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '10K+', label: 'Active Users' },
              { number: '50K+', label: 'Events Created' },
              { number: '1M+', label: 'Countdowns Shared' },
              { number: '99%', label: 'User Satisfaction' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;
