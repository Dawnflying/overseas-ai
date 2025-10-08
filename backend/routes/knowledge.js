const express = require('express')
const router = express.Router()
const knowledgeService = require('../services/simpleKnowledgeService')
const { authenticateToken } = require('../middleware/auth')

// 获取知识库分类
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const result = await knowledgeService.getCategories()
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('获取分类失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 搜索知识库
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, category, subcategory, tags, size, from, useVector } = req.query

    const options = {
      category,
      subcategory,
      tags: tags ? tags.split(',') : undefined,
      size: parseInt(size) || 10,
      from: parseInt(from) || 0,
      useVector: useVector !== 'false'
    }

    const result = await knowledgeService.searchKnowledge(q, options)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data,
        total: result.total,
        took: result.took
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('搜索知识库失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 获取知识条目详情
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await knowledgeService.getKnowledge(id)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('获取知识条目失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 创建知识条目
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, subcategory, tags, source, priority } = req.body
    
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        error: '标题、内容和分类不能为空'
      })
    }

    const data = {
      title,
      content,
      category,
      subcategory,
      tags: tags || [],
      source: source || 'manual',
      priority: priority || 1
    }

    const result = await knowledgeService.createKnowledge(data)
    
    if (result.success) {
      res.status(201).json({
        success: true,
        data: result.data
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('创建知识条目失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 更新知识条目
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body
    
    const result = await knowledgeService.updateKnowledge(id, updateData)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('更新知识条目失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 删除知识条目
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    
    const result = await knowledgeService.deleteKnowledge(id)
    
    if (result.success) {
      res.json({
        success: true,
        message: '删除成功'
      })
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('删除知识条目失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// RAG 问答
router.post('/rag', authenticateToken, async (req, res) => {
  try {
    const { question, context } = req.body
    
    if (!question) {
      return res.status(400).json({
        success: false,
        error: '问题不能为空'
      })
    }

    const result = await knowledgeService.ragQuery(question, context)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('RAG 问答失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

// 批量导入知识
router.post('/batch-import', authenticateToken, async (req, res) => {
  try {
    const { knowledgeList } = req.body
    
    if (!Array.isArray(knowledgeList) || knowledgeList.length === 0) {
      return res.status(400).json({
        success: false,
        error: '知识列表不能为空'
      })
    }

    const result = await knowledgeService.batchImport(knowledgeList)
    
    if (result.success) {
      res.json({
        success: true,
        data: result.data
      })
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    console.error('批量导入失败:', error)
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
    })
  }
})

module.exports = router
