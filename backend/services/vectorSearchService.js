const { Client } = require('@elastic/elasticsearch');
const config = require('../config');

class VectorSearchService {
  constructor() {
    this.client = new Client({
      node: config.elasticsearch?.url || 'http://localhost:9200',
      auth: config.elasticsearch?.auth,
      requestTimeout: 30000,
      maxRetries: 3,
      resurrectStrategy: 'ping'
    });
    
    this.indexPrefix = config.elasticsearch?.indexPrefix || 'vector_';
    this.vectorDimension = config.elasticsearch?.vectorDimension || 768;
  }

  /**
   * 创建向量索引
   * @param {string} indexName - 索引名称
   * @param {number} vectorDims - 向量维度
   * @param {Object} customMapping - 自定义映射
   */
  async createVectorIndex(indexName, vectorDims = this.vectorDimension, customMapping = {}) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    
    const defaultMapping = {
      properties: {
        content: {
          type: 'text',
          analyzer: 'chinese_analyzer',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256
            }
          }
        },
        embedding: {
          type: 'dense_vector',
          dims: vectorDims,
          index: true,
          similarity: 'cosine'
        },
        metadata: {
          type: 'object',
          properties: {
            source: { type: 'keyword' },
            timestamp: { type: 'date' },
            language: { type: 'keyword' },
            category: { type: 'keyword' }
          }
        },
        title: {
          type: 'text',
          analyzer: 'chinese_analyzer'
        },
        tags: {
          type: 'keyword'
        },
        created_at: {
          type: 'date'
        },
        updated_at: {
          type: 'date'
        }
      }
    };

    // 合并自定义映射
    const finalMapping = this.mergeDeep(defaultMapping, customMapping);

    try {
      const response = await this.client.indices.create({
        index: fullIndexName,
        body: {
          settings: {
            number_of_shards: 1,
            number_of_replicas: 0,
            'index.knn': true,
            'index.knn.algo_param.ef_search': 100,
            'index.knn.algo_param.ef_construction': 128,
            'index.knn.algo_param.m': 16,
            analysis: {
              analyzer: {
                chinese_analyzer: {
                  type: 'smartcn'
                },
                icu_analyzer: {
                  type: 'icu'
                }
              }
            }
          },
          mappings: finalMapping
        }
      });

      console.log(`索引 ${fullIndexName} 创建成功`);
      return response;
    } catch (error) {
      if (error.meta?.statusCode === 400 && error.meta?.body?.error?.type === 'resource_already_exists_exception') {
        console.log(`索引 ${fullIndexName} 已存在`);
        return { acknowledged: true };
      }
      throw error;
    }
  }

  /**
   * 添加文档到向量索引
   * @param {string} indexName - 索引名称
   * @param {string} id - 文档ID
   * @param {Object} document - 文档内容
   */
  async addDocument(indexName, id, document) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    
    const doc = {
      ...document,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    try {
      const response = await this.client.index({
        index: fullIndexName,
        id: id,
        body: doc
      });

      return response;
    } catch (error) {
      console.error('添加文档失败:', error);
      throw error;
    }
  }

  /**
   * 批量添加文档
   * @param {string} indexName - 索引名称
   * @param {Array} documents - 文档数组
   */
  async bulkAddDocuments(indexName, documents) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    const body = [];

    documents.forEach(doc => {
      body.push({
        index: {
          _index: fullIndexName,
          _id: doc.id
        }
      });
      
      body.push({
        ...doc,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    });

    try {
      const response = await this.client.bulk({ body });
      
      if (response.errors) {
        console.warn('批量添加部分文档失败');
        console.log(response.items.filter(item => item.index.error));
      }
      
      return response;
    } catch (error) {
      console.error('批量添加文档失败:', error);
      throw error;
    }
  }

  /**
   * 向量相似度搜索
   * @param {string} indexName - 索引名称
   * @param {Array} queryVector - 查询向量
   * @param {Object} options - 搜索选项
   */
  async vectorSearch(indexName, queryVector, options = {}) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    
    const {
      k = 10,
      numCandidates = 100,
      filter = null,
      fields = ['*'],
      size = 10
    } = options;

    const searchBody = {
      knn: {
        field: 'embedding',
        query_vector: queryVector,
        k: numCandidates,
        num_candidates: numCandidates
      },
      size: size,
      _source: fields
    };

    // 添加过滤器
    if (filter) {
      searchBody.knn.filter = filter;
    }

    try {
      const response = await this.client.search({
        index: fullIndexName,
        body: searchBody
      });

      return response.body.hits;
    } catch (error) {
      console.error('向量搜索失败:', error);
      throw error;
    }
  }

  /**
   * 混合搜索（向量搜索 + 文本搜索）
   * @param {string} indexName - 索引名称
   * @param {Array} queryVector - 查询向量
   * @param {string} queryText - 查询文本
   * @param {Object} options - 搜索选项
   */
  async hybridSearch(indexName, queryVector, queryText, options = {}) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;
    
    const {
      k = 10,
      numCandidates = 100,
      filter = null,
      fields = ['*'],
      size = 10,
      vectorWeight = 0.7,
      textWeight = 0.3
    } = options;

    const searchBody = {
      size: size,
      _source: fields,
      query: {
        bool: {
          should: [
            {
              knn: {
                field: 'embedding',
                query_vector: queryVector,
                k: numCandidates,
                num_candidates: numCandidates,
                boost: vectorWeight
              }
            },
            {
              multi_match: {
                query: queryText,
                fields: ['content^2', 'title^1.5'],
                boost: textWeight
              }
            }
          ]
        }
      }
    };

    // 添加过滤器
    if (filter) {
      searchBody.query.bool.filter = filter;
    }

    try {
      const response = await this.client.search({
        index: fullIndexName,
        body: searchBody
      });

      return response.body.hits;
    } catch (error) {
      console.error('混合搜索失败:', error);
      throw error;
    }
  }

  /**
   * 删除文档
   * @param {string} indexName - 索引名称
   * @param {string} id - 文档ID
   */
  async deleteDocument(indexName, id) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    try {
      const response = await this.client.delete({
        index: fullIndexName,
        id: id
      });

      return response;
    } catch (error) {
      console.error('删除文档失败:', error);
      throw error;
    }
  }

  /**
   * 删除索引
   * @param {string} indexName - 索引名称
   */
  async deleteIndex(indexName) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    try {
      const response = await this.client.indices.delete({
        index: fullIndexName
      });

      console.log(`索引 ${fullIndexName} 删除成功`);
      return response;
    } catch (error) {
      console.error('删除索引失败:', error);
      throw error;
    }
  }

  /**
   * 获取索引信息
   * @param {string} indexName - 索引名称
   */
  async getIndexInfo(indexName) {
    const fullIndexName = `${this.indexPrefix}${indexName}`;

    try {
      const response = await this.client.indices.get({
        index: fullIndexName
      });

      return response.body[fullIndexName];
    } catch (error) {
      console.error('获取索引信息失败:', error);
      throw error;
    }
  }

  /**
   * 深度合并对象
   * @param {Object} target - 目标对象
   * @param {Object} source - 源对象
   */
  mergeDeep(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.mergeDeep(target[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      const response = await this.client.cluster.health();
      return {
        status: response.body.status,
        nodes: response.body.number_of_nodes,
        dataNodes: response.body.number_of_data_nodes
      };
    } catch (error) {
      console.error('Elasticsearch 健康检查失败:', error);
      throw error;
    }
  }
}

module.exports = VectorSearchService;
