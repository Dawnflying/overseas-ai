#!/usr/bin/env node

/**
 * 知识库初始化脚本
 * 用于导入预置的合规知识库数据
 */

const knowledgeService = require('../services/knowledgeService')
const complianceKnowledge = require('../data/complianceKnowledge')

async function initKnowledgeBase() {
  console.log('🚀 开始初始化知识库...')
  
  try {
    // 检查知识库是否已有数据
    const searchResult = await knowledgeService.searchKnowledge('test', { size: 1 })
    
    if (searchResult.success && searchResult.data.length > 0) {
      console.log('⚠️  知识库已有数据，跳过初始化')
      return
    }

    // 批量导入预置数据
    console.log('📚 导入预置合规知识库数据...')
    const result = await knowledgeService.batchImport(complianceKnowledge)
    
    if (result.success) {
      console.log('✅ 知识库初始化成功!')
      console.log(`📊 导入统计:`)
      console.log(`   - 总计: ${result.data.total} 条`)
      console.log(`   - 成功: ${result.data.success} 条`)
      console.log(`   - 失败: ${result.data.failed} 条`)
      
      if (result.data.failed > 0) {
        console.log('❌ 失败的条目:')
        result.data.results
          .filter(r => !r.success)
          .forEach(r => console.log(`   - ${r.error}`))
      }
    } else {
      console.error('❌ 知识库初始化失败:', result.error)
    }
  } catch (error) {
    console.error('❌ 初始化过程中发生错误:', error.message)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initKnowledgeBase()
    .then(() => {
      console.log('🎉 知识库初始化完成')
      process.exit(0)
    })
    .catch(error => {
      console.error('💥 初始化失败:', error)
      process.exit(1)
    })
}

module.exports = initKnowledgeBase
