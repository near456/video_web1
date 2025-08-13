import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查用户是否已登录，如果是则重定向到联系人页面
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (isAuthenticated) {
        navigate('/contacts');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-xl font-medium text-gray-600">加载中...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* 顶部导航 */}
      <header className="py-6 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <i class="fa-solid fa-video text-white text-xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">视频聊天</h1>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors"
            >
              登录
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              免费注册
            </button>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            简单、安全、<span className="text-blue-600">免费</span>的视频聊天
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            与朋友和家人保持联系，享受高清视频通话，无需担心费用问题。开源技术，保护您的隐私。
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-lg bg-blue-600 text-white font-bold text-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              立即开始使用
            </button>
            <button
              onClick={() => {}}
              className="px-8 py-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-play-circle"></i> 观看演示
            </button>
          </div>
          
          {/* 特点部分 */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <i class="fa-solid fa-video text-blue-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">高清视频</h3>
              <p className="text-gray-600">享受高质量的视频通话体验，清晰看到每一个细节。</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <i class="fa-solid fa-lock text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">安全加密</h3>
              <p className="text-gray-600">端到端加密保护您的通话内容，确保隐私安全。</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <i class="fa-solid fa-users text-purple-600 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">多人通话</h3>
              <p className="text-gray-600">支持多人同时视频聊天，与朋友和家人一起分享快乐时光。</p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 视频聊天 - 开源免费的视频通话软件</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-600 transition-colors">关于我们</a>
            <a href="#" className="hover:text-blue-600 transition-colors">隐私政策</a>
            <a href="#" className="hover:text-blue-600 transition-colors">使用条款</a>
            <a href="#" className="hover:text-blue-600 transition-colors">开源代码</a>
          </div>
        </div>
      </footer>
    </div>
  );
}