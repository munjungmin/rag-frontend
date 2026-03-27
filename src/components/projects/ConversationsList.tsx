import { MessageSquare, Plus, AlertCircle, Trash2 } from "lucide-react";
import { Project, Chat } from "@/lib/types";

interface ConversationsListProps {
  project: Project;
  conversations: Chat[];
  error: string | null;
  loading: boolean;
  onCreateNewChat: () => void;
  onChatClick: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export function ConversationsList({
  project,
  conversations,
  error,
  loading,
  onCreateNewChat,
  onChatClick,
  onDeleteChat,
}: ConversationsListProps) {
  const hasConversations = conversations.length > 0;

  return (
    <div className="flex-1 flex flex-col bg-[#ECEEF6] rounded-xl overflow-hidden">
      {/* Error Display */}
      {error && (
        <div className="p-6 pb-0">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
              <span className="text-red-600 text-sm">{error}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div>
          {/* Project Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-gray-500 text-sm">{project.description}</p>
              )}
            </div>

            <button
              onClick={onCreateNewChat}
              disabled={loading}
              className="bg-[#4F63D2] hover:bg-[#3D52C5] disabled:bg-gray-300 disabled:text-gray-400 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#4F63D2]/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} />
                  New conversation
                </>
              )}
            </button>
          </div>

          {/* Conversations Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Conversations
              </h2>
              <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">
                {conversations.length}
              </span>
            </div>

            {!hasConversations ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-[#4F63D2]/10 border border-[#4F63D2]/10 rounded-xl mx-auto mb-6 flex items-center justify-center">
                  <MessageSquare size={22} className="text-[#4F63D2]" />
                </div>
<h3 className="text-2xl font-bold text-gray-800 mb-3">
                  No conversations yet
                </h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed text-sm">
                  Your AI workspace is ready. Start a conversation to begin
                  querying your knowledge base.
                </p>
                <button
                  onClick={onCreateNewChat}
                  disabled={loading}
                  className="bg-[#4F63D2] hover:bg-[#3D52C5] disabled:bg-gray-300 disabled:text-gray-400 text-white px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#4F63D2]/30 border-t-white rounded-full animate-spin"></div>
                      Creating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus size={16} />
                      Start first conversation
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => onChatClick(chat.id)}
                    className="group bg-white hover:bg-[#4F63D2]/5 border border-gray-200 hover:border-[#4F63D2]/30 rounded-lg p-4 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Chat Icon */}
                      <div className="w-8 h-8 bg-[#4F63D2]/10 border border-[#4F63D2]/10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors">
                        <MessageSquare
                          size={14}
                          className="text-[#4F63D2] group-hover:text-[#3D52C5]"
                        />
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-700 group-hover:text-gray-900 truncate transition-colors">
                          {chat.title}
                        </h3>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteChat(chat.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer hover:scale-110"
                        title="Delete chat"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
