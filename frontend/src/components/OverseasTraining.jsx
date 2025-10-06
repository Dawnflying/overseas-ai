import React, { useState, useEffect } from 'react';

const OverseasTraining = () => {
  const [currentModule, setCurrentModule] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);

  // 培训模块数据
  const trainingModules = [
    {
      id: 'overview',
      title: '出海电商概览',
      icon: '🌍',
      description: '了解出海电商的基本概念和市场机会',
      lessons: [
        {
          id: 'intro',
          title: '什么是出海电商',
          duration: '5分钟',
          type: 'video',
          content: '出海电商是指中国企业通过互联网平台，将商品销售到海外市场的商业模式。它包括B2C跨境电商、B2B外贸电商等多种形式。',
          videoUrl: 'https://example.com/video1',
          keyPoints: [
            '出海电商的定义和概念',
            '与传统外贸的区别',
            '主要商业模式',
            '市场规模和增长趋势'
          ]
        },
        {
          id: 'market-analysis',
          title: '海外市场分析',
          duration: '8分钟',
          type: 'interactive',
          content: '了解不同海外市场的特点、消费习惯和法规要求，选择合适的目标市场。',
          keyPoints: [
            '主要海外市场特点',
            '消费者行为分析',
            '法律法规要求',
            '市场进入策略'
          ]
        },
        {
          id: 'quiz1',
          title: '基础知识测验',
          duration: '3分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '出海电商的主要优势是什么？',
              options: ['成本低', '市场大', '门槛低', '以上都是'],
              correct: 3
            },
            {
              id: 2,
              question: '以下哪个不是主要的出海电商平台？',
              options: ['Amazon', 'eBay', '淘宝', 'Shopify'],
              correct: 2
            }
          ]
        }
      ]
    },
    {
      id: 'platform-setup',
      title: '平台搭建',
      icon: '🏗️',
      description: '选择合适的电商平台并完成基础搭建',
      lessons: [
        {
          id: 'platform-selection',
          title: '平台选择策略',
          duration: '10分钟',
          type: 'guide',
          content: '根据产品类型、目标市场和预算选择合适的电商平台。',
          keyPoints: [
            '主流平台对比分析',
            '平台选择标准',
            '成本预算规划',
            '平台注册流程'
          ]
        },
        {
          id: 'store-setup',
          title: '店铺基础设置',
          duration: '15分钟',
          type: 'step-by-step',
          content: '完成店铺注册、基础信息填写和认证流程。',
          steps: [
            '注册账号并验证邮箱',
            '完善店铺基础信息',
            '上传营业执照等证件',
            '设置支付和物流信息',
            '完成店铺认证'
          ]
        },
        {
          id: 'store-optimization',
          title: '店铺优化技巧',
          duration: '12分钟',
          type: 'tips',
          content: '优化店铺页面、提升用户体验和转化率。',
          tips: [
            '店铺logo和banner设计',
            '产品分类和导航设置',
            '页面加载速度优化',
            '移动端适配',
            'SEO优化基础'
          ]
        }
      ]
    },
    {
      id: 'product-management',
      title: '产品管理',
      icon: '📦',
      description: '产品选择、上架和库存管理',
      lessons: [
        {
          id: 'product-selection',
          title: '产品选择策略',
          duration: '12分钟',
          type: 'analysis',
          content: '如何选择适合海外市场的产品，进行市场调研和竞品分析。',
          keyPoints: [
            '市场调研方法',
            '竞品分析技巧',
            '产品差异化策略',
            '价格定位方法',
            '供应链管理'
          ]
        },
        {
          id: 'listing-optimization',
          title: '商品页面优化',
          duration: '18分钟',
          type: 'detailed-guide',
          content: '创建高质量的商品页面，包括标题、描述、图片和关键词优化。',
          sections: [
            {
              title: '标题优化',
              content: '使用相关关键词，突出产品特点，符合平台规则'
            },
            {
              title: '产品描述',
              content: '详细描述产品特点、使用方法和注意事项'
            },
            {
              title: '图片优化',
              content: '高质量产品图片，多角度展示，符合平台要求'
            },
            {
              title: '关键词策略',
              content: '研究目标市场关键词，提升搜索排名'
            }
          ]
        },
        {
          id: 'inventory-management',
          title: '库存管理',
          duration: '10分钟',
          type: 'system',
          content: '建立高效的库存管理系统，避免缺货和积压。',
          keyPoints: [
            '库存预测方法',
            '安全库存设置',
            '补货时机把握',
            '库存周转优化',
            '滞销品处理'
          ]
        }
      ]
    },
    {
      id: 'marketing-promotion',
      title: '营销推广',
      icon: '📈',
      description: '制定营销策略，提升店铺流量和销量',
      lessons: [
        {
          id: 'marketing-strategy',
          title: '营销策略制定',
          duration: '15分钟',
          type: 'strategy',
          content: '制定适合海外市场的营销策略，包括内容营销、社媒营销等。',
          strategies: [
            {
              name: '社媒营销',
              description: '利用Facebook、Instagram等平台推广产品',
              platforms: ['Facebook', 'Instagram', 'TikTok', 'YouTube']
            },
            {
              name: '内容营销',
              description: '创建有价值的内容吸引目标客户',
              types: ['博客文章', '视频教程', '产品评测', '使用指南']
            },
            {
              name: '付费广告',
              description: '通过Google Ads、Facebook Ads等付费推广',
              platforms: ['Google Ads', 'Facebook Ads', 'Amazon PPC']
            }
          ]
        },
        {
          id: 'seo-optimization',
          title: 'SEO优化',
          duration: '20分钟',
          type: 'technical',
          content: '提升店铺和产品在搜索引擎中的排名。',
          techniques: [
            '关键词研究和选择',
            '页面优化技巧',
            '链接建设策略',
            '本地SEO优化',
            '技术SEO检查'
          ]
        },
        {
          id: 'email-marketing',
          title: '邮件营销',
          duration: '12分钟',
          type: 'automation',
          content: '建立邮件营销系统，维护客户关系。',
          campaigns: [
            '欢迎邮件序列',
            '产品推荐邮件',
            '购物车放弃挽回',
            '客户反馈收集',
            '节日促销邮件'
          ]
        }
      ]
    },
    {
      id: 'order-fulfillment',
      title: '订单履约',
      icon: '🚚',
      description: '订单处理、物流配送和客户服务',
      lessons: [
        {
          id: 'order-processing',
          title: '订单处理流程',
          duration: '10分钟',
          type: 'workflow',
          content: '建立高效的订单处理流程，确保及时发货。',
          workflow: [
            '订单接收和确认',
            '库存检查和预留',
            '包装和贴标',
            '物流信息录入',
            '客户通知发送'
          ]
        },
        {
          id: 'shipping-logistics',
          title: '物流配送',
          duration: '15分钟',
          type: 'logistics',
          content: '选择合适的物流方案，控制配送成本和时间。',
          options: [
            {
              name: '邮政小包',
              advantages: ['成本低', '覆盖广'],
              disadvantages: ['时效慢', '追踪难']
            },
            {
              name: '商业快递',
              advantages: ['时效快', '服务好'],
              disadvantages: ['成本高', '限制多']
            },
            {
              name: '专线物流',
              advantages: ['性价比高', '时效稳定'],
              disadvantages: ['覆盖有限', '灵活性差']
            }
          ]
        },
        {
          id: 'customer-service',
          title: '客户服务',
          duration: '12分钟',
          type: 'service',
          content: '提供优质的客户服务，提升客户满意度。',
          bestPractices: [
            '快速响应客户咨询',
            '多语言客服支持',
            '退换货政策制定',
            '客户反馈收集',
            '售后服务跟进'
          ]
        }
      ]
    },
    {
      id: 'analytics-optimization',
      title: '数据分析与优化',
      icon: '📊',
      description: '数据分析、业绩监控和持续优化',
      lessons: [
        {
          id: 'data-analytics',
          title: '数据分析基础',
          duration: '15分钟',
          type: 'analytics',
          content: '学会分析关键业务指标，优化经营决策。',
          metrics: [
            {
              name: '流量指标',
              metrics: ['访客数', '页面浏览量', '跳出率', '停留时间']
            },
            {
              name: '转化指标',
              metrics: ['转化率', '客单价', '复购率', '客户生命周期价值']
            },
            {
              name: '运营指标',
              metrics: ['库存周转率', '订单履约率', '客户满意度', '退货率']
            }
          ]
        },
        {
          id: 'performance-optimization',
          title: '业绩优化',
          duration: '18分钟',
          type: 'optimization',
          content: '基于数据分析结果，持续优化店铺运营。',
          optimizationAreas: [
            '产品页面优化',
            '价格策略调整',
            '营销活动优化',
            '供应链改进',
            '客户体验提升'
          ]
        },
        {
          id: 'growth-strategy',
          title: '增长策略',
          duration: '20分钟',
          type: 'strategy',
          content: '制定长期增长策略，扩大业务规模。',
          strategies: [
            '新市场开拓',
            '产品线扩展',
            '品牌建设',
            '合作伙伴发展',
            '技术创新应用'
          ]
        }
      ]
    }
  ];

  const handleLessonComplete = (moduleId, lessonId) => {
    const completedKey = `${moduleId}-${lessonId}`;
    setCompletedLessons(prev => [...prev, completedKey]);
  };

  const handleQuizSubmit = (answers) => {
    setQuizAnswers(answers);
    // 计算分数
    const currentModuleData = trainingModules.find(m => m.id === currentModule);
    const quizLesson = currentModuleData?.lessons.find(l => l.type === 'quiz');
    
    if (quizLesson) {
      let score = 0;
      quizLesson.questions.forEach(q => {
        if (answers[q.id] === q.correct) {
          score++;
        }
      });
      setQuizScore(score);
      handleLessonComplete(currentModule, quizLesson.id);
    }
    setShowQuiz(false);
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🎓 出海电商培训</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>手把手教会初学者如何进行出海电商开店</p>
        </div>
      </div>

      {/* 学习进度 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>📈 学习进度</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {trainingModules.map((module) => {
            const moduleCompleted = module.lessons.filter(lesson => 
              completedLessons.includes(`${module.id}-${lesson.id}`)
            ).length;
            const progress = (moduleCompleted / module.lessons.length) * 100;
            
            return (
              <div key={module.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>{module.icon}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {module.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {moduleCompleted}/{module.lessons.length} 课程完成
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '100px',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${progress}%`,
                      height: '100%',
                      backgroundColor: progress === 100 ? '#10b981' : '#3b82f6',
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '12px',
                    color: '#6b7280',
                    minWidth: '40px'
                  }}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 培训模块 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {trainingModules.map((module) => (
          <div
            key={module.id}
            onClick={() => setCurrentModule(module.id)}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(59, 130, 246, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {module.icon}
              </div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '4px',
                  margin: '0 0 4px 0'
                }}>{module.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>{module.description}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontSize: '12px',
                color: '#6b7280'
              }}>
                {module.lessons.length} 个课程
              </span>
              <button style={{
                padding: '6px 12px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                开始学习
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModuleContent = () => {
    const module = trainingModules.find(m => m.id === currentModule);
    if (!module) return null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>{module.icon} {module.title}</h2>
            <p style={{ color: '#6b7280', margin: '0' }}>{module.description}</p>
          </div>
          <button
            onClick={() => setCurrentModule('overview')}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#111827';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            ← 返回概览
          </button>
        </div>

        {/* 课程列表 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {module.lessons.map((lesson, index) => {
            const isCompleted = completedLessons.includes(`${currentModule}-${lesson.id}`);
            const isCurrent = index === currentLesson;
            
            return (
              <div
                key={lesson.id}
                onClick={() => setCurrentLesson(index)}
                style={{
                  backgroundColor: isCurrent ? '#eff6ff' : '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  border: isCurrent ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = '#3b82f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrent) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : '#f3f4f6',
                      color: isCompleted || isCurrent ? '#ffffff' : '#6b7280',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      fontWeight: '500'
                    }}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#111827',
                        marginBottom: '4px',
                        margin: '0 0 4px 0'
                      }}>{lesson.title}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>{lesson.duration}</span>
                        <span style={{
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: '500',
                          borderRadius: '4px',
                          backgroundColor: '#f3f4f6',
                          color: '#374151'
                        }}>
                          {lesson.type === 'video' ? '视频' : 
                           lesson.type === 'interactive' ? '互动' :
                           lesson.type === 'quiz' ? '测验' :
                           lesson.type === 'guide' ? '指南' :
                           lesson.type === 'step-by-step' ? '步骤' :
                           lesson.type === 'tips' ? '技巧' :
                           lesson.type === 'analysis' ? '分析' :
                           lesson.type === 'detailed-guide' ? '详细指南' :
                           lesson.type === 'system' ? '系统' :
                           lesson.type === 'strategy' ? '策略' :
                           lesson.type === 'technical' ? '技术' :
                           lesson.type === 'automation' ? '自动化' :
                           lesson.type === 'workflow' ? '流程' :
                           lesson.type === 'logistics' ? '物流' :
                           lesson.type === 'service' ? '服务' :
                           lesson.type === 'analytics' ? '分析' :
                           lesson.type === 'optimization' ? '优化' : '其他'}
                        </span>
                        {isCompleted && (
                          <span style={{
                            fontSize: '12px',
                            color: '#10b981',
                            fontWeight: '500'
                          }}>
                            已完成
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px 12px',
                    backgroundColor: isCurrent ? '#3b82f6' : '#f3f4f6',
                    color: isCurrent ? '#ffffff' : '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {isCurrent ? '学习中' : '开始'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 当前课程内容 */}
        {module.lessons[currentLesson] && (
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>{module.lessons[currentLesson].title}</h3>
            
            <div style={{
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
              marginBottom: '20px'
            }}>
              {module.lessons[currentLesson].content}
            </div>

            {/* 根据课程类型渲染不同内容 */}
            {renderLessonContent(module.lessons[currentLesson])}

            {/* 完成按钮 */}
            <div style={{
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              {currentLesson > 0 && (
                <button
                  onClick={() => setCurrentLesson(currentLesson - 1)}
                  style={{
                    padding: '12px 24px',
                    color: '#6b7280',
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  上一课
                </button>
              )}
              
              {module.lessons[currentLesson].type === 'quiz' ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  开始测验
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleLessonComplete(currentModule, module.lessons[currentLesson].id);
                    if (currentLesson < module.lessons.length - 1) {
                      setCurrentLesson(currentLesson + 1);
                    }
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  {currentLesson < module.lessons.length - 1 ? '完成并继续' : '完成课程'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderLessonContent = (lesson) => {
    switch (lesson.type) {
      case 'video':
        return (
          <div>
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '16px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>🎥 视频课程</h4>
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#e5e7eb',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6b7280',
                fontSize: '14px'
              }}>
                视频播放器 (模拟)
              </div>
            </div>
            
            {lesson.keyPoints && (
              <div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '12px',
                  margin: '0 0 12px 0'
                }}>📝 关键要点</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {lesson.keyPoints.map((point, index) => (
                    <li key={index} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      padding: '8px 0',
                      fontSize: '14px',
                      color: '#374151'
                    }}>
                      <span style={{
                        color: '#3b82f6',
                        fontWeight: 'bold'
                      }}>•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'step-by-step':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>📋 操作步骤</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.steps.map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '500',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'tips':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>💡 实用技巧</h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '12px'
            }}>
              {lesson.tips.map((tip, index) => (
                <div key={index} style={{
                  padding: '12px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '1px solid #f59e0b',
                  fontSize: '14px',
                  color: '#92400e'
                }}>
                  💡 {tip}
                </div>
              ))}
            </div>
          </div>
        );

      case 'detailed-guide':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>📖 详细指南</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lesson.sections.map((section, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>{section.title}</h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.5',
                    margin: '0'
                  }}>{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'strategy':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🎯 营销策略</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lesson.strategies.map((strategy, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h5 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>{strategy.name}</h5>
                  <p style={{
                    fontSize: '14px',
                    color: '#374151',
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>{strategy.description}</p>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(strategy.platforms || strategy.types || []).map((item, idx) => (
                      <span key={idx} style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        backgroundColor: '#eff6ff',
                        color: '#1e40af',
                        borderRadius: '4px'
                      }}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return lesson.keyPoints ? (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>📝 关键要点</h4>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {lesson.keyPoints.map((point, index) => (
                <li key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#374151'
                }}>
                  <span style={{
                    color: '#3b82f6',
                    fontWeight: 'bold'
                  }}>•</span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ) : null;
    }
  };

  const renderQuizModal = () => {
    const module = trainingModules.find(m => m.id === currentModule);
    const quizLesson = module?.lessons.find(l => l.type === 'quiz');
    
    if (!quizLesson) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              margin: '0'
            }}>
              📝 {quizLesson.title}
            </h3>
            <button
              onClick={() => setShowQuiz(false)}
              style={{
                color: '#9ca3af',
                padding: '8px',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ×
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {quizLesson.questions.map((question) => (
              <div key={question.id} style={{
                padding: '20px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>{question.question}</h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {question.options.map((option, index) => (
                    <label key={index} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 12px',
                      backgroundColor: '#ffffff',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={index}
                        style={{ margin: 0 }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => setShowQuiz(false)}
              style={{
                padding: '12px 24px',
                color: '#6b7280',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              取消
            </button>
            <button
              onClick={() => {
                // 这里应该收集答案并提交
                const answers = {};
                quizLesson.questions.forEach(q => {
                  const selected = document.querySelector(`input[name="question_${q.id}"]:checked`);
                  answers[q.id] = selected ? parseInt(selected.value) : -1;
                });
                handleQuizSubmit(answers);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              提交答案
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuizResult = () => {
    if (quizScore === null) return null;

    const module = trainingModules.find(m => m.id === currentModule);
    const quizLesson = module?.lessons.find(l => l.type === 'quiz');
    const totalQuestions = quizLesson?.questions.length || 0;
    const percentage = Math.round((quizScore / totalQuestions) * 100);

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '32px',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            {percentage >= 80 ? '🎉' : percentage >= 60 ? '👍' : '📚'}
          </div>
          
          <h3 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>
            {percentage >= 80 ? '恭喜完成！' : percentage >= 60 ? '不错的表现！' : '继续努力！'}
          </h3>
          
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            您的得分：{quizScore}/{totalQuestions} ({percentage}%)
          </p>

          <div style={{
            backgroundColor: percentage >= 80 ? '#f0fdf4' : percentage >= 60 ? '#fef3c7' : '#fef2f2',
            border: `1px solid ${percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#dc2626'}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <p style={{
              fontSize: '14px',
              color: percentage >= 80 ? '#166534' : percentage >= 60 ? '#92400e' : '#991b1b',
              margin: '0'
            }}>
              {percentage >= 80 ? '您已经掌握了这个模块的核心知识！' : 
               percentage >= 60 ? '您基本掌握了这个模块的内容。' : 
               '建议重新学习这个模块的内容。'}
            </p>
          </div>

          <button
            onClick={() => {
              setQuizScore(null);
              setQuizAnswers({});
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              width: '100%'
            }}
          >
            继续学习
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {currentModule === 'overview' && renderOverview()}
          {currentModule !== 'overview' && renderModuleContent()}
          
          {/* 测验模态框 */}
          {showQuiz && renderQuizModal()}
          
          {/* 测验结果 */}
          {quizScore !== null && renderQuizResult()}
        </div>
      </div>
    </>
  );
};

export default OverseasTraining;
