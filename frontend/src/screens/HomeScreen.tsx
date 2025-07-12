const HomeScreen = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Morrow!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Event Countdown Sharing App
        </p>
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Create, manage, and share your upcoming events with friends and family.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-orange-600 text-3xl mb-4">📅</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                イベント作成
              </h3>
              <p className="text-gray-600">
                大切な日程を簡単に登録してカウントダウンを開始
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-orange-600 text-3xl mb-4">⏰</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                リアルタイム表示
              </h3>
              <p className="text-gray-600">
                残り時間を美しくリアルタイムでカウントダウン
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-orange-600 text-3xl mb-4">👥</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                友達と共有
              </h3>
              <p className="text-gray-600">
                友人や家族と一緒にイベントを楽しみに待つ
              </p>
            </div>
          </div>

          <div className="mt-12">
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
              今すぐ始める
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
