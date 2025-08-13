import { createContext, useContext, ReactNode, useState } from 'react';

// Define contact type
export type Contact = {
  id: string;
  username: string;
  avatar: string;
  status: 'online' | 'busy' | 'offline';
};

// Define context type
type ContactsContextType = {
  contacts: Contact[];
  addContact: (username: string) => Promise<void>;
  searchContacts: (query: string) => Contact[];
  getContactById: (id: string) => Contact | undefined;
  removeContact: (id: string) => void;
};

// Create context with default value
const ContactsContext = createContext<ContactsContextType | undefined>(undefined);

// Create provider component
export function ContactsProvider({ children }: { children: ReactNode }) {
  // Mock contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      username: '张三',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20male%2C%20portrait&sign=7bdfa713354bd736349190714653ce22',
      status: 'online'
    },
    {
      id: '2',
      username: '李四',
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20female%2C%20portrait&sign=ebae3c8d5c94a3c82292222f6c814178',
      status: 'busy'
    }
  ]);

  // Mock add contact function
  const addContact = async (username: string): Promise<void> => {
    // In a real implementation, this would call an API
    const newContact: Contact = {
      id: Date.now().toString(),
      username,
      avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%2C%20random%2C%20portrait&sign=7f1dbdf7d1b60be8e8aa9725ebcdfbd7',
      status: 'online'
    };
    
    setContacts(prev => [...prev, newContact]);
  };

  // Search contacts by username
  const searchContacts = (query: string): Contact[] => {
    if (!query) return contacts;
    return contacts.filter(contact => 
      contact.username.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Get contact by ID
  const getContactById = (id: string): Contact | undefined => {
    return contacts.find(contact => contact.id === id);
  };

  // Remove contact
  const removeContact = (id: string): void => {
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

  const value: ContactsContextType = {
    contacts,
    addContact,
    searchContacts,
    getContactById,
    removeContact
  };

  return <ContactsContext.Provider value={value}>{children}</ContactsContext.Provider>;
}

// Custom hook to use the contacts context
export function useContacts() {
  const context = useContext(ContactsContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactsProvider');
  }
  return context;
}