import React, { useState, useRef, useEffect, useCallback } from 'react'

const AISidebar = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '您好！我是您的跨境电商AI助手。我可以帮您进行出海规划、市场分析、风险评估等。请告诉我您想了解什么？',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const quickQuestions = [
    '如何开始跨境电商？',
    '哪些市场适合新手？',
    '如何选择产品？',
    '物流方案有哪些？',
    '税务合规要注意什么？'
  ]

  // 辅助函数：创建消息对象
  const createMessage = useCallback((type, content) => ({
    id: Date.now() + Math.random(),
    type,
    content,
    timestamp: new Date()
  }), [])

  // 辅助函数：滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 调用AI API
  const callAIApi = useCallback(async (message) => {
    const response = await fetch('/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        conversationId: 'ai-sidebar-conversation'
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    return data.response || '抱歉，我暂时无法回答您的问题，请稍后再试。'
  }, [])

  // 发送消息处理函数
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = createMessage('user', inputValue)
    setMessages(prev => [...prev, userMessage])
    
    const currentInput = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const aiContent = await callAIApi(currentInput)
      const aiMessage = createMessage('ai', aiContent)
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI API调用错误:', error)
      const errorMessage = createMessage('ai', 
        '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。如果问题持续存在，请联系技术支持。'
      )
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputValue, isLoading, createMessage, callAIApi])

  // 快速问题处理
  const handleQuickQuestion = useCallback(async (question) => {
    if (isLoading) return // 如果正在加载，不处理新的快速问题

    const userMessage = createMessage('user', question)
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const aiContent = await callAIApi(question)
      const aiMessage = createMessage('ai', aiContent)
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI API调用错误:', error)
      const errorMessage = createMessage('ai', 
        '抱歉，AI服务暂时不可用。请检查网络连接或稍后再试。如果问题持续存在，请联系技术支持。'
      )
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, createMessage, callAIApi])

  // 键盘事件处理
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  // 渲染消息组件
  const MessageComponent = ({ message }) => (
    <div className={`message ${message.type}`}>
      <div className="message-avatar">
        {message.type === 'ai' ? '🤖' : '👤'}
      </div>
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        <div className="message-time">
          {message.timestamp.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  )

  // 渲染加载动画
  const LoadingComponent = () => (
    <div className="message ai">
      <div className="message-avatar">🤖</div>
      <div className="message-content">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )

  return (
    <div className={`ai-sidebar ${isOpen ? 'open' : ''}`}>
      <div className="ai-sidebar-content">
        {/* 头部 */}
        <div className="ai-header">
          <div className="ai-title">
            <span className="ai-icon">🤖</span>
            <span>AI出海助手</span>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 消息区域 */}
        <div className="messages-container">
          {messages.map(message => (
            <MessageComponent key={message.id} message={message} />
          ))}
          
          {isLoading && <LoadingComponent />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* 快速问题 */}
        <div className="quick-questions">
          <div className="quick-questions-title">快速提问</div>
          <div className="quick-questions-list">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
                disabled={isLoading}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入您的问题..."
              rows="1"
              className="message-input"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="send-btn"
            >
              {isLoading ? '发送中...' : '发送'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ai-sidebar {
          position: fixed;
          top: 80px;
          right: -400px;
          width: 400px;
          height: calc(100vh - 80px);
          background: white;
          box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
          transition: right 0.3s ease;
          z-index: 100;
          display: flex;
          flex-direction: column;
        }

        .ai-sidebar.open {
          right: 0;
        }

        .ai-sidebar-content {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* 头部样式 */
        .ai-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          background: white;
        }

        .ai-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .ai-icon {
          font-size: 1.25rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #64748b;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #1a1a1a;
        }

        /* 消息区域样式 */
        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message {
          display: flex;
          gap: 0.75rem;
          max-width: 100%;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          flex-shrink: 0;
        }

        .message.ai .message-avatar {
          background: #eff6ff;
        }

        .message.user .message-avatar {
          background: #f1f5f9;
        }

        .message-content {
          max-width: calc(100% - 40px);
        }

        .message-text {
          padding: 0.75rem 1rem;
          border-radius: 16px;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.ai .message-text {
          background: #eff6ff;
          color: #1a1a1a;
          border-bottom-left-radius: 4px;
        }

        .message.user .message-text {
          background: #2563eb;
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-time {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
          text-align: right;
        }

        .message.ai .message-time {
          text-align: left;
        }

        /* 加载动画 */
        .loading-dots {
          display: flex;
          gap: 0.25rem;
          padding: 0.75rem 1rem;
        }

        .loading-dots span {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #cbd5e1;
          animation: bounce 1.4s infinite ease-in-out;
        }

        .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
        .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* 快速问题样式 */
        .quick-questions {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .quick-questions-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.75rem;
        }

        .quick-questions-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .quick-question-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .quick-question-btn:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .quick-question-btn:disabled {
          background: #f8fafc;
          border-color: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          opacity: 0.6;
        }

        /* 输入区域样式 */
        .input-area {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .input-container {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .message-input {
          flex: 1;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          resize: none;
          min-height: 44px;
          max-height: 120px;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .message-input:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .send-btn {
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          min-width: 60px;
          height: 44px;
        }

        .send-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .send-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
          .ai-sidebar {
            width: 100%;
            right: -100%;
            top: 70px;
            height: calc(100vh - 70px);
          }
        }

        @media (max-width: 640px) {
          .messages-container,
          .input-area,
          .quick-questions {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default AISidebar