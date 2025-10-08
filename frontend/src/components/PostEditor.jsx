import React, { useState, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const PostEditor = ({ onClose, onSave, initialPost = null }) => {
  const [postData, setPostData] = useState({
    title: initialPost?.title || '',
    content: initialPost?.content || '',
    summary: initialPost?.summary || '',
    tags: initialPost?.tags || [],
    category: initialPost?.category || 'experience',
    platform: initialPost?.platform || 'all'
  })
  
  const [isPreview, setIsPreview] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [aiGenerationType, setAiGenerationType] = useState('')
  const [newTag, setNewTag] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  const fileInputRef = useRef(null)

  // 分类选项
  const categories = [
    { id: 'experience', name: '经验分享', icon: '💡' },
    { id: 'question', name: '问题求助', icon: '❓' },
    { id: 'resource', name: '资源分享', icon: '📚' },
    { id: 'news', name: '行业资讯', icon: '📰' },
    { id: 'job', name: '招聘求职', icon: '💼' }
  ]

  // 平台选项
  const platforms = [
    { id: 'all', name: '通用', icon: '🌐' },
    { id: 'amazon', name: 'Amazon', icon: '🛒' },
    { id: 'shopify', name: 'Shopify', icon: '🏪' },
    { id: 'ebay', name: 'eBay', icon: '💙' },
    { id: 'aliexpress', name: '速卖通', icon: '🌏' },
    { id: 'lazada', name: 'Lazada', icon: '🛍️' }
  ]

  // 处理输入变化
  const handleInputChange = (field, value) => {
    setPostData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !postData.tags.includes(newTag.trim())) {
      setPostData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  // 删除标签
  const handleRemoveTag = (tagToRemove) => {
    setPostData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // AI内容生成
  const handleAIGenerate = useCallback(async (type) => {
    setIsAIGenerating(true)
    setAiGenerationType(type)

    try {
      let prompt = ''
      let targetField = ''

      switch (type) {
        case 'title':
          prompt = `请为以下主题生成一个吸引人的帖子标题：${postData.content.substring(0, 200)}...`
          targetField = 'title'
          break
        case 'content':
          prompt = `请基于以下标题生成一篇详细的出海经验分享文章：${postData.title}`
          targetField = 'content'
          break
        case 'summary':
          prompt = `请为以下内容生成一个简洁的摘要：${postData.content.substring(0, 500)}...`
          targetField = 'summary'
          break
        case 'tags':
          prompt = `请为以下文章推荐5个相关标签：标题：${postData.title}，内容：${postData.content.substring(0, 300)}...`
          targetField = 'tags'
          break
        case 'outline':
          prompt = `请为"${postData.title}"这个主题生成一个详细的文章大纲`
          targetField = 'content'
          break
        default:
          return
      }

      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          type,
          context: 'post_creation'
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (type === 'tags') {
          // 处理标签数组
          const suggestedTags = data.content.split(',').map(tag => tag.trim()).filter(tag => tag)
          setPostData(prev => ({
            ...prev,
            tags: [...new Set([...prev.tags, ...suggestedTags])]
          }))
        } else {
          // 处理文本内容
          setPostData(prev => ({
            ...prev,
            [targetField]: data.content
          }))
        }
      } else {
        throw new Error('AI生成失败')
      }
    } catch (error) {
      console.error('AI生成错误:', error)
      alert('AI生成失败，请稍后重试')
    } finally {
      setIsAIGenerating(false)
      setAiGenerationType('')
    }
  }, [postData])

  // 图片上传
  const handleImageUpload = useCallback(async (event) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    
    try {
      for (const file of files) {
        // 压缩图片
        const compressedFile = await compressImage(file)
        
        // 上传到阿里云OSS
        const formData = new FormData()
        formData.append('image', compressedFile)
        
        const response = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          
          // 插入图片到编辑器
          const imageMarkdown = `![${file.name}](${data.url})\n`
          setPostData(prev => ({
            ...prev,
            content: prev.content + imageMarkdown
          }))
        } else {
          throw new Error('图片上传失败')
        }
      }
    } catch (error) {
      console.error('图片上传错误:', error)
      alert('图片上传失败，请稍后重试')
    } finally {
      setIsUploading(false)
    }
  }, [])

  // 图片压缩
  const compressImage = (file, maxWidth = 800, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 计算压缩后的尺寸
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // 绘制压缩后的图片
        ctx.drawImage(img, 0, 0, width, height)
        
        // 转换为Blob
        canvas.toBlob(resolve, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // 保存帖子
  const handleSave = () => {
    if (!postData.title.trim() || !postData.content.trim()) {
      alert('请填写标题和内容')
      return
    }

    onSave({
      ...postData,
      id: initialPost?.id || Date.now().toString(),
      createdAt: initialPost?.createdAt || new Date().toISOString(),
      author: {
        id: 'current_user',
        username: '当前用户',
        avatar: '👤',
        level: '新手卖家',
        points: 100
      },
      likes: 0,
      comments: 0,
      views: 0,
      isPinned: false,
      isFeatured: false
    })
  }

  return (
    <div className="post-editor-overlay" onClick={onClose}>
      <div className="post-editor" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="editor-header">
          <h2>{initialPost ? '编辑帖子' : '发布新帖子'}</h2>
          <div className="header-actions">
            <button 
              className="preview-btn"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? '编辑' : '预览'}
            </button>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="editor-content">
          <div className="editor-main">
            {isPreview ? (
              <div className="preview-content">
                <h1 className="preview-title">{postData.title || '无标题'}</h1>
                <div className="preview-meta">
                  <span className="preview-category">
                    {categories.find(c => c.id === postData.category)?.name}
                  </span>
                  <span className="preview-platform">
                    {platforms.find(p => p.id === postData.platform)?.name}
                  </span>
                  {postData.tags.map(tag => (
                    <span key={tag} className="preview-tag">{tag}</span>
                  ))}
                </div>
                <div className="preview-body">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                      h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                      h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                      p: ({children}) => <p className="markdown-p">{children}</p>,
                      ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                      ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                      li: ({children}) => <li className="markdown-li">{children}</li>,
                      strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                      em: ({children}) => <em className="markdown-em">{children}</em>,
                      img: ({src, alt}) => <img src={src} alt={alt} className="markdown-img" />,
                    }}
                  >
                    {postData.content || '暂无内容'}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="editor-form">
                {/* 基本信息 */}
                <div className="form-section">
                  <div className="form-row">
                    <div className="form-group">
                      <label>帖子标题 *</label>
                      <div className="input-with-ai">
                        <input
                          type="text"
                          placeholder="输入帖子标题..."
                          value={postData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          className="form-input"
                        />
                        <button 
                          className="ai-btn"
                          onClick={() => handleAIGenerate('title')}
                          disabled={isAIGenerating}
                        >
                          {isAIGenerating && aiGenerationType === 'title' ? '生成中...' : '🤖'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>文章摘要</label>
                      <div className="input-with-ai">
                        <textarea
                          placeholder="输入文章摘要..."
                          value={postData.summary}
                          onChange={(e) => handleInputChange('summary', e.target.value)}
                          className="form-textarea"
                          rows={3}
                        />
                        <button 
                          className="ai-btn"
                          onClick={() => handleAIGenerate('summary')}
                          disabled={isAIGenerating}
                        >
                          {isAIGenerating && aiGenerationType === 'summary' ? '生成中...' : '🤖'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>分类 *</label>
                      <select
                        value={postData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="form-select"
                      >
                        {categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>相关平台</label>
                      <select
                        value={postData.platform}
                        onChange={(e) => handleInputChange('platform', e.target.value)}
                        className="form-select"
                      >
                        {platforms.map(platform => (
                          <option key={platform.id} value={platform.id}>
                            {platform.icon} {platform.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>标签</label>
                      <div className="tags-input">
                        <div className="tags-list">
                          {postData.tags.map(tag => (
                            <span key={tag} className="tag-item">
                              {tag}
                              <button 
                                onClick={() => handleRemoveTag(tag)}
                                className="tag-remove"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="tag-input">
                          <input
                            type="text"
                            placeholder="添加标签..."
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                            className="form-input"
                          />
                          <button 
                            className="add-tag-btn"
                            onClick={handleAddTag}
                          >
                            添加
                          </button>
                          <button 
                            className="ai-btn"
                            onClick={() => handleAIGenerate('tags')}
                            disabled={isAIGenerating}
                          >
                            {isAIGenerating && aiGenerationType === 'tags' ? '生成中...' : '🤖'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 内容编辑 */}
                <div className="form-section">
                  <div className="editor-toolbar">
                    <div className="toolbar-group">
                      <button 
                        className="toolbar-btn"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                      >
                        {isUploading ? '上传中...' : '📷 插入图片'}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                    </div>
                    
                    <div className="toolbar-group">
                      <button 
                        className="toolbar-btn"
                        onClick={() => handleAIGenerate('outline')}
                        disabled={isAIGenerating}
                      >
                        {isAIGenerating && aiGenerationType === 'outline' ? '生成中...' : '📝 生成大纲'}
                      </button>
                      <button 
                        className="toolbar-btn"
                        onClick={() => handleAIGenerate('content')}
                        disabled={isAIGenerating}
                      >
                        {isAIGenerating && aiGenerationType === 'content' ? '生成中...' : '✍️ 生成内容'}
                      </button>
                    </div>
                  </div>

                  <textarea
                    placeholder="开始写作...支持Markdown格式"
                    value={postData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    className="content-editor"
                    rows={20}
                  />
                  
                  <div className="editor-help">
                    <p>💡 支持Markdown格式：</p>
                    <ul>
                      <li><code># 标题</code> - 一级标题</li>
                      <li><code>**粗体**</code> - 粗体文本</li>
                      <li><code>*斜体*</code> - 斜体文本</li>
                      <li><code>- 列表项</code> - 无序列表</li>
                      <li><code>[链接](URL)</code> - 超链接</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI助手面板 */}
          <div className="ai-assistant">
            <h3>🤖 AI写作助手</h3>
            
            <div className="ai-actions">
              <button 
                className="ai-action-btn"
                onClick={() => handleAIGenerate('title')}
                disabled={isAIGenerating}
              >
                <span className="ai-icon">📝</span>
                <span className="ai-text">生成标题</span>
              </button>
              
              <button 
                className="ai-action-btn"
                onClick={() => handleAIGenerate('outline')}
                disabled={isAIGenerating}
              >
                <span className="ai-icon">📋</span>
                <span className="ai-text">生成大纲</span>
              </button>
              
              <button 
                className="ai-action-btn"
                onClick={() => handleAIGenerate('content')}
                disabled={isAIGenerating}
              >
                <span className="ai-icon">✍️</span>
                <span className="ai-text">生成内容</span>
              </button>
              
              <button 
                className="ai-action-btn"
                onClick={() => handleAIGenerate('summary')}
                disabled={isAIGenerating}
              >
                <span className="ai-icon">📄</span>
                <span className="ai-text">生成摘要</span>
              </button>
              
              <button 
                className="ai-action-btn"
                onClick={() => handleAIGenerate('tags')}
                disabled={isAIGenerating}
              >
                <span className="ai-icon">🏷️</span>
                <span className="ai-text">推荐标签</span>
              </button>
            </div>

            {isAIGenerating && (
              <div className="ai-loading">
                <div className="loading-spinner"></div>
                <p>AI正在生成内容...</p>
              </div>
            )}

            <div className="ai-tips">
              <h4>💡 使用提示</h4>
              <ul>
                <li>先输入标题或部分内容，再使用AI生成</li>
                <li>AI生成的内容可以进一步编辑和优化</li>
                <li>建议结合人工创作和AI辅助</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 底部操作 */}
        <div className="editor-footer">
          <div className="footer-info">
            <span>支持Markdown格式</span>
            <span>字数：{postData.content.length}</span>
          </div>
          <div className="footer-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!postData.title.trim() || !postData.content.trim()}
            >
              {initialPost ? '更新帖子' : '发布帖子'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .post-editor-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .post-editor {
          background: white;
          border-radius: 16px;
          max-width: 1200px;
          width: 100%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .editor-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .preview-btn {
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .preview-btn:hover {
          background: #e2e8f0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #64748b;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #f1f5f9;
        }

        .editor-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          flex: 1;
          overflow: hidden;
        }

        .editor-main {
          padding: 2rem;
          overflow-y: auto;
        }

        .editor-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .form-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row:last-child {
          margin-bottom: 0;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .input-with-ai {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .form-input, .form-textarea, .form-select {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .ai-btn {
          padding: 0.75rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
          min-width: 40px;
        }

        .ai-btn:hover:not(:disabled) {
          background: #059669;
        }

        .ai-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .tags-input {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background: #eff6ff;
          color: #2563eb;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .tag-remove {
          background: none;
          border: none;
          color: #2563eb;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tag-input {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .add-tag-btn {
          padding: 0.75rem 1rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .add-tag-btn:hover {
          background: #1d4ed8;
        }

        .editor-toolbar {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .toolbar-group {
          display: flex;
          gap: 0.5rem;
        }

        .toolbar-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #9ca3af;
        }

        .toolbar-btn:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .content-editor {
          width: 100%;
          padding: 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          line-height: 1.6;
          resize: vertical;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        }

        .content-editor:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .editor-help {
          margin-top: 1rem;
          padding: 1rem;
          background: #eff6ff;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1e40af;
        }

        .editor-help ul {
          margin: 0.5rem 0 0 1.5rem;
        }

        .editor-help li {
          margin: 0.25rem 0;
        }

        .editor-help code {
          background: #dbeafe;
          padding: 0.125rem 0.25rem;
          border-radius: 3px;
          font-family: monospace;
        }

        .ai-assistant {
          background: #f8fafc;
          border-left: 1px solid #e2e8f0;
          padding: 2rem;
          overflow-y: auto;
        }

        .ai-assistant h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
        }

        .ai-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .ai-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .ai-action-btn:hover:not(:disabled) {
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .ai-action-btn:disabled {
          background: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }

        .ai-icon {
          font-size: 1.2rem;
        }

        .ai-text {
          font-size: 0.875rem;
          font-weight: 500;
        }

        .ai-loading {
          text-align: center;
          padding: 2rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .ai-tips {
          background: white;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .ai-tips h4 {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .ai-tips ul {
          margin: 0;
          padding-left: 1.5rem;
        }

        .ai-tips li {
          margin: 0.5rem 0;
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.5;
        }

        .editor-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .footer-info {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .footer-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-primary:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        /* 预览样式 */
        .preview-content {
          max-width: none;
        }

        .preview-title {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .preview-meta {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .preview-category, .preview-platform, .preview-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .preview-category {
          background: #eff6ff;
          color: #2563eb;
        }

        .preview-platform {
          background: #f0fdf4;
          color: #166534;
        }

        .preview-tag {
          background: #f1f5f9;
          color: #475569;
        }

        .preview-body {
          line-height: 1.7;
          color: #374151;
        }

        .markdown-h1, .markdown-h2, .markdown-h3 {
          margin: 1.5rem 0 1rem 0;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .markdown-h1 {
          font-size: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .markdown-h2 {
          font-size: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.25rem;
        }

        .markdown-h3 {
          font-size: 1.125rem;
        }

        .markdown-p {
          margin: 1rem 0;
          line-height: 1.7;
        }

        .markdown-ul, .markdown-ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .markdown-li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .markdown-strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        .markdown-em {
          font-style: italic;
          color: #64748b;
        }

        .markdown-img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1rem 0;
        }

        @media (max-width: 768px) {
          .post-editor {
            max-width: 100%;
            max-height: 100vh;
            border-radius: 0;
          }

          .editor-content {
            grid-template-columns: 1fr;
          }

          .ai-assistant {
            border-left: none;
            border-top: 1px solid #e2e8f0;
            max-height: 300px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .editor-header {
            padding: 1rem;
          }

          .editor-main {
            padding: 1rem;
          }

          .editor-footer {
            padding: 1rem;
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  )
}

export default PostEditor
