const OpenAI = require('openai')
const DatabaseService = require('./databaseService')

// OpenAI 客户端配置
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com'
})

// 初始化数据库服务
const dbService = new DatabaseService()

class KnowledgeService {
  constructor() {
    // MySQL 不需要初始化索引，表结构通过迁移脚本创建
  }

  // 生成文本向量嵌入
  async generateEmbedding(text) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
      })
      return response.data[0].embedding
    } catch (error) {
      console.error('❌ 生成向量嵌入失败:', error.message)
      // 返回模拟向量，避免阻塞功能
      return Array(1536).fill(0).map(() => Math.random())
    }
  }

  // 创建知识条目
  async createKnowledge(data) {
    try {
      const knowledgeData = {
        title: data.title,
        content: data.content,
        summary: data.summary,
        category: data.category,
        tags: data.tags || [],
        source: data.source || 'manual',
        language: data.language || 'zh-CN',
        isPublic: data.isPublic !== undefined ? data.isPublic : true,
        userId: data.userId || null
      }

      const knowledge = await dbService.createKnowledge(knowledgeData)
      return { success: true, id: knowledge.id, data: knowledge }
    } catch (error) {
      console.error('❌ 创建知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 获取知识条目
  async getKnowledge(id) {
    try {
      const knowledge = await dbService.getKnowledgeById(id)
      if (!knowledge) {
        return { success: false, error: '知识条目不存在' }
      }
      return { success: true, data: knowledge }
    } catch (error) {
      console.error('❌ 获取知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 更新知识条目
  async updateKnowledge(id, data) {
    try {
      const existing = await this.getKnowledge(id)
      if (!existing.success) {
        return existing
      }

      const updateData = {
        ...data,
        updatedAt: new Date()
      }

      const updated = await dbService.updateKnowledge(id, updateData)
      if (!updated) {
        return { success: false, error: '更新失败' }
      }

      const updatedKnowledge = await this.getKnowledge(id)
      return { success: true, data: updatedKnowledge.data }
    } catch (error) {
      console.error('❌ 更新知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 删除知识条目
  async deleteKnowledge(id) {
    try {
      const deleted = await dbService.deleteKnowledge(id)
      if (!deleted) {
        return { success: false, error: '知识条目不存在' }
      }
      return { success: true }
    } catch (error) {
      console.error('❌ 删除知识条目失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 搜索知识库
  async searchKnowledge(query, options = {}) {
    try {
      const {
        category,
        language,
        isPublic,
        userId,
        page = 1,
        limit = 10
      } = options

      const searchParams = {
        query,
        category,
        language,
        isPublic,
        userId,
        page,
        limit
      }

      const result = await dbService.searchKnowledge(searchParams)
      
      return {
        success: true,
        data: result.data,
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      }
    } catch (error) {
      console.error('❌ 搜索知识库失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // 获取知识库分类
  async getCategories() {
    try {
      // 使用 MySQL 查询获取分类信息
      const { KnowledgeBase } = require('../models')
      const { Op } = require('sequelize')
      
      const [categories, tags] = await Promise.all([
        KnowledgeBase.findAll({
          attributes: ['category'],
          where: {
            category: { [Op.ne]: null }
          },
          group: ['category'],
          raw: true
        }),
        KnowledgeBase.findAll({
          attributes: ['tags'],
          where: {
            tags: { [Op.ne]: null }
          },
          raw: true
        })
      ])

      const categoryList = [...new Set(categories.map(c => c.category).filter(Boolean))]
      const tagList = [...new Set(tags.flatMap(t => t.tags || []).filter(Boolean))]

      return {
        success: true,
        data: {
          categories: categoryList,
          tags: tagList
        }
      }
    } catch (error) {
      console.error('❌ 获取分类失败:', error.message)
      return { success: false, error: error.message }
    }
  }

  // RAG 问答
  async ragQuery(question, context = {}) {
    try {
      // 搜索相关知识
      const searchResult = await this.searchKnowledge(question, {
        size: 5,
        useVector: true
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

      // 构建提示词
      const systemPrompt = `你是一个专业的出海合规顾问。请基于以下知识库内容回答用户问题：

知识库内容：
${knowledgeContext}

请用专业、准确的语言回答用户问题，并引用相关知识来源。如果知识库中没有相关信息，请明确说明。`

      // 调用 AI 生成回答
      const response = await openai.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.3,
        max_tokens: 1000
      })

      return {
        success: true,
        data: {
          answer: response.choices[0].message.content,
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

module.exports = new KnowledgeService()
