// 预置的出海合规知识库数据
const complianceKnowledge = [
  // CE认证相关
  {
    id: 'kb_ce_certification',
    title: 'CE认证要求',
    content: `CE认证是欧盟市场的强制性认证，涉及电子、玩具、灯具、机械等产品。

认证要求：
• 产品符合性声明
• 技术文件准备
• 欧盟授权代表 (2025年新要求)

申请流程：
1. 准备材料和文件
2. 选择认证机构
3. 提交申请
4. 获得CE证书

时间周期：4-8周
费用范围：5000-50000元

注意事项：
• 2025年起必须由欧盟境内授权代表签署
• 不同产品类别有不同的认证要求
• 需要定期更新认证`,
    category: 'compliance',
    subcategory: 'product-safety',
    tags: ['欧盟', 'CE认证', '电子产品', '强制性', '2025新规'],
    source: 'official',
    priority: 3
  },

  // UL报告
  {
    id: 'kb_ul_report',
    title: 'UL报告要求',
    content: `UL报告是亚马逊等平台强制要求的安全证明，主要针对美国市场。

适用范围：
• 电子产品
• 家用电器
• 照明设备
• 电源适配器

申请要求：
• 产品安全测试
• 符合UL标准
• 提供技术文件
• 工厂检查

申请流程：
1. 提交产品样品
2. 进行安全测试
3. 通过工厂检查
4. 获得UL报告

时间周期：2-4周
费用范围：3000-15000元

注意事项：
• 亚马逊等平台强制要求
• 需要定期更新
• 工厂检查是必须环节`,
    category: 'compliance',
    subcategory: 'product-safety',
    tags: ['美国', 'UL报告', '亚马逊', '电子产品', '安全认证'],
    source: 'platform',
    priority: 3
  },

  // FCC认证
  {
    id: 'kb_fcc_certification',
    title: 'FCC认证要求',
    content: `FCC认证是电子产品电磁兼容性认证，适用于美国市场。

适用范围：
• 无线设备
• 数字设备
• 射频设备
• 蓝牙设备

认证类型：
• FCC ID (无线设备)
• FCC DOC (数字设备)
• FCC VER (验证设备)

申请流程：
1. 准备技术文件
2. 进行电磁兼容测试
3. 提交FCC申请
4. 获得FCC认证

时间周期：1-3周
费用范围：2000-8000元

注意事项：
• 无线设备需要FCC ID
• 数字设备需要FCC DOC
• 测试必须在FCC认可实验室进行`,
    category: 'compliance',
    subcategory: 'product-safety',
    tags: ['美国', 'FCC认证', '电子产品', '电磁兼容', '无线设备'],
    source: 'official',
    priority: 2
  },

  // CPC证书
  {
    id: 'kb_cpc_certificate',
    title: 'CPC证书要求',
    content: `CPC证书是儿童产品证书，所有在美国销售的儿童产品必须提供。

适用范围：
• 12岁以下儿童产品
• 玩具
• 儿童服装
• 儿童家具

申请要求：
• 产品安全测试
• 符合CPSC标准
• 提供技术文件
• 工厂检查

申请流程：
1. 确定产品适用标准
2. 进行安全测试
3. 准备技术文件
4. 获得CPC证书

时间周期：1-2周
费用范围：1000-5000元

注意事项：
• 所有儿童产品必须提供
• 需要符合CPSC标准
• 测试必须在认可实验室进行
• 需要定期更新`,
    category: 'compliance',
    subcategory: 'product-safety',
    tags: ['美国', 'CPC证书', '儿童产品', '玩具', 'CPSC标准'],
    source: 'official',
    priority: 3
  },

  // REACH法规
  {
    id: 'kb_reach_regulation',
    title: 'REACH法规要求',
    content: `REACH法规是欧盟化学品注册、评估、授权和限制法规。

适用范围：
• 电子产品
• 玩具
• 化工产品
• 纺织品

主要要求：
• 化学品注册
• 风险评估
• 限制物质清单
• 授权物质清单

合规流程：
1. 确定产品中的化学品
2. 检查限制物质清单
3. 进行风险评估
4. 准备合规文件

时间周期：2-6周
费用范围：5000-20000元

注意事项：
• 限制物质清单定期更新
• 需要专业的化学品评估
• 违规后果严重
• 建议寻求专业机构帮助`,
    category: 'compliance',
    subcategory: 'chemical-control',
    tags: ['欧盟', 'REACH法规', '化学品', '限制物质', '风险评估'],
    source: 'official',
    priority: 2
  },

  // ROHS指令
  {
    id: 'kb_rohs_directive',
    title: 'ROHS指令要求',
    content: `ROHS指令限制电子电气设备中的有害物质使用。

限制物质：
• 铅 (Pb)
• 汞 (Hg)
• 镉 (Cd)
• 六价铬 (Cr6+)
• 多溴联苯 (PBB)
• 多溴二苯醚 (PBDE)

适用范围：
• 电子电气设备
• 家用电器
• 照明设备
• 玩具

合规要求：
• 产品中限制物质含量不超过规定限值
• 提供ROHS合规声明
• 进行材料检测
• 准备技术文件

检测方法：
• XRF检测
• 化学分析
• 材料声明

注意事项：
• 限值要求严格
• 需要定期检测
• 违规后果严重
• 建议建立供应链管理体系`,
    category: 'compliance',
    subcategory: 'chemical-control',
    tags: ['欧盟', 'ROHS指令', '有害物质', '电子产品', '限制物质'],
    source: 'official',
    priority: 2
  },

  // 进出口经营权
  {
    id: 'kb_import_export_license',
    title: '进出口经营权申请',
    content: `进出口经营权是企业合法出口商品的基础资质。

申请条件：
• 企业法人资格
• 注册资本要求
• 经营范围包含进出口
• 无违法违规记录

申请材料：
• 企业营业执照
• 组织机构代码证
• 税务登记证
• 银行开户许可证
• 法定代表人身份证

申请流程：
1. 准备申请材料
2. 提交商务部门
3. 审核通过
4. 获得进出口经营权

办理时间：5-10个工作日
费用：免费

注意事项：
• 是出口业务的基础资质
• 需要定期年检
• 违规可能被吊销
• 建议提前办理`,
    category: 'compliance',
    subcategory: 'trade-compliance',
    tags: ['中国', '进出口经营权', '出口资质', '基础要求', '免费办理'],
    source: 'official',
    priority: 3
  },

  // 出口许可证
  {
    id: 'kb_export_license',
    title: '出口许可证申请',
    content: `2025年有43种货物需要申请出口许可证。

需要许可证的货物：
• 稀土及其制品
• 部分金属制品
• 化工产品
• 农产品
• 纺织品

申请条件：
• 具有进出口经营权
• 产品符合出口要求
• 无违法违规记录
• 提供相关证明文件

申请材料：
• 出口许可证申请表
• 产品技术资料
• 质量证明文件
• 环保证明文件
• 其他相关证明

申请流程：
1. 确定产品是否需要许可证
2. 准备申请材料
3. 提交商务部门
4. 审核通过
5. 获得出口许可证

办理时间：10-20个工作日
费用：根据产品类型确定

注意事项：
• 2025年新增43种货物
• 需要提前申请
• 有效期通常为1年
• 违规后果严重`,
    category: 'compliance',
    subcategory: 'trade-compliance',
    tags: ['中国', '出口许可证', '2025新规', '43种货物', '稀土'],
    source: 'official',
    priority: 3
  },

  // 出口退税
  {
    id: 'kb_export_tax_refund',
    title: '出口退税申请',
    content: `出口退税是企业重要的利润来源，符合条件的企业可以申请。

申请条件：
• 一般纳税人
• 合规办理出口手续
• 产品符合退税要求
• 无违法违规记录

退税范围：
• 增值税
• 消费税
• 关税

申请材料：
• 出口货物报关单
• 出口发票
• 增值税专用发票
• 出口收汇核销单
• 其他相关证明

申请流程：
1. 办理出口手续
2. 收集退税材料
3. 提交税务部门
4. 审核通过
5. 获得退税

办理时间：15-30个工作日
退税率：根据产品类型确定

注意事项：
• 是重要的利润来源
• 需要合规操作
• 避免"买单出口"
• 建议寻求专业帮助`,
    category: 'compliance',
    subcategory: 'trade-compliance',
    tags: ['中国', '出口退税', '增值税', '利润来源', '合规操作'],
    source: 'official',
    priority: 2
  },

  // 买单出口风险
  {
    id: 'kb_buy_export_risk',
    title: '买单出口风险警示',
    content: `自2025年10月1日起，国家严厉打击"买单出口"行为。

什么是买单出口：
• 通过他人资质报关
• 不申报真实货主信息
• 逃避税务监管
• 违规操作行为

风险后果：
• 补缴企业所得税
• 面临税务处罚
• 影响企业信用
• 可能承担刑事责任

合规要求：
• 使用自己公司资质报关
• 申报真实货主信息
• 合规办理出口手续
• 建立完善财务体系

建议措施：
• 办理进出口经营权
• 建立合规出口流程
• 寻求专业机构帮助
• 定期培训员工

注意事项：
• 2025年10月1日起严格执行
• 违规后果严重
• 建议尽早规范
• 合规是长期趋势`,
    category: 'compliance',
    subcategory: 'trade-compliance',
    tags: ['中国', '买单出口', '2025新规', '税务风险', '合规要求'],
    source: 'official',
    priority: 3
  },

  // 亚马逊平台规则
  {
    id: 'kb_amazon_rules',
    title: '亚马逊平台合规要求',
    content: `亚马逊平台对卖家有严格的合规要求，违规可能导致账户被封。

主要要求：
• 产品安全认证
• 知识产权保护
• 产品质量标准
• 客户服务标准

认证要求：
• CE认证 (欧盟)
• UL报告 (美国)
• FCC认证 (电子产品)
• CPC证书 (儿童产品)

违规后果：
• 产品下架
• 账户暂停
• 资金冻结
• 永久封号

合规建议：
• 提前办理认证
• 建立质量体系
• 定期检查合规
• 寻求专业帮助

注意事项：
• 平台规则经常更新
• 需要持续关注
• 违规后果严重
• 建议建立合规体系`,
    category: 'market-analysis',
    subcategory: 'platform-rules',
    tags: ['亚马逊', '平台规则', '合规要求', '产品认证', '账户安全'],
    source: 'platform',
    priority: 3
  },

  // TikTok Shop规则
  {
    id: 'kb_tiktok_shop_rules',
    title: 'TikTok Shop平台规则',
    content: `TikTok Shop是新兴的电商平台，有自己的合规要求。

主要特点：
• 年轻用户群体
• 短视频营销
• 直播带货
• 社交电商

合规要求：
• 产品安全认证
• 内容合规
• 知识产权保护
• 客户服务标准

认证要求：
• CE认证 (欧盟)
• FCC认证 (电子产品)
• CPC证书 (儿童产品)
• 其他地区认证

营销规则：
• 内容真实性
• 避免虚假宣传
• 遵守广告法
• 保护消费者权益

注意事项：
• 平台规则在完善中
• 需要持续关注
• 违规后果严重
• 建议建立合规体系`,
    category: 'market-analysis',
    subcategory: 'platform-rules',
    tags: ['TikTok Shop', '平台规则', '短视频营销', '直播带货', '社交电商'],
    source: 'platform',
    priority: 2
  },

  // 欧盟市场分析
  {
    id: 'kb_eu_market_analysis',
    title: '欧盟市场分析',
    content: `欧盟是全球重要的消费市场，对产品质量要求严格。

市场特点：
• 消费水平高
• 质量要求严格
• 环保意识强
• 法规完善

主要国家：
• 德国
• 法国
• 意大利
• 西班牙
• 荷兰

合规要求：
• CE认证
• REACH法规
• ROHS指令
• 包装指令
• 能效标签

市场机会：
• 高品质产品
• 环保产品
• 创新产品
• 个性化产品

注意事项：
• 法规要求严格
• 需要专业认证
• 违规后果严重
• 建议寻求专业帮助`,
    category: 'market-analysis',
    subcategory: 'regulations',
    tags: ['欧盟', '市场分析', '消费市场', '质量要求', '环保意识'],
    source: 'official',
    priority: 2
  },

  // 美国市场分析
  {
    id: 'kb_us_market_analysis',
    title: '美国市场分析',
    content: `美国是全球最大的消费市场，对产品安全要求严格。

市场特点：
• 市场规模大
• 消费能力强
• 质量要求高
• 法规完善

主要平台：
• 亚马逊
• eBay
• Walmart
• Target
• Best Buy

合规要求：
• UL报告
• FCC认证
• CPC证书
• 产品安全标准
• 知识产权保护

市场机会：
• 电子产品
• 家居用品
• 服装配饰
• 健康美容
• 运动户外

注意事项：
• 认证要求严格
• 需要专业认证
• 违规后果严重
• 建议建立合规体系`,
    category: 'market-analysis',
    subcategory: 'regulations',
    tags: ['美国', '市场分析', '消费市场', '产品安全', '认证要求'],
    source: 'official',
    priority: 2
  },

  // 合规流程管理
  {
    id: 'kb_compliance_process',
    title: '合规流程管理',
    content: `建立完善的合规流程是企业出海成功的关键。

流程步骤：
1. 市场调研
2. 合规分析
3. 认证申请
4. 质量管控
5. 持续监控

关键环节：
• 产品设计阶段
• 生产制造阶段
• 质量检测阶段
• 出口报关阶段
• 售后服务阶段

管理体系：
• 合规团队
• 流程制度
• 培训体系
• 监控机制
• 应急预案

工具支持：
• 合规管理系统
• 认证跟踪系统
• 质量检测系统
• 风险预警系统

注意事项：
• 需要全员参与
• 持续改进优化
• 定期培训更新
• 建立应急预案`,
    category: 'operations',
    subcategory: 'compliance-process',
    tags: ['合规流程', '管理体系', '质量管控', '风险预警', '持续改进'],
    source: 'best-practices',
    priority: 2
  },

  // 风险防控
  {
    id: 'kb_risk_control',
    title: '出海风险防控',
    content: `出海业务面临多种风险，需要建立完善的风险防控体系。

主要风险：
• 合规风险
• 质量风险
• 财务风险
• 市场风险
• 运营风险

防控措施：
• 合规管理体系
• 质量管控体系
• 财务监控体系
• 市场分析体系
• 运营管理体系

预警机制：
• 风险识别
• 风险评估
• 风险预警
• 应急响应
• 持续改进

工具支持：
• 风险管理系统
• 监控预警系统
• 应急响应系统
• 数据分析系统

注意事项：
• 需要全员参与
• 持续监控预警
• 及时响应处理
• 定期评估改进`,
    category: 'operations',
    subcategory: 'risk-control',
    tags: ['风险防控', '合规风险', '质量风险', '预警机制', '应急响应'],
    source: 'best-practices',
    priority: 2
  },

  // 最佳实践
  {
    id: 'kb_best_practices',
    title: '出海最佳实践',
    content: `总结成功企业的出海经验，形成最佳实践指南。

成功要素：
• 合规先行
• 质量为本
• 服务至上
• 创新驱动
• 持续改进

关键策略：
• 市场细分
• 产品差异化
• 品牌建设
• 渠道多元化
• 客户关系管理

实施步骤：
1. 市场调研
2. 合规准备
3. 产品开发
4. 渠道建设
5. 品牌推广
6. 客户服务

成功案例：
• 华为全球化
• 小米国际化
• 字节跳动出海
• 拼多多海外
• 腾讯游戏出海

注意事项：
• 因地制宜
• 循序渐进
• 持续学习
• 团队建设
• 风险管控`,
    category: 'operations',
    subcategory: 'best-practices',
    tags: ['最佳实践', '成功要素', '关键策略', '实施步骤', '成功案例'],
    source: 'best-practices',
    priority: 1
  }
]

module.exports = complianceKnowledge
