import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/contexts/authContext';
import { ContactsProvider, useContacts } from '@/contexts/contactsContext.tsx';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// 联系人卡片组件
function ContactCard({ 
  contact, 
  onCallClick 
}: { 
  contact: any, 
  onCallClick: (contactId: string) => void 
}) {
  // 确定状态显示的颜色和文本
  const getStatusInfo = () => {
    switch (contact.status) {
      case 'online':
        return { color: 'bg-green-500', text: '在线' };
      case 'busy':
        return { color: 'bg-red-500', text: '忙碌' };
      case 'offline':
      default:
        return { color: 'bg-gray-300', text: '离线' };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <div className="flex items-center p-3 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group">
      <div className="relative mr-4">
        <img 
          src={contact.avatar} 
          alt={contact.username}
          className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full ${statusInfo.color} border-2 border-white`}></span>
      </div>
      
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{contact.username}</h3>
        <p className="text-sm text-gray-500">{statusInfo.text}</p>
      </div>
      
      <button 
        onClick={() => onCallClick(contact.id)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="开始视频通话"
      >
        <i class="fa-solid fa-video"></i>
      </button>
    </div>
  );
}

// 添加联系人对话框
function AddContactDialog({ 
  isOpen, 
  onClose, 
  onAddContact 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onAddContact: (username: string) => Promise<void> 
}) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    setIsLoading(true);
    try {
      await onAddContact(username.trim());
      setUsername('');
      onClose();
      toast.success('联系人添加成功');
    } catch (error) {
      console.error('Failed to add contact:', error);
      toast.error(error instanceof Error ? error.message : '添加联系人失败');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">添加联系人</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <i class="fa-solid fa-times"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              用户名
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa-regular fa-user text-gray-400"></i>
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="输入联系人用户名"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-grow px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              disabled={isLoading}
            >
              {isLoading ? (
                <i class="fa-solid fa-spinner fa-spin"></i>
              ) : (
                '添加'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Contacts() {
  const { currentUser, logout } = useContext(AuthContext);
  const { contacts, addContact, searchContacts, removeContact } = useContacts();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  
  // 处理搜索
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredContacts(searchContacts(query));
  };
  
  // 开始视频通话
  const startVideoCall = (contactId: string) => {
    navigate(`/call/${contactId}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">联系人</h1>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={logout}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="退出登录"
            >
              <i class="fa-solid fa-sign-out-alt"></i>
            </button>
            
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
              aria-label="添加联系人"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
        
        {/* 搜索框 */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i class="fa-solid fa-search text-gray-400"></i>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="搜索联系人..."
            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </header>
      
      {/* 联系人列表 */}
      <main className="flex-grow p-4">
        {filteredContacts.length > 0 ? (
          <div className="space-y-1">
            {filteredContacts.map(contact => (
              <ContactCard 
                key={contact.id} 
                contact={contact} 
                onCallClick={startVideoCall} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <i class="fa-solid fa-user-friends text-blue-400 text-3xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">暂无联系人</h3>
            <p className="text-gray-500 mb-6 max-w-md">添加您的第一个联系人开始视频聊天</p>
            <button 
              onClick={() => setIsAddDialogOpen(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              添加联系人
            </button>
          </div>
        )}
      </main>
      
      {/* 添加联系人对话框 */}
      <AddContactDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)}
        onAddContact={addContact}
      />
    </div>
  );
}

// 使用ContactsProvider包装组件
export function ContactsPage() {
  return (
    <ContactsProvider>
      <Contacts />
    </ContactsProvider>
  );
}