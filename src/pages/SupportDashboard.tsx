import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessagesSquare, Send, CheckCircle, Clock } from 'lucide-react';
import { API_URL } from '../config';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import axiosClient from '../api/axiosClient';

interface TicketMessage {
  id: number;
  senderEmail: string;
  message: string;
  isStaff: boolean;
  createdAt: string;
}

interface SupportTicket {
  id: number;
  customerEmail: string;
  subject: string;
  status: string;
  priority: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export const SupportDashboard = () => {
  const { accessToken } = useAuthStore();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
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
    if (!replyMessage.trim() || !selectedTicketId) return;

    try {
      await axiosClient.post(`/tickets/${selectedTicketId}/reply`, {
        message: replyMessage
      });
      
      setReplyMessage('');
      if (connection) {
         connection.invoke("Typing", selectedTicketId.toString(), false).catch(console.error);
      }
      // SignalR handles appending the new message dynamically
    } catch (err) {
      console.error(err);
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
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{selectedTicket.subject}</h3>
                  <p className="text-sm text-slate-500">From: {selectedTicket.customerEmail}</p>
                </div>
                {selectedTicket.status !== 'Resolved' && (
                  <button 
                    onClick={handleResolve}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 rounded-lg text-sm font-semibold transition-colors"
                  >
                    <CheckCircle size={16} /> Mark Resolved
                  </button>
                )}
              </div>

              {/* Messages */}
              {/* Chat Thread */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
              {selectedTicket.messages?.map(msg => {
                const isStaff = msg.isStaff;
                return (
                  <div key={msg.id} className={`flex ${isStaff ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${isStaff ? 'bg-primary text-white rounded-br-none shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-xs font-semibold ${isStaff ? 'text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>{isStaff ? 'You' : msg.senderEmail}</span>
                        <span className={`text-[10px] ml-4 ${isStaff ? 'text-indigo-300' : 'text-slate-400 dark:text-slate-500'}`}>{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
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
              <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-end gap-3">
                  <textarea 
                    value={replyMessage}
                    onChange={handleTyping}
                    placeholder="Type your reply to customer..."
                    className="flex-1 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none min-h-[80px]"
                  />
                  <button 
                    onClick={handleReply}
                    disabled={!replyMessage.trim()}
                    className="h-[80px] px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <Send size={20} />
                  </button>
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
