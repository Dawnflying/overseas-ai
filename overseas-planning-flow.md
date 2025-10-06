# 出海规划详细流程设计

## 1. 流程概述

### 1.1 触发方式
- **网页按钮**: 点击"开始出海规划"按钮
- **AI助手**: 在AI对话中输入"开始出海规划"
- **结果**: 左侧网页动态生成表单流程，最终生成详细任务表

### 1.2 流程特点
- **流式生成**: 逐步显示表单，基于前一步选择动态调整后续问题
- **智能引导**: 根据用户输入实时调整推荐和建议
- **进度可视化**: 显示当前进度和剩余步骤
- **实时预览**: 在填写过程中实时预览生成的规划

## 2. 详细流程步骤

### 2.1 第一阶段：基础信息收集

#### 步骤1：业务概况
```javascript
表单字段：
- 公司/个人名称
- 主营行业（下拉选择：电子产品、服装服饰、家居用品、美妆个护、食品饮料、其他）
- 当前业务规模（单选：初创团队、中小规模、成熟企业）
- 年营业额范围（下拉选择）
- 团队规模（单选）
```

#### 步骤2：产品信息
```javascript
表单字段：
- 主要产品类型（多选）
- 产品单价范围（单选）
- 产品特性（多选：易碎、高价值、大件、标准品等）
- 是否有品牌（单选）
- 产品认证情况（多选：CE、FDA、RoHS等）
```

### 2.2 第二阶段：目标市场选择

#### 步骤3：市场偏好
```javascript
表单字段：
- 意向市场区域（多选：东南亚、欧洲、北美、中东、南美、其他）
- 市场优先级排序（拖拽排序）
- 市场了解程度（单选：完全不了解、略有了解、比较熟悉）
```

#### 步骤4：市场筛选条件
```javascript
表单字段：
- 目标客单价范围（单选）
- 物流时效要求（单选：7天内、15天内、30天内）
- 市场竞争程度偏好（单选：蓝海市场、竞争适中、红海市场）
- 政策环境要求（多选：政策稳定、税收优惠、贸易便利）
```

### 2.3 第三阶段：能力评估

#### 步骤5：资金能力
```javascript
表单字段：
- 可用于出海的资金规模（单选）
- 风险承受能力（单选：保守型、稳健型、进取型）
- 投资回报期望（单选：短期见效、中长期回报）
```

#### 步骤6：团队能力
```javascript
表单字段：
- 是否有外贸经验（单选）
- 外语能力（多选：英语、日语、德语、法语、西班牙语等）
- 技术能力（多选：电商平台操作、数字营销、数据分析）
- 是否需要外部支持（多选：物流、支付、营销、客服）
```

### 2.4 第四阶段：具体规划

#### 步骤7：时间规划
```javascript
表单字段：
- 期望启动时间（日期选择）
- 项目周期（单选：3个月、6个月、1年、2年）
- 阶段性目标（多选：市场测试、规模扩张、品牌建设）
```

#### 步骤8：资源投入
```javascript
表单字段：
- 人员投入计划（单选）
- 预算分配比例（滑块：市场调研、产品准备、物流建设、营销推广）
- 关键里程碑设置（自定义输入）
```

## 3. 动态表单生成逻辑

### 3.1 条件分支逻辑
```javascript
// 示例：基于行业选择动态调整后续问题
if (行业 === '电子产品') {
    显示字段：['产品认证', '电压适配', '售后支持']
} else if (行业 === '食品饮料') {
    显示字段：['食品认证', '保质期', '存储条件']
}

// 示例：基于市场规模动态调整预算建议
if (业务规模 === '初创团队') {
    推荐预算范围：'5-20万'
    建议市场：'东南亚、中东'
} else if (业务规模 === '成熟企业') {
    推荐预算范围：'50-200万'  
    建议市场：'欧洲、北美'
}
```

### 3.2 智能推荐算法
```javascript
// 市场匹配度计算
function calculateMarketMatch(userProfile, marketData) {
    const weights = {
        行业匹配度: 0.3,
        价格匹配度: 0.25,
        物流匹配度: 0.2,
        政策匹配度: 0.15,
        文化匹配度: 0.1
    };
    
    return Object.keys(weights).reduce((score, key) => {
        return score + (userProfile[key] * marketData[key] * weights[key]);
    }, 0);
}
```

## 4. 规划任务表生成

### 4.1 任务表结构
```javascript
const planningTasks = {
    阶段1: {
        name: "市场调研与准备",
        时间: "第1-2周",
        任务: [
            {
                id: "T1-1",
                name: "目标市场深度分析",
                负责人: "市场团队",
                截止时间: "第1周末",
                依赖任务: [],
                状态: "待开始"
            },
            {
                id: "T1-2", 
                name: "竞品分析报告",
                负责人: "产品团队",
                截止时间: "第2周中",
                依赖任务: ["T1-1"],
                状态: "待开始"
            }
        ]
    },
    阶段2: {
        name: "产品与合规",
        时间: "第3-6周",
        任务: [
            // 具体任务列表
        ]
    },
    // 更多阶段...
};
```

### 4.2 任务智能生成逻辑
```javascript
function generateTasks(userInput) {
    const tasks = [];
    
    // 基于用户选择生成定制化任务
    if (userInput.目标市场.includes('欧洲')) {
        tasks.push({
            name: "CE认证申请",
            描述: "完成产品CE认证流程",
            预计耗时: "4-6周",
            关键节点: "认证机构选择 → 样品准备 → 测试 → 证书获取"
        });
    }
    
    if (userInput.产品特性.includes('易碎')) {
        tasks.push({
            name: "定制化包装方案",
            描述: "设计适合易碎产品的包装方案",
            预计耗时: "2-3周",
            关键节点: "包装设计 → 样品测试 → 批量生产"
        });
    }
    
    return tasks;
}
```

## 5. 前端实现方案

### 5.1 组件结构
```javascript
// 主要组件
- PlanningWizard (主向导组件)
  - ProgressIndicator (进度指示器)
  - DynamicForm (动态表单组件)
  - TaskPreview (任务预览组件)
  - FinalPlan (最终规划展示)
```

### 5.2 状态管理
```javascript
// 规划状态
const planningState = {
    currentStep: 1,
    totalSteps: 8,
    userInput: {},
    generatedTasks: [],
    isGenerating: false
};
```

### 5.3 交互流程
```javascript
// 用户交互序列
1. 用户点击"开始出海规划"
2. 显示第一步表单（业务概况）
3. 用户填写 → 验证 → 下一步
4. 基于用户选择动态生成下一步表单
5. 重复直到完成所有步骤
6. 生成完整任务表并展示
7. 提供导出、分享、修改功能
```

## 6. 与AI助手集成

### 6.1 AI对话触发
```javascript
// AI助手识别规划意图
function detectPlanningIntent(userMessage) {
    const keywords = ['出海规划', '开始规划', '制定计划', '出海步骤'];
    return keywords.some(keyword => userMessage.includes(keyword));
}

// 触发规划流程
function startPlanningFromAI() {
    // 关闭AI侧边栏
    hideAIAssistant();
    // 在主页面启动规划向导
    startPlanningWizard();
}
```

### 6.2 AI辅助填写
```javascript
// AI基于对话历史预填表单
function prefillFormFromAIConversation(conversationHistory) {
    const extractedInfo = extractBusinessInfo(conversationHistory);
    return {
        行业: extractedInfo.industry,
        目标市场: extractedInfo.targetMarkets,
        // 其他预填字段
    };
}
```

## 7. 数据持久化与恢复

### 7.1 本地存储
```javascript
// 保存规划进度
function savePlanningProgress(state) {
    localStorage.setItem('overseasPlanning', JSON.stringify(state));
}

// 恢复规划进度
function restorePlanningProgress() {
    const saved = localStorage.getItem('overseasPlanning');
    return saved ? JSON.parse(saved) : null;
}
```

### 7.2 断点续传
```javascript
// 用户中途离开后恢复
function resumePlanning() {
    const progress = restorePlanningProgress();
    if (progress) {
        showResumeDialog(progress);
    }
}
```

这个流程设计确保了出海规划的系统性、个性化和实用性，为用户提供真正有价值的出海指导。
