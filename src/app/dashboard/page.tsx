'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Paperclip, Smile, LogOut, CheckCheck, Edit3, MessageSquare, Trash2, EyeOff, Pin, Pencil, X, Eye } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  content: string;
  time: string;
  isMe: boolean;
  type?: 'text' | 'image' | 'video' | 'file';
  fileUrl?: string;
  isDeleted?: boolean;
  isEdited?: boolean;
  isPinned?: boolean;
  viewLimit?: number;
  viewCount?: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'whiteboard'>('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const [contextMenu, setContextMenu] = useState<{ id: string, x: number, y: number, isMe: boolean } | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);

  // File Upload State
  const [pendingFile, setPendingFile] = useState<{ url: string, type: string, limit: number } | null>(null);

  const [fullscreenMedia, setFullscreenMedia] = useState<Message | null>(null);

  useEffect(() => {
    // Screenshot Protection
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || (e.ctrlKey && e.key === 'p') || (e.metaKey && e.shiftKey && e.key === 's') || (e.metaKey && e.shiftKey && e.key === '4') || (e.metaKey && e.shiftKey && e.key === '3')) {
        e.preventDefault();
        alert("Screenshots are disabled for privacy & security.");
        navigator.clipboard.writeText("Screenshots disabled by BanNotes Security.");
      }
    };
    
    const handleVisibility = () => {
      if (document.hidden) {
        document.body.style.filter = 'blur(25px)';
      } else {
        document.body.style.filter = 'none';
      }
    };

    const handleWindowBlur = () => {
      document.body.style.filter = 'blur(25px)';
      document.body.style.opacity = '0';
    };

    const handleWindowFocus = () => {
      document.body.style.filter = 'none';
      document.body.style.opacity = '1';
    };

    window.addEventListener('keyup', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    // Auto-Logout on Refresh / Tab Close
    const handleBeforeUnload = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Disable Right Click
    const handleContext = (e: MouseEvent) => {
      // Allow our custom right click, disable default
      e.preventDefault();
    };
    document.addEventListener('contextmenu', handleContext);

    return () => {
      window.removeEventListener('keyup', handleKeyDown);
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('contextmenu', handleContext);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) {
      router.push('/');
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const partner = localStorage.getItem('partner') || '';
    const room = user.role === 'admin' ? 'admin-dashboard' : [user.username, partner].sort().join('-');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    fetch(`${apiUrl}/api/chat/messages?role=${user.role}&room=${room}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map((msg: any) => ({
          ...msg,
          isMe: msg.sender === user.username
        }));
        setMessages(formatted);
      });

    const newSocket = io(apiUrl);
    newSocket.on('connect', () => newSocket.emit('join-chat', { userId: user.username, room }));

    newSocket.on('receive-message', (msg: any) => {
      setMessages(prev => [...prev, { ...msg, isMe: msg.sender === user.username }]);
    });

    newSocket.on('message-deleted', (messageId: string) => {
      setMessages(prev => prev.map(msg => {
        if (msg.id === messageId) {
          if (user.role === 'admin') return { ...msg, isDeleted: true };
          return { ...msg, isDeleted: true, content: '🚫 This message was deleted', type: 'text', fileUrl: undefined };
        }
        return msg;
      }));
    });

    newSocket.on('message-edited', ({ id, content }: { id: string, content: string }) => {
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, content, isEdited: true } : msg));
    });

    newSocket.on('message-pinned', (id: string) => {
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, isPinned: !msg.isPinned } : msg));
    });

    newSocket.on('media-viewed', ({ id, viewCount }: { id: string, viewCount: number }) => {
      setMessages(prev => prev.map(msg => msg.id === id ? { ...msg, viewCount } : msg));
    });

    newSocket.on('draw', (data: any) => drawOnCanvas(data.x0, data.y0, data.x1, data.y1, data.color));
    newSocket.on('clear-whiteboard', () => clearCanvas(false));

    setSocket(newSocket);
    return () => { newSocket.disconnect(); };
  }, [router]);

  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (activeTab === 'whiteboard') {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      fetch(`${apiUrl}/api/chat/whiteboard`)
        .then(res => res.json())
        .then(data => data.forEach((line: any) => drawOnCanvas(line.x0, line.y0, line.x1, line.y1, line.color)));
    }
  }, [messages, activeTab]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !pendingFile) || !socket || !currentUser) return;
    
    const partner = localStorage.getItem('partner') || '';
    const room = currentUser.role === 'admin' ? 'admin-dashboard' : [currentUser.username, partner].sort().join('-');

    if (editingMessage) {
      socket.emit('edit-message', { id: editingMessage.id, content: input, room });
      setEditingMessage(null);
    } else if (pendingFile) {
      socket.emit('send-message', {
        room,
        sender: currentUser.username,
        content: input.trim() || `Shared a ${pendingFile.type}`,
        type: pendingFile.type,
        fileUrl: pendingFile.url,
        viewLimit: pendingFile.limit
      });
      setPendingFile(null);
    } else {
      socket.emit('send-message', {
        room,
        sender: currentUser.username,
        content: input,
        type: 'text'
      });
    }
    setInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const isVideo = file.type.startsWith('video/');
      setPendingFile({ url: result, type: isVideo ? 'video' : 'image', limit: -1 });
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset input to allow re-upload
  };

  const handleContextMenu = (e: React.MouseEvent, msgId: string, isMe: boolean) => {
    if (currentUser?.role === 'admin') return;
    setContextMenu({ id: msgId, x: e.pageX, y: e.pageY, isMe });
  };

  const openFullscreenMedia = (msg: Message) => {
    if (msg.viewLimit !== -1 && !msg.isMe && currentUser.role !== 'admin') {
      const partner = localStorage.getItem('partner') || '';
      const room = currentUser?.role === 'admin' ? 'admin-dashboard' : [currentUser?.username, partner].sort().join('-');
      socket?.emit('view-media', { id: msg.id, room });
    }
    setFullscreenMedia(msg);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('partner');
    router.push('/');
  };

  // Canvas Drawing
  let currentX = 0, currentY = 0;
  const drawOnCanvas = (x0: number, y0: number, x1: number, y1: number, color: string) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };
  const onMouseDown = (e: React.MouseEvent) => { setIsDrawing(true); currentX = e.nativeEvent.offsetX; currentY = e.nativeEvent.offsetY; };
  const onMouseUp = () => setIsDrawing(false);
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !socket) return;
    const x1 = e.nativeEvent.offsetX, y1 = e.nativeEvent.offsetY;
    const color = currentUser?.username === 'star' ? '#ff00ff' : '#00ffff';
    drawOnCanvas(currentX, currentY, x1, y1, color);
    const partner = localStorage.getItem('partner') || '';
    const room = currentUser?.role === 'admin' ? 'admin-dashboard' : [currentUser?.username, partner].sort().join('-');
    socket.emit('draw', { x0: currentX, y0: currentY, x1, y1, color, room });
    currentX = x1; currentY = y1;
  };
  const clearCanvas = (emit = true) => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    if (emit && socket) {
      const partner = localStorage.getItem('partner') || '';
      const room = currentUser?.role === 'admin' ? 'admin-dashboard' : [currentUser?.username, partner].sort().join('-');
      socket.emit('clear-whiteboard', room);
    }
  };

  if (!currentUser) return null;

  const partnerName = localStorage.getItem('partner') || 'Global';

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-200 overflow-hidden select-none" onClick={() => setContextMenu(null)}>
      
      {/* Fullscreen Media Viewer */}
      <AnimatePresence>
        {fullscreenMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-8 backdrop-blur-md"
          >
            <button 
              onClick={() => setFullscreenMedia(null)} 
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="max-w-4xl max-h-full">
              {fullscreenMedia.type === 'image' ? (
                <img src={fullscreenMedia.fileUrl} className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" onContextMenu={(e) => e.preventDefault()} />
              ) : (
                <video src={fullscreenMedia.fileUrl} controls autoPlay className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" onContextMenu={(e) => e.preventDefault()} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contextMenu && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed z-50 glass-dark border border-white/20 rounded-xl overflow-hidden shadow-2xl py-1 min-w-[160px]"
            style={{ top: contextMenu.y, left: contextMenu.x }}
            onClick={(e) => e.stopPropagation()}
          >
            {contextMenu.isMe && (
              <button 
                onClick={() => {
                  const msg = messages.find(m => m.id === contextMenu.id);
                  if (msg && msg.type === 'text') { setEditingMessage(msg); setInput(msg.content); }
                  setContextMenu(null);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2"
              ><Pencil className="w-4 h-4 text-slate-300" /> Edit Message</button>
            )}
            <button 
              onClick={() => { 
                const partner = localStorage.getItem('partner') || '';
                const room = currentUser?.role === 'admin' ? 'admin-dashboard' : [currentUser?.username, partner].sort().join('-');
                socket?.emit('pin-message', { id: contextMenu.id, room }); 
                setContextMenu(null); 
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-white/10 flex items-center gap-2"
            ><Pin className="w-4 h-4 text-blue-400" /> Pin/Unpin</button>
            {contextMenu.isMe && (
              <button 
                onClick={() => { 
                  const partner = localStorage.getItem('partner') || '';
                  const room = currentUser?.role === 'admin' ? 'admin-dashboard' : [currentUser?.username, partner].sort().join('-');
                  socket?.emit('delete-message', { id: contextMenu.id, room }); 
                  setContextMenu(null); 
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/20 text-red-400 flex items-center gap-2"
              ><Trash2 className="w-4 h-4" /> Delete for Everyone</button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="w-80 border-r border-white/10 glass-dark flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white uppercase shadow-lg ${currentUser.role === 'admin' ? 'bg-gradient-to-tr from-red-600 to-orange-500 shadow-red-500/20' : 'bg-gradient-to-tr from-purple-500 to-blue-500 shadow-blue-500/20'}`}>
              {currentUser.username[0]}
            </div>
            <div>
              <h3 className="font-bold text-white capitalize">{currentUser.username}</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> {currentUser.role === 'admin' ? 'Admin Mode' : 'Online'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-slate-400 hover:text-white transition"><LogOut className="w-5 h-5" /></button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Active Channels</h4>
          <div className="space-y-1">
            <div onClick={() => setActiveTab('chat')} className={`px-4 py-2.5 rounded-xl font-medium cursor-pointer transition flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white/5 text-blue-300 border-l-2 border-blue-500' : 'hover:bg-white/5 text-slate-400'}`}>
              <MessageSquare className="w-4 h-4" /> {currentUser.role === 'admin' ? '# global-surveillance' : `# secure-${partnerName.toLowerCase()}`}
            </div>
          </div>
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-8 mb-4 px-2">Collaborate</h4>
          <div className="space-y-1">
            <div onClick={() => setActiveTab('whiteboard')} className={`px-4 py-2.5 rounded-xl font-medium cursor-pointer transition flex items-center gap-2 ${activeTab === 'whiteboard' ? 'bg-white/5 text-purple-300 border-l-2 border-purple-500' : 'hover:bg-white/5 text-slate-400'}`}>
              <Edit3 className="w-4 h-4" /> Shared Whiteboard
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative">
        <header className="h-20 border-b border-white/10 glass-dark flex items-center px-6 sticky top-0 z-10 justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              {activeTab === 'chat' ? (currentUser.role === 'admin' ? '# global-surveillance' : `# secure-${partnerName.toLowerCase()}`) : 'Shared Whiteboard'}
              {currentUser.role === 'admin' && <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 border border-red-500/30 ml-2">OVERRIDE ACTIVE</span>}
            </h2>
            {activeTab === 'chat' && <p className="text-[10px] text-green-400 mt-1">🔒 Screenshot & Recording Protection Active</p>}
          </div>
        </header>

        {activeTab === 'chat' ? (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => {
                // If viewLimit is -1, anyone can view forever
                // If admin, can view forever
                // If it's limited, it expires when viewCount reaches viewLimit for BOTH sender and receiver
                const isLimited = msg.viewLimit !== -1;
                const isExpired = isLimited && (msg.viewCount || 0) >= (msg.viewLimit || 0);
                const canView = !isExpired || currentUser.role === 'admin';
                
                return (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} group`} onContextMenu={(e) => !msg.isDeleted && handleContextMenu(e, msg.id, msg.isMe)}>
                    <div className={`max-w-[70%] ${msg.isMe ? 'order-2' : 'order-1'} ${msg.isDeleted && currentUser.role === 'admin' ? 'opacity-75' : ''}`}>
                      
                      {msg.isPinned && (
                        <div className={`flex items-center gap-1 mb-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          <Pin className="w-3 h-3 fill-yellow-500" /> Pinned
                        </div>
                      )}
                      
                      <div className={`flex items-end gap-2 mb-1 ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <span className="text-xs font-medium text-slate-400 capitalize">{msg.sender}</span>
                        <span className="text-[10px] text-slate-500">{msg.time}</span>
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl relative select-none group/msg transition-all duration-200 ${msg.isDeleted && currentUser.role === 'admin' ? 'border border-red-500/50 bg-red-950/40 text-red-200' : msg.isMe ? 'bg-blue-600 text-white rounded-tr-sm shadow-lg shadow-blue-900/20' : 'glass border-white/5 text-slate-200 rounded-tl-sm ' + (currentUser.role !== 'admin' ? 'blur-md active:blur-none cursor-pointer' : '')}`} title={!msg.isMe && currentUser.role !== 'admin' ? "Hold click to reveal" : ""}>
                        {msg.isDeleted && currentUser.role === 'admin' && (
                          <div className="absolute -top-3 -right-2 bg-red-600 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                            <EyeOff className="w-3 h-3" /> DELETED
                          </div>
                        )}
                        
                        {(msg.type === 'image' || msg.type === 'video') && msg.fileUrl && (!msg.isDeleted || currentUser.role === 'admin') && (
                          <div className="mb-2 relative">
                            {canView ? (
                              <div className="relative overflow-hidden rounded-lg">
                                {isLimited && currentUser.role !== 'admin' ? (
                                  <div 
                                    onClick={() => openFullscreenMedia(msg)}
                                    className="w-full h-32 bg-slate-800/80 hover:bg-slate-700 rounded-lg flex flex-col items-center justify-center border border-blue-500/50 cursor-pointer transition shadow-lg"
                                  >
                                    <Eye className="w-8 h-8 text-blue-400 mb-2" />
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Click to View Media</span>
                                    <div className="mt-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold text-red-400">
                                      Views Left: {(msg.viewLimit || 0) - (msg.viewCount || 0)}
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    {msg.type === 'image' ? (
                                      <img 
                                        src={msg.fileUrl} 
                                        alt="shared image" 
                                        onClick={() => openFullscreenMedia(msg)}
                                        className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition" 
                                        onDragStart={(e) => e.preventDefault()}
                                        onContextMenu={(e) => e.preventDefault()}
                                      />
                                    ) : (
                                      <video src={msg.fileUrl} controls controlsList="nodownload" className="max-w-full rounded-lg" onContextMenu={(e) => e.preventDefault()} />
                                    )}
                                  </>
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-32 bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-700/50">
                                <EyeOff className="w-8 h-8 text-slate-500 mb-2" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-end gap-2 relative">
                          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${msg.isDeleted && currentUser.role !== 'admin' ? 'italic text-slate-400' : ''}`}>
                            {msg.content}
                          </p>
                          {msg.isEdited && !msg.isDeleted && <span className="text-[10px] opacity-50 italic">(edited)</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 md:p-6 bg-[#0f172a]">
              {pendingFile && (
                <div className="mb-4 p-4 glass-dark border border-blue-500/30 rounded-xl relative">
                  <button onClick={() => setPendingFile(null)} className="absolute top-2 right-2 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
                  <div className="flex items-center gap-4">
                    {pendingFile.type === 'image' ? <img src={pendingFile.url} className="w-16 h-16 object-cover rounded-lg" /> : <div className="w-16 h-16 bg-slate-800 flex items-center justify-center rounded-lg text-xs">VIDEO</div>}
                    <div>
                      <p className="text-sm font-bold text-white mb-2">Media Selected</p>
                      <div className="flex gap-2">
                        <button onClick={() => setPendingFile({...pendingFile, limit: 1})} className={`px-3 py-1 text-xs font-bold rounded-lg ${pendingFile.limit === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>View Once</button>
                        <button onClick={() => setPendingFile({...pendingFile, limit: 2})} className={`px-3 py-1 text-xs font-bold rounded-lg ${pendingFile.limit === 2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>View Twice</button>
                        <button onClick={() => setPendingFile({...pendingFile, limit: -1})} className={`px-3 py-1 text-xs font-bold rounded-lg ${pendingFile.limit === -1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Unlimited</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {editingMessage && (
                <div className="mb-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-between text-xs text-blue-300">
                  <span className="flex items-center gap-2"><Pencil className="w-3 h-3" /> Editing message...</span>
                  <button onClick={() => { setEditingMessage(null); setInput(''); }} className="hover:text-blue-100"><X className="w-4 h-4" /></button>
                </div>
              )}

              <form onSubmit={sendMessage} className="relative flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,video/*" />
                <div className="absolute left-4 flex gap-3 text-slate-400 z-10">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:text-blue-400 transition cursor-pointer"><Paperclip className="w-5 h-5" /></button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="hover:text-blue-400 transition cursor-pointer"><ImageIcon className="w-5 h-5" /></button>
                </div>
                
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={editingMessage ? "Edit your message..." : "Type an encrypted message..."}
                  className={`w-full glass-dark border rounded-2xl py-4 pl-24 pr-16 text-sm outline-none transition shadow-xl text-white ${editingMessage ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-900/10' : 'border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'}`}
                />
                
                <div className="absolute right-3 flex items-center gap-2">
                  <button type="submit" className={`w-10 h-10 rounded-xl flex items-center justify-center text-white transition disabled:opacity-50 cursor-pointer ${editingMessage ? 'bg-green-600 hover:bg-green-500' : 'bg-blue-600 hover:bg-blue-500'}`}>
                    {editingMessage ? <CheckCheck className="w-4 h-4" /> : <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />}
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 bg-[#1e293b] relative overflow-hidden flex items-center justify-center p-4">
            <canvas ref={canvasRef} width={800} height={600} className="bg-white rounded-xl shadow-2xl cursor-crosshair max-w-full" onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseOut={onMouseUp} onMouseMove={onMouseMove} />
          </div>
        )}
      </main>
    </div>
  );
}
