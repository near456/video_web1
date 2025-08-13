import { useParams, useNavigate } from 'react-router-dom';
import { useVideoCall } from '@/hooks/useVideoCall';
import { useContacts } from '@/contexts/contactsContext.tsx';
import { useEffect } from 'react';

export default function VideoCall() {
  const { contactId } = useParams<{ contactId: string }>();
  const { getContactById } = useContacts();
  const navigate = useNavigate();
  const contact = contactId ? getContactById(contactId) : undefined;
  
  const {
    localStream,
    remoteStream,
    callStatus,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    endCall
  } = useVideoCall({
    contactId,
    onCallEnd: () => navigate('/contacts')
  });
  
  // 如果联系人不存在，返回到联系人页面
  useEffect(() => {
    if (contactId && !contact) {
      navigate('/contacts');
    }
  }, [contactId, contact, navigate]);
  
  // 渲染通话状态
  const renderCallStatus = () => {
    switch (callStatus.state) {
      case 'connecting':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">{callStatus.message || '正在连接...'}</h3>
            <p className="text-gray-500 mb-8">正在尝试与 {contact?.username || '联系人'} 建立连接</p>
            <button 
              onClick={endCall}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
            >
              取消通话
            </button>
          </div>
        );
        
      case 'error':
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <i class="fa-solid fa-exclamation-triangle text-red-500 text-3xl"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">通话失败</h3>
            <p className="text-gray-500 mb-8">{callStatus.message || '无法建立通话连接'}</p>
            <button 
              onClick={endCall}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              返回联系人
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* 通话头部信息 */}
      <header className="p-4 flex items-center justify-between bg-gray-900">
        <div className="flex items-center">
          {contact && (
            <>
              <img 
                src={contact.avatar} 
                alt={contact.username}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h1 className="font-medium">{contact.username}</h1>
                <p className="text-xs text-gray-400">正在视频通话中...</p>
              </div>
            </>
          )}
        </div>
        
        <button 
          onClick={endCall}
          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
          aria-label="结束通话"
        >
          <i class="fa-solid fa-phone-slash"></i>
        </button>
      </header>
      
      {/* 视频区域 */}
      <main className="flex-grow relative overflow-hidden">
        {callStatus.state === 'connected' ? (
          <>
            {/* 远程视频（大窗口） */}
            <div className="absolute inset-0 bg-black">
              {remoteStream ? (
                <video
                  srcObject={remoteStream}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <i class="fa-solid fa-user-circle text-6xl text-gray-600"></i>
                </div>
              )}
            </div>
            
            {/* 本地视频（小窗口） */}
            {localStream && (
              <div className="absolute bottom-4 right-4 w-40 h-56 rounded-lg overflow-hidden border-2 border-white shadow-lg z-10">
                <video
                  srcObject={localStream}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scaleX(-1)" // 镜像效果
                />
              </div>
            )}
          </>
        ) : (
          renderCallStatus()
        )}
      </main>
      
      {/* 通话控制按钮 */}
      {callStatus.state === 'connected' && (
        <footer className="p-4 bg-gray-900 flex justify-center gap-6">
          <button 
            onClick={toggleMute}
            className={`p-3 rounded-full transition-colors ${isMuted ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            aria-label={isMuted ? "取消静音" : "静音"}
          >
            {isMuted ? (
              <i class="fa-solid fa-microphone-slash"></i>
            ) : (
              <i class="fa-solid fa-microphone"></i>
            )}
          </button>
          
          <button 
            onClick={toggleCamera}
            className={`p-3 rounded-full transition-colors ${isCameraOff ? 'bg-red-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            aria-label={isCameraOff ? "开启摄像头" : "关闭摄像头"}
          >
            {isCameraOff ? (
              <i class="fa-solid fa-video-slash"></i>
            ) : (
              <i class="fa-solid fa-video"></i>
            )}
          </button>
          
          <button 
            onClick={() => {}}
            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            aria-label="切换全屏"
          >
            <i class="fa-solid fa-expand"></i>
          </button>
        </footer>
      )}
    </div>
  );
}