// 简化版知识库服务，使用内存存储
const complianceKnowledge = require('../data/complianceKnowledge')

class SimpleKnowledgeService {
  constructor() {
    this.knowledgeBase = new Map()
    this.categories = new Set()
    this.subcategories = new Set()
    this.tags = new Set()
    
    // 初始化预置数据
    this.initPresetData()
  }

  // 初始化预置数据
  initPresetData() {
    complianceKnowledge.forEach(item => {
      this.knowledgeBase.set(item.id, {
        ...item,
        lastUpdated: new Date().toISOString(),
        status: 'active',
        priority: item.priority || 1
      })
      
      // 收集分类信息
      if (item.category) this.categories.add(item.category)
      if (item.subcategory) this.subcategories.add(item.subcategory)
      if (item.tags) {
        item.tags.forEach(tag => this.tags.add(tag))
      }
    })
    
    console.log(`✅ 知识库初始化完成，共加载 ${this.knowledgeBase.size} 条知识`)
  }

  // 获取知识库分类
  async getCategories() {
    return {
      success: true,
      data: {
        categories: Array.from(this.categories),
        subcategories: Array.from(this.subcategories),
        tags: Array.from(this.tags)
      }
    }
  }

  // 搜索知识库
  async searchKnowledge(query, options = {}) {
    try {
      const {
        category,
        subcategory,
        tags,
        size = 10,
        from = 0
      } = options

      let results = Array.from(this.knowledgeBase.values())

      // 分类过滤
      if (category) {
        results = results.filter(item => item.category === category)
      }
      if (subcategory) {
        results = results.filter(item => item.subcategory === subcategory)
      }
      if (tags && tags.length > 0) {
        results = results.filter(item => 
          item.tags && item.tags.some(tag => tags.includes(tag))
        )
      }

      // 文本搜索
      if (query) {
        const searchTerm = query.toLowerCase()
        console.log('🔍 搜索关键词:', searchTerm)
        console.log('📊 搜索前结果数量:', results.length)
        
        results = results.filter(item => {
          const titleMatch = item.title.toLowerCase().includes(searchTerm)
          const contentMatch = item.content.toLowerCase().includes(searchTerm)
          const tagMatch = item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm))
          
          if (titleMatch || contentMatch || tagMatch) {
            console.log('✅ 匹配项:', item.title, { titleMatch, contentMatch, tagMatch })
          }
          
          return titleMatch || contentMatch || tagMatch
        })
        
        console.log('📊 搜索后结果数量:', results.length)
        
        // 简单排序：标题匹配优先
        results.sort((a, b) => {
          const aTitleMatch = a.title.toLowerCase().includes(searchTerm)
          const bTitleMatch = b.title.toLowerCase().includes(searchTerm)
          if (aTitleMatch && !bTitleMatch) return -1
          if (!aTitleMatch && bTitleMatch) return 1
          return b.priority - a.priority
        })
      } else {
        // 无搜索词时按优先级和更新时间排序
        results.sort((a, b) => {
          if (b.priority !== a.priority) return b.priority - a.priority
          return new Date(b.lastUpdated) - new Date(a.lastUpdated)
        })
      }

      // 分页
      const total = results.length
      results = results.slice(from, from + size)

      return {
        success: true,
        data: results,
        total,
        took: 1
      }
    } catch (error) {
      console.error('❌ 搜索知识库失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 获取知识条目
  async getKnowledge(id) {
    try {
      const item = this.knowledgeBase.get(id)
      if (!item) {
        return { success: false, error: '知识条目不存在' }
      }
      return { success: true, data: item }
    } catch (error) {
      console.error('❌ 获取知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 创建知识条目
  async createKnowledge(data) {
    try {
      const id = data.id || `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const doc = {
        id,
        title: data.title,
        content: data.content,
        category: data.category,
        subcategory: data.subcategory,
        tags: data.tags || [],
        lastUpdated: new Date().toISOString(),
        source: data.source || 'manual',
        status: data.status || 'active',
        priority: data.priority || 1
      }

      this.knowledgeBase.set(id, doc)
      
      // 更新分类信息
      if (doc.category) this.categories.add(doc.category)
      if (doc.subcategory) this.subcategories.add(doc.subcategory)
      if (doc.tags) {
        doc.tags.forEach(tag => this.tags.add(tag))
      }

      return { success: true, id, data: doc }
    } catch (error) {
      console.error('❌ 创建知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 更新知识条目
  async updateKnowledge(id, data) {
    try {
      const existing = this.knowledgeBase.get(id)
      if (!existing) {
        return { success: false, error: '知识条目不存在' }
      }

      const updateData = {
        ...existing,
        ...data,
        lastUpdated: new Date().toISOString()
      }

      this.knowledgeBase.set(id, updateData)
      
      // 更新分类信息
      if (updateData.category) this.categories.add(updateData.category)
      if (updateData.subcategory) this.subcategories.add(updateData.subcategory)
      if (updateData.tags) {
        updateData.tags.forEach(tag => this.tags.add(tag))
      }

      return { success: true, data: updateData }
    } catch (error) {
      console.error('❌ 更新知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 删除知识条目
  async deleteKnowledge(id) {
    try {
      if (!this.knowledgeBase.has(id)) {
        return { success: false, error: '知识条目不存在' }
      }

      this.knowledgeBase.delete(id)
      return { success: true }
    } catch (error) {
      console.error('❌ 删除知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // RAG 问答
  async ragQuery(question, context = {}) {
    try {
      // 搜索相关知识
      const searchResult = await this.searchKnowledge(question, {
        size: 5
      })

      if (!searchResult.success || searchResult.data.length === 0) {
        return {
          success: false,
          error: '未找到相关知识'
        }
      }

      // 构建上下文
      const knowledgeContext = searchResult.data
        .map(item => `标题: ${item.title}\n内容: ${item.content}`)
        .join('\n\n')

      // 构建回答
      const answer = `根据知识库信息，关于"${question}"的相关内容如下：

${knowledgeContext}

以上信息仅供参考，具体操作请咨询专业机构。`

      return {
        success: true,
        data: {
          answer,
          sources: knowledgeContext,
          relatedKnowledge: searchResult.data
        }
      }
    } catch (error) {
      console.error('❌ RAG 问答失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 批量导入知识
  async batchImport(knowledgeList) {
    try {
      const results = []
      
      for (const item of knowledgeList) {
        const result = await this.createKnowledge(item)
        results.push(result)
      }

      const successCount = results.filter(r => r.success).length
      const failCount = results.length - successCount

      return {
        success: true,
        data: {
          total: results.length,
          success: successCount,
          failed: failCount,
          results
        }
      }
    } catch (error) {
      console.error('❌ 批量导入失败:', error.message)
      return { success: false, error: error.message }
    }
  }
}

module.exports = new SimpleKnowledgeService()
