import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessagesSquare, Send, CheckCircle, Clock, Paperclip, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { API_URL } from '../config';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import axiosClient from '../api/axiosClient';

interface TicketMessage {
  id: number;
  senderEmail: string;
  message: string;
  attachmentUrl?: string;
  isInternalNote: boolean;
  isStaff: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: number;
  customerEmail: string;
  subject: string;
  status: string;
  priority: string;
  assignedToEmail?: string;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export const SupportDashboard = () => {
  const { accessToken } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('Open');

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get(`/tickets?status=${filter}`);
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketDetails = async (id: number) => {
    try {
      const response = await axiosClient.get(`/tickets/${id}`);
      setSelectedTicket(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter, accessToken]);

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    } else {
      setSelectedTicket(null);
    }
  }, [selectedTicketId]);

  useEffect(() => {
    if (!accessToken || !selectedTicketId) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL.replace('/api', '')}/hubs/chat`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        newConnection.invoke("JoinTicketGroup", selectedTicketId.toString());
        
        newConnection.on("ReceiveMessage", (msg) => {
          setSelectedTicket(prev => {
            if (!prev) return prev;
            // Prevent duplicate message rendering
            if (prev.messages?.some(m => m.id === msg.id)) return prev;
            
            return {
              ...prev,
              messages: [...(prev.messages || []), msg]
            };
          });
        });

        newConnection.on("ReceiveTyping", (_email, typingStatus) => {
          setIsTyping(typingStatus);
        });

        newConnection.on("TicketResolved", () => {
          fetchTickets();
          setSelectedTicket(prev => prev ? { ...prev, status: 'Resolved' } : prev);
        });
      })
      .catch(err => console.error("SignalR Connection Error: ", err));

    setConnection(newConnection);

    return () => {
      if (newConnection) {
        newConnection.invoke("LeaveTicketGroup", selectedTicketId.toString())
          .catch(console.error)
          .finally(() => newConnection.stop());
      }
    };
  }, [selectedTicketId, accessToken]);

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(e.target.value);
    
    if (connection && selectedTicketId) {
      connection.invoke("Typing", selectedTicketId.toString(), true).catch(console.error);
      
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        connection.invoke("Typing", selectedTicketId.toString(), false).catch(console.error);
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleReply = async () => {
    if ((!replyMessage.trim() && !attachmentFile) || !selectedTicketId) return;

    setIsUploading(true);
    let uploadedUrl = null;

    try {
      if (attachmentFile) {
        const formData = new FormData();
        formData.append('file', attachmentFile);
        formData.append('upload_preset', 'ECommerce');

        const response = await fetch('https://api.cloudinary.com/v1_1/pyuea7od/image/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        uploadedUrl = data.secure_url;
      }

      await axiosClient.post(`/tickets/${selectedTicketId}/reply`, {
        message: replyMessage,
        attachmentUrl: uploadedUrl,
        isInternalNote: isInternalNote
      });
      
      setReplyMessage('');
      setAttachmentFile(null);
      setIsInternalNote(false);
      if (connection) {
         connection.invoke("Typing", selectedTicketId.toString(), false).catch(console.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleResolve = async () => {
    if (!selectedTicketId) return;
    try {
      await axiosClient.put(`/tickets/${selectedTicketId}/resolve`);
      
      setSelectedTicketId(null);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClaim = async () => {
    if (!selectedTicketId) return;
    try {
      const response = await axiosClient.put(`/tickets/${selectedTicketId}/claim`);
      setSelectedTicket(response.data);
      fetchTickets();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'Urgent': return 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';
      case 'High': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'Medium': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
          <MessagesSquare size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Support Desk</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and resolve customer inquiries</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm rounded-2xl overflow-hidden flex h-[600px]">
        {/* Ticket List (Left Pane) */}
        <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Open">Open Tickets</option>
              <option value="InProgress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-slate-500"><Clock className="animate-spin mx-auto mb-2" size={24}/> Loading...</div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center text-slate-500">No tickets found in this view.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {tickets.map(ticket => (
                  <button 
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`w-full text-left p-4 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${selectedTicketId === ticket.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500' : 'border-l-4 border-transparent'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase">#{ticket.id}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1 truncate">{ticket.subject}</h4>
                    <p className="text-xs text-slate-500 truncate">{ticket.customerEmail}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Thread (Right Pane) */}
        <div className="w-2/3 flex flex-col bg-white dark:bg-slate-900">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedTicket.subject}</h3>
                    {selectedTicket.assignedToEmail && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-1 rounded-md font-medium border border-indigo-200 dark:border-indigo-800">
                        Assigned to: {selectedTicket.assignedToEmail}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">From: {selectedTicket.customerEmail}</p>
                </div>
                <div className="flex gap-2">
                  {!selectedTicket.assignedToEmail && selectedTicket.status !== 'Resolved' && (
                    <button 
                      onClick={handleClaim}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold transition-colors"
                    >
                      Assign to Me
                    </button>
                  )}
                  {selectedTicket.status !== 'Resolved' && (
                    <button 
                      onClick={handleResolve}
                      className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg text-sm font-semibold transition-colors"
                    >
                      <CheckCircle size={16} /> Mark Resolved
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
              {selectedTicket.messages?.map(msg => {
                const isStaff = msg.isStaff;
                const isInternal = msg.isInternalNote;
                return (
                  <div key={msg.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isInternal ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/30 dark:text-amber-200 border border-amber-200 dark:border-amber-700/50 shadow-sm' : isStaff ? 'bg-indigo-600 text-white rounded-br-none shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-xs font-semibold ${isInternal ? 'text-amber-700 dark:text-amber-400' : isStaff ? 'text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>{isInternal ? 'Private Note (Only Staff)' : isStaff ? 'You' : msg.senderEmail}</span>
                        <span className={`text-[10px] ml-4 ${isInternal ? 'text-amber-600 dark:text-amber-500' : isStaff ? 'text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {msg.attachmentUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 mt-1">
                          <a href={msg.attachmentUrl} target="_blank" rel="noreferrer">
                            <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full h-auto max-h-[200px] object-cover hover:opacity-90 transition-opacity cursor-pointer" />
                          </a>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                )
              })}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <span className="text-xs text-slate-500 ml-2 font-medium">Customer is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Reply Input */}
            {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-2">
                {attachmentFile && (
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-sm w-max border border-slate-200 dark:border-slate-700">
                    <ImageIcon size={16} className="text-indigo-500"/>
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{attachmentFile.name}</span>
                    <button onClick={() => setAttachmentFile(null)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <div className="flex-1 flex flex-col gap-2">
                    <textarea 
                      value={replyMessage}
                      onChange={handleTyping}
                      placeholder={isInternalNote ? "Type a private internal note..." : "Type your reply to customer..."}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[80px] transition-colors ${isInternalNote ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800/50' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'}`}
                    />
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 w-max cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isInternalNote} 
                        onChange={(e) => setIsInternalNote(e.target.checked)} 
                        className="rounded border-slate-300 text-amber-500 focus:ring-amber-500"
                      />
                      Add as Private Internal Note (Customer will not see this)
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <label className="h-[80px] px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)} />
                      <Paperclip size={20} />
                    </label>
                    <button 
                      onClick={handleReply}
                      disabled={(!replyMessage.trim() && !attachmentFile) || isUploading}
                      className="h-[80px] w-[80px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
                    >
                      {isUploading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <MessagesSquare size={48} className="mb-4 opacity-50" />
              <p>Select a ticket to view the conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
