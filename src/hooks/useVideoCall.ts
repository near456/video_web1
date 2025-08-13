import { useState, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { useNavigate } from 'react-router-dom';

interface UseVideoCallProps {
  contactId?: string;
  onCallEnd?: () => void;
}

interface CallStatus {
  state: 'idle' | 'connecting' | 'connected' | 'error';
  message?: string;
}

export function useVideoCall({ contactId, onCallEnd }: UseVideoCallProps) {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>({ state: 'idle' });
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [peer, setPeer] = useState<Peer.Instance | null>(null);
  const navigate = useNavigate();
  
  // 获取本地媒体流（摄像头和麦克风）
  const getLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      setCallStatus({ 
        state: 'error', 
        message: '无法访问摄像头或麦克风。请确保已授予权限。' 
      });
      return null;
    }
  }, []);
  
  // 开始视频通话
  const startCall = useCallback(async () => {
    if (!contactId) return;
    
    setCallStatus({ state: 'connecting', message: '正在连接...' });
    
    const stream = await getLocalStream();
    if (!stream) return;
    
    // 创建新的Peer实例（作为呼叫方）
    const newPeer = new Peer({
      initiator: true,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });
    
    setPeer(newPeer);
    
    // 模拟P2P连接过程
    setTimeout(() => {
      setCallStatus({ state: 'connected', message: '通话已连接' });
      
      // 模拟远程流
      const mockRemoteStream = new MediaStream();
      setRemoteStream(mockRemoteStream);
    }, 2000);
    
    // 处理错误
    newPeer.on('error', (error) => {
      console.error('Peer error:', error);
      setCallStatus({ state: 'error', message: error.message });
    });
    
    // 处理流
    newPeer.on('stream', (remoteStream) => {
      setRemoteStream(remoteStream);
    });
    
    // 处理关闭
    newPeer.on('close', () => {
      if (onCallEnd) onCallEnd();
      cleanupCall();
    });
    
  }, [contactId, getLocalStream, onCallEnd]);
  
  // 结束通话
  const endCall = useCallback(() => {
    if (peer) {
      peer.destroy();
    }
    cleanupCall();
    if (onCallEnd) onCallEnd();
    navigate('/contacts');
  }, [peer, onCallEnd, navigate]);
  
  // 清理通话资源
  const cleanupCall = useCallback(() => {
    setCallStatus({ state: 'idle' });
    
    // 停止本地流
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // 停止远程流
    if (remoteStream) {
      remoteStream.getTracks().forEach(track => track.stop());
      setRemoteStream(null);
    }
    
    setPeer(null);
    setIsMuted(false);
    setIsCameraOff(false);
  }, [localStream, remoteStream]);
  
  // 切换静音状态
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  }, [isMuted, localStream]);
  
  // 切换摄像头状态
  const toggleCamera = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = isCameraOff;
      });
      setIsCameraOff(!isCameraOff);
    }
  }, [isCameraOff, localStream]);
  
  // 组件挂载时开始通话
  useEffect(() => {
    if (contactId) {
      startCall();
    }
    
    // 组件卸载时清理
    return () => {
      if (peer) {
        peer.destroy();
      }
      cleanupCall();
    };
  }, [contactId, startCall, peer, cleanupCall]);
  
  return {
    localStream,
    remoteStream,
    callStatus,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    endCall,
    startCall
  };
}