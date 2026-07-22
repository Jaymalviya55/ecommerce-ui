import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { MessagesSquare, Plus, Send, X, Clock, Paperclip, Loader2, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../../config';
import axiosClient from '../../api/axiosClient';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import toast from 'react-hot-toast';
import React from 'react';

interface TicketMessage {
  id: number;
  senderEmail: string;
  message: string;
  attachmentUrl?: string;
  isStaff: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
  isHumanRequested?: boolean;
  messages?: TicketMessage[];
}

export const CustomerTickets = () => {
  const { accessToken } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // New ticket form
  const [isCreating, setIsCreating] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const [newOrderId, setNewOrderId] = useState<string>('');

  const { myOrders, fetchMyOrders } = useOrderStore();

  // Reply
  const [replyMessage, setReplyMessage] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get('/tickets/my-tickets');
      setTickets(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
    fetchMyOrders();
  }, [accessToken, fetchMyOrders]);

  useEffect(() => {
    if (!accessToken || !selectedTicket?.id) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${API_URL.replace('/api', '')}/hubs/chat`, {
        accessTokenFactory: () => accessToken
      })
      .withAutomaticReconnect()
      .build();

    newConnection.start()
      .then(() => {
        newConnection.invoke("JoinTicketGroup", selectedTicket.id.toString());
        
        newConnection.on("ReceiveMessage", (msg) => {
          setSelectedTicket(prev => {
            if (!prev) return prev;
            // Prevent duplicate message rendering if REST response was faster
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
        // use catch instead of await since we're unmounting
        newConnection.invoke("LeaveTicketGroup", selectedTicket.id.toString())
          .catch(console.error)
          .finally(() => newConnection.stop());
      }
    };
  }, [selectedTicket?.id, accessToken]);

  const handleEscalate = async (ticketId: number) => {
    try {
      setIsUploading(true);
      await axiosClient.put(`/tickets/${ticketId}/escalate`);
      toast.success("Connecting to a Customer Executive...");
      setSelectedTicket(prev => prev ? { ...prev, isHumanRequested: true } : prev);
      
      // Update in tickets list
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, isHumanRequested: true } : t));
    } catch (err) {
      toast.error("Failed to connect to agent.");
    } finally {
      setIsUploading(false);
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

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    try {
      await axiosClient.post('/tickets', {
        subject: newSubject,
        message: newMessage,
        orderId: newOrderId ? parseInt(newOrderId) : null
      });

      setIsCreating(false);
      setNewSubject('');
      setNewMessage('');
      setNewOrderId('');
      fetchTickets();
      toast.success("Support ticket created!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create ticket.");
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReplyMessage(e.target.value);
    
    if (connection && selectedTicket) {
      connection.invoke("Typing", selectedTicket.id.toString(), true).catch(console.error);
      
      if (typingTimeout) clearTimeout(typingTimeout);
      
      const timeout = setTimeout(() => {
        connection.invoke("Typing", selectedTicket.id.toString(), false).catch(console.error);
      }, 2000);
      
      setTypingTimeout(timeout);
    }
  };

  const handleReply = async () => {
    if ((!replyMessage.trim() && !attachmentFile) || !selectedTicket) return;

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

      await axiosClient.post(`/tickets/${selectedTicket.id}/reply`, {
        message: replyMessage,
        attachmentUrl: uploadedUrl
      });
      
      setReplyMessage('');
      setAttachmentFile(null);
      if (connection) {
         connection.invoke("Typing", selectedTicket.id.toString(), false).catch(console.error);
      }
      // No need to fetchTicketDetails(selectedTicket.id) here, SignalR will append the message
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message.");
    } finally {
      setIsUploading(false);
    }
  };



  if (isCreating) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Open a Support Ticket</h3>
          <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><X size={20} /></button>
        </div>
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
            <input 
              required
              type="text" 
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" 
              placeholder="e.g. My order arrived damaged"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Related Order (Optional)</label>
            <select 
              value={newOrderId}
              onChange={(e) => setNewOrderId(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">None / General Inquiry</option>
              {myOrders.map((order: any) => (
                <option key={order.id} value={order.id}>
                  Order #{order.id} - {new Date(order.orderDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
            <textarea 
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={4}
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Please describe your issue in detail..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsCreating(false)} className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold shadow-md transition-colors">Submit Ticket</button>
          </div>
        </form>
      </div>
    );
  }

  if (selectedTicket) {
    return (
      <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl flex flex-col h-[600px] overflow-hidden shadow-xl dark:shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <button onClick={() => setSelectedTicket(null)} className="text-sm text-primary hover:underline font-medium mb-1">&larr; Back to Tickets</button>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedTicket.subject}</h3>
          </div>
          <div className="flex gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{selectedTicket.status}</span>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/20">
          {selectedTicket.messages?.map(msg => {
            const isStaff = msg.isStaff;
            const isEscalateMsg = msg.message.includes("[ESCALATE_TO_HUMAN]");
            const displayText = msg.message.replace("[ESCALATE_TO_HUMAN]", "").trim();
            
            return (
              <React.Fragment key={msg.id}>
                {(displayText || msg.attachmentUrl) && (
                  <div className={`flex ${!isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${!isStaff ? 'bg-primary text-white rounded-br-none shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-xs font-semibold ${!isStaff ? 'text-indigo-200' : 'text-emerald-600 dark:text-emerald-400'}`}>{!isStaff ? 'You' : 'Support Team'}</span>
                        <span className={`text-[10px] ml-4 ${!isStaff ? 'text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      {msg.attachmentUrl && (
                        <div className="mb-2 rounded-lg overflow-hidden border border-black/10 dark:border-white/10 mt-1">
                          <a href={msg.attachmentUrl} target="_blank" rel="noreferrer">
                            <img src={msg.attachmentUrl} alt="Attachment" className="max-w-full h-auto max-h-[200px] object-cover hover:opacity-90 transition-opacity cursor-pointer" />
                          </a>
                        </div>
                      )}
                      {displayText && <p className="text-sm whitespace-pre-wrap">{displayText}</p>}
                    </div>
                  </div>
                )}
                
                {isEscalateMsg && !selectedTicket.isHumanRequested && (
                  <div className="flex justify-center my-4">
                    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">I seem to have reached the limit of my capabilities. Would you like to speak with a human agent?</p>
                      <button 
                        onClick={() => handleEscalate(selectedTicket.id)}
                        disabled={isUploading}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                      >
                        Connect to Customer Executive
                      </button>
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <span className="text-xs text-slate-500 ml-2 font-medium">Support Team is typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Reply input */}
        {selectedTicket.status !== 'Resolved' && selectedTicket.status !== 'Closed' && (
          <div className="p-4 bg-white dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/50 flex flex-col gap-2">
            {attachmentFile && (
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 rounded-lg p-2 text-sm w-max border border-slate-200 dark:border-slate-700">
                <ImageIcon size={16} className="text-primary"/>
                <span className="text-slate-700 dark:text-slate-300 truncate max-w-[200px]">{attachmentFile.name}</span>
                <button onClick={() => setAttachmentFile(null)} className="text-slate-400 hover:text-rose-500"><X size={16}/></button>
              </div>
            )}
            <div className="flex items-end gap-3">
              <textarea 
                value={replyMessage}
                onChange={handleTyping}
                placeholder="Type your reply..."
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none resize-none min-h-[60px]"
              />
              <div className="flex gap-2">
                <label className="h-[60px] px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center transition-colors cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setAttachmentFile(e.target.files?.[0] || null)} />
                  <Paperclip size={18} />
                </label>
                <button 
                  onClick={handleReply}
                  disabled={(!replyMessage.trim() && !attachmentFile) || isUploading}
                  className="h-[60px] w-[60px] bg-primary hover:bg-primary-dark text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
                >
                  {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white/80 dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl shadow-xl dark:shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MessagesSquare className="text-primary" size={24} /> Help & Support
        </h3>
        <button 
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/20 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} /> New Ticket
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500"><Clock className="animate-spin mx-auto mb-2" size={24}/> Loading tickets...</div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl">
          <MessagesSquare size={40} className="mx-auto text-slate-400 mb-3 opacity-50" />
          <h4 className="font-bold text-slate-900 dark:text-white">No active tickets</h4>
          <p className="text-sm text-slate-500 mt-1">If you need help with an order, open a new ticket!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map(ticket => (
            <button
              key={ticket.id}
              onClick={() => fetchTicketDetails(ticket.id)}
              className="w-full text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl p-4 hover:border-primary dark:hover:border-primary transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{ticket.subject}</h4>
                <div className="flex gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">{ticket.status}</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">Last updated: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
