import React, { useState, useEffect } from 'react';

const OverseasTraining = () => {
  const [currentModule, setCurrentModule] = useState('overview');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(() => {
    // 从localStorage加载进度
    try {
      const saved = localStorage.getItem('overseas-training-progress');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load progress from localStorage:', error);
      return [];
    }
  });
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

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
        },
        {
          id: 'quiz2',
          title: '平台搭建测验',
          duration: '5分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '选择电商平台时最重要的考虑因素是什么？',
              options: ['平台知名度', '产品类型匹配度', '注册费用', '界面美观度'],
              correct: 1
            },
            {
              id: 2,
              question: '店铺认证通常需要多长时间？',
              options: ['1-3个工作日', '3-7个工作日', '7-14个工作日', '即时完成'],
              correct: 1
            },
            {
              id: 3,
              question: '以下哪项不是店铺优化的关键要素？',
              options: ['页面加载速度', '移动端适配', '店铺注册时间', 'SEO优化'],
              correct: 2
            }
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
        },
        {
          id: 'quiz3',
          title: '产品管理测验',
          duration: '5分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '产品选择的首要标准是什么？',
              options: ['价格最低', '市场需求大', '自己喜欢', '供应商推荐'],
              correct: 1
            },
            {
              id: 2,
              question: '商品标题优化的核心是什么？',
              options: ['字数越多越好', '使用相关关键词', '全部大写', '添加表情符号'],
              correct: 1
            },
            {
              id: 3,
              question: '理想的库存周转率是？',
              options: ['越低越好', '越高越好', '保持适中', '不重要'],
              correct: 2
            },
            {
              id: 4,
              question: '产品图片优化最重要的是？',
              options: ['图片数量多', '高清晰度和多角度展示', '加水印', '统一滤镜'],
              correct: 1
            }
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
        },
        {
          id: 'quiz4',
          title: '营销推广测验',
          duration: '5分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '社媒营销最有效的平台组合是？',
              options: ['只用一个平台', '根据目标受众选择多平台', '所有平台都用', '不需要社媒'],
              correct: 1
            },
            {
              id: 2,
              question: 'SEO优化的核心目标是？',
              options: ['网站美观', '提高搜索排名', '增加页面数量', '减少加载时间'],
              correct: 1
            },
            {
              id: 3,
              question: '邮件营销的最佳发送频率是？',
              options: ['每天发送', '根据客户偏好和内容价值决定', '每月一次', '随机发送'],
              correct: 1
            },
            {
              id: 4,
              question: '付费广告投放前最重要的是？',
              options: ['预算越多越好', '明确目标受众和转化目标', '选择最贵的位置', '复制竞争对手'],
              correct: 1
            }
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
        },
        {
          id: 'quiz5',
          title: '订单履约测验',
          duration: '5分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '订单处理的首要原则是什么？',
              options: ['成本最低', '速度最快', '及时准确', '批量处理'],
              correct: 2
            },
            {
              id: 2,
              question: '选择物流方案时最应考虑的因素是？',
              options: ['价格', '时效与成本的平衡', '包装美观', '物流公司规模'],
              correct: 1
            },
            {
              id: 3,
              question: '客户服务响应时间的行业标准是？',
              options: ['1小时内', '24小时内', '48小时内', '一周内'],
              correct: 1
            },
            {
              id: 4,
              question: '处理客户投诉的最佳方式是？',
              options: ['忽略', '快速响应并提供解决方案', '推卸责任', '拖延处理'],
              correct: 1
            }
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
        },
        {
          id: 'quiz6',
          title: '数据分析测验',
          duration: '5分钟',
          type: 'quiz',
          questions: [
            {
              id: 1,
              question: '最重要的电商业务指标是？',
              options: ['访客数', '转化率', '综合分析多个指标', '页面浏览量'],
              correct: 2
            },
            {
              id: 2,
              question: '客户生命周期价值(LTV)的意义是？',
              options: ['首次购买金额', '客户长期价值预测', '客户数量', '平均订单价值'],
              correct: 1
            },
            {
              id: 3,
              question: '数据分析的最终目的是？',
              options: ['生成报表', '指导业务决策和优化', '满足老板要求', '展示给投资人'],
              correct: 1
            },
            {
              id: 4,
              question: '业务增长的可持续策略是？',
              options: ['快速扩张', '数据驱动的持续优化', '削减成本', '增加广告投入'],
              correct: 1
            }
          ]
        }
      ]
    }
  ];

  // 保存进度到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('overseas-training-progress', JSON.stringify(completedLessons));
    } catch (error) {
      console.error('Failed to save progress to localStorage:', error);
    }
  }, [completedLessons]);

  const handleLessonComplete = (moduleId, lessonId) => {
    const completedKey = `${moduleId}-${lessonId}`;
    if (!completedLessons.includes(completedKey)) {
      setCompletedLessons(prev => [...prev, completedKey]);

      // 检查是否完成所有课程
      const totalLessons = trainingModules.reduce((acc, module) => acc + module.lessons.length, 0);
      if (completedLessons.length + 1 >= totalLessons) {
        setTimeout(() => setShowCertificate(true), 1000);
      }
    }
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        animation: 'fadeIn 0.6s ease-out'
      }}>
        <div>
          <h2 style={{
            fontSize: '42px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em'
          }}>🎓 出海电商培训</h2>
          <p style={{
            color: '#64748b',
            margin: '0',
            fontSize: '18px',
            fontWeight: '500'
          }}>手把手教会初学者如何进行出海电商开店</p>
        </div>
      </div>

      {/* 学习进度 */}
      <div className="glass-effect" style={{
        borderRadius: '20px',
        padding: '32px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'fadeIn 0.7s ease-out'
      }}>
        <h3 style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '24px',
          margin: '0 0 24px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📈</span>
          <span>学习进度</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {trainingModules.map((module, index) => {
            const moduleCompleted = module.lessons.filter(lesson =>
              completedLessons.includes(`${module.id}-${lesson.id}`)
            ).length;
            const progress = (moduleCompleted / module.lessons.length) * 100;
            const gradients = ['gradient-blue', 'gradient-green', 'gradient-purple', 'gradient-orange', 'gradient-teal', 'gradient-pink'];
            const gradientClass = gradients[index % gradients.length];

            return (
              <div key={module.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '18px 20px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(226, 232, 240, 0.8)',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                animation: `slideIn ${0.4 + index * 0.1}s ease-out`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.05)';
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    background: progress === 100
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #e0e7ff 0%, #f3f4f6 100%)'
                  }}>
                    {module.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                      {module.title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {moduleCompleted}/{module.lessons.length} 课程完成
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '120px',
                    height: '10px',
                    backgroundColor: '#e2e8f0',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                  }}>
                    <div className={`progress-bar ${progress === 100 ? '' : gradientClass}`} style={{
                      width: `${progress}%`,
                      height: '100%',
                      background: progress === 100
                        ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                        : undefined,
                      borderRadius: '10px'
                    }} />
                  </div>
                  <span style={{
                    fontSize: '14px',
                    color: '#475569',
                    minWidth: '45px',
                    fontWeight: '600'
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
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {trainingModules.map((module, index) => {
          const gradients = [
            'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)',
            'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
          ];
          const gradient = gradients[index % gradients.length];

          return (
            <div
              key={module.id}
              onClick={() => setCurrentModule(module.id)}
              className="training-card"
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '0',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
                cursor: 'pointer',
                animationDelay: `${index * 0.1}s`
              }}
            >
              <div style={{
                height: '8px',
                background: gradient,
                width: '100%'
              }} />

              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: gradient,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                    flexShrink: 0
                  }}>
                    {module.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: '#1e293b',
                      marginBottom: '8px',
                      margin: '0 0 8px 0',
                      letterSpacing: '-0.01em'
                    }}>{module.title}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#64748b',
                      margin: '0',
                      lineHeight: '1.5'
                    }}>{module.description}</p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '16px',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    <span>📚</span>
                    <span>{module.lessons.length} 个课程</span>
                  </div>
                  <button style={{
                    padding: '10px 20px',
                    background: gradient,
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '600',
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0, 0, 0, 0.1)';
                  }}>
                    开始学习
                  </button>
                </div>
              </div>
            </div>
          );
        })}
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
            }}>🎯 {lesson.strategies ? '营销策略' : '增长策略'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lesson.strategies ? lesson.strategies.map((strategy, index) => (
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
                  }}>{typeof strategy === 'string' ? strategy : strategy.name}</h5>
                  {typeof strategy === 'object' && strategy.description && (
                    <>
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
                    </>
                  )}
                </div>
              )) : null}
            </div>
          </div>
        );

      case 'workflow':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🔄 工作流程</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.workflow && lesson.workflow.map((step, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    flex: 1,
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: '500'
                  }}>
                    {step}
                  </div>
                  {index < lesson.workflow.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '28px',
                      bottom: '-12px',
                      width: '2px',
                      height: '12px',
                      backgroundColor: '#d1d5db'
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'logistics':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🚚 物流方案对比</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {lesson.options && lesson.options.map((option, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '2px solid #e5e7eb'
                }}>
                  <h5 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>{option.name}</h5>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#10b981',
                      marginBottom: '6px'
                    }}>✓ 优势</div>
                    {option.advantages.map((adv, idx) => (
                      <div key={idx} style={{
                        fontSize: '13px',
                        color: '#374151',
                        paddingLeft: '12px',
                        marginBottom: '4px'
                      }}>• {adv}</div>
                    ))}
                  </div>
                  <div>
                    <div style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: '#ef4444',
                      marginBottom: '6px'
                    }}>✗ 劣势</div>
                    {option.disadvantages.map((dis, idx) => (
                      <div key={idx} style={{
                        fontSize: '13px',
                        color: '#374151',
                        paddingLeft: '12px',
                        marginBottom: '4px'
                      }}>• {dis}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'service':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🎯 最佳实践</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.bestPractices && lesson.bestPractices.map((practice, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  backgroundColor: '#ecfdf5',
                  borderRadius: '8px',
                  border: '1px solid #10b981'
                }}>
                  <span style={{
                    fontSize: '20px',
                    flexShrink: 0
                  }}>✓</span>
                  <div style={{
                    fontSize: '14px',
                    color: '#065f46',
                    fontWeight: '500'
                  }}>
                    {practice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>📊 关键指标</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {lesson.metrics && lesson.metrics.map((category, index) => (
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
                    marginBottom: '12px',
                    margin: '0 0 12px 0'
                  }}>{category.name}</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '8px' }}>
                    {category.metrics.map((metric, idx) => (
                      <div key={idx} style={{
                        padding: '8px 12px',
                        backgroundColor: '#ffffff',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '13px',
                        color: '#374151',
                        textAlign: 'center'
                      }}>
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'optimization':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>⚡ 优化领域</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {lesson.optimizationAreas && lesson.optimizationAreas.map((area, index) => (
                <div key={index} style={{
                  padding: '16px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  border: '2px solid #f59e0b',
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#92400e',
                  fontWeight: '500'
                }}>
                  {area}
                </div>
              ))}
            </div>
          </div>
        );

      case 'automation':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🤖 自动化活动</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {lesson.campaigns && lesson.campaigns.map((campaign, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  backgroundColor: '#eff6ff',
                  borderRadius: '8px',
                  border: '1px solid #3b82f6'
                }}>
                  <span style={{
                    fontSize: '20px',
                    flexShrink: 0
                  }}>📧</span>
                  <div style={{
                    fontSize: '14px',
                    color: '#1e40af',
                    fontWeight: '500'
                  }}>
                    {campaign}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'technical':
        return (
          <div>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>🔧 技术要点</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lesson.techniques && lesson.techniques.map((technique, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '12px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb'
                }}>
                  <span style={{
                    fontSize: '18px',
                    flexShrink: 0
                  }}>▸</span>
                  <div style={{
                    fontSize: '14px',
                    color: '#374151',
                    lineHeight: '1.5'
                  }}>
                    {technique}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'guide':
      case 'interactive':
      case 'analysis':
      case 'system':
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

  const renderCertificate = () => {
    if (!showCertificate) return null;

    const currentDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '48px',
          width: '100%',
          maxWidth: '700px',
          textAlign: 'center',
          position: 'relative',
          border: '8px solid',
          borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{
            fontSize: '48px',
            marginBottom: '20px',
            animation: 'pulse 2s infinite'
          }}>🎓</div>

          <h2 style={{
            fontSize: '36px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '12px',
            margin: '0 0 12px 0',
            letterSpacing: '-0.02em'
          }}>完成证书</h2>

          <p style={{
            fontSize: '18px',
            color: '#64748b',
            marginBottom: '32px',
            margin: '0 0 32px 0'
          }}>恭喜你完成所有培训课程！</p>

          <div style={{
            padding: '32px',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            marginBottom: '32px'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#475569',
              marginBottom: '16px',
              lineHeight: '1.8'
            }}>
              兹证明
            </div>
            <div style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>
              学员
            </div>
            <div style={{
              fontSize: '16px',
              color: '#475569',
              lineHeight: '1.8',
              marginBottom: '20px'
            }}>
              已成功完成
              <br />
              <strong style={{ color: '#1e293b', fontSize: '18px' }}>出海电商培训全部课程</strong>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px',
              marginTop: '24px'
            }}>
              {trainingModules.map((module, index) => (
                <div key={module.id} style={{
                  padding: '12px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{module.icon}</div>
                  <div style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {module.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{
            fontSize: '14px',
            color: '#94a3b8',
            marginBottom: '24px'
          }}>
            颁发日期: {currentDate}
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => setShowCertificate(false)}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.4)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.4)';
              }}
            >
              太好了！
            </button>
            <button
              onClick={() => {
                // 重置进度
                if (window.confirm('确定要重置学习进度吗？')) {
                  setCompletedLessons([]);
                  setShowCertificate(false);
                  setCurrentModule('overview');
                }
              }}
              style={{
                padding: '14px 32px',
                backgroundColor: '#ffffff',
                color: '#64748b',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.color = '#475569';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              重新学习
            </button>
          </div>
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

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          @keyframes shimmer {
            0% {
              background-position: -1000px 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          .training-card {
            animation: fadeIn 0.5s ease-out;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .training-card:hover {
            transform: translateY(-8px);
          }

          .lesson-item {
            animation: slideIn 0.4s ease-out;
            transition: all 0.2s ease;
          }

          .progress-bar {
            transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .gradient-blue {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .gradient-green {
            background: linear-gradient(135deg, #5ee7df 0%, #b490ca 100%);
          }

          .gradient-purple {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          }

          .gradient-orange {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          }

          .gradient-teal {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          }

          .gradient-pink {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.18);
          }
        `}
      </style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
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

          {/* 完成证书 */}
          {renderCertificate()}
        </div>
      </div>
    </>
  );
};

export default OverseasTraining;
