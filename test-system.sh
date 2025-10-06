#!/bin/bash

# 出海AI平台系统测试脚本
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 测试后端服务
test_backend() {
    log_info "测试后端API服务..."
    
    # 测试健康检查
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "后端健康检查通过"
    else
        log_error "后端健康检查失败"
        return 1
    fi
    
    # 测试AI聊天API
    local ai_response=$(curl -s -X POST http://localhost:3000/ai/chat \
        -H "Content-Type: application/json" \
        -d '{"message": "测试消息"}' | jq -r '.response')
    
    if [ -n "$ai_response" ]; then
        log_success "AI聊天API测试通过"
        echo "AI回复: $ai_response"
    else
        log_error "AI聊天API测试失败"
        return 1
    fi
    
    # 测试出海规划API
    local planning_response=$(curl -s -X POST http://localhost:3000/api/planning \
        -H "Content-Type: application/json" \
        -d '{
            "companyName": "测试公司",
            "industry": "electronics",
            "businessScale": "startup",
            "productTypes": ["consumer"],
            "targetMarkets": ["southeastAsia"]
        }' | jq -r '.success')
    
    if [ "$planning_response" = "true" ]; then
        log_success "出海规划API测试通过"
    else
        log_error "出海规划API测试失败"
        return 1
    fi
    
    # 测试市场分析API
    local analysis_response=$(curl -s "http://localhost:3000/api/market-analysis?market=southeastAsia&industry=electronics" | jq -r '.market')
    
    if [ "$analysis_response" = "southeastAsia" ]; then
        log_success "市场分析API测试通过"
    else
        log_error "市场分析API测试失败"
        return 1
    fi
}

# 测试前端服务
test_frontend() {
    log_info "测试前端服务..."
    
    # 测试主页面
    if curl -f http://localhost:8000 > /dev/null 2>&1; then
        log_success "前端主页面访问正常"
    else
        log_error "前端主页面访问失败"
        return 1
    fi
    
    # 测试AI平台页面
    if curl -f http://localhost:8000/ai-platform-index.html > /dev/null 2>&1; then
        log_success "AI平台页面访问正常"
    else
        log_error "AI平台页面访问失败"
        return 1
    fi
    
    # 测试静态资源
    if curl -f http://localhost:8000/styles.css > /dev/null 2>&1; then
        log_success "CSS资源访问正常"
    else
        log_warning "CSS资源访问失败（可能是预期行为）"
    fi
}

# 测试API集成
test_api_integration() {
    log_info "测试API集成..."
    
    # 测试前端能否调用后端API
    local test_result=$(curl -s -X POST http://localhost:3000/ai/chat \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:8000" \
        -d '{"message": "集成测试"}' | jq -r '.conversationId')
    
    if [ -n "$test_result" ]; then
        log_success "API跨域调用测试通过"
    else
        log_error "API跨域调用测试失败"
        return 1
    fi
}

# 显示系统状态
show_system_status() {
    log_info "系统状态概览:"
    
    echo ""
    echo "服务状态:"
    echo "  后端API: $(curl -s http://localhost:3000/health | jq -r '.status')"
    echo "  前端服务: $(if curl -f http://localhost:8000 > /dev/null 2>&1; then echo "运行中"; else echo "未运行"; fi)"
    
    echo ""
    echo "访问地址:"
    echo "  前端网站: http://localhost:8000"
    echo "  后端API: http://localhost:3000"
    echo "  AI平台: http://localhost:8000/ai-platform-index.html"
    
    echo ""
    echo "API端点:"
    echo "  健康检查: http://localhost:3000/health"
    echo "  AI聊天: http://localhost:3000/ai/chat"
    echo "  出海规划: http://localhost:3000/api/planning"
    echo "  市场分析: http://localhost:3000/api/market-analysis"
}

# 主测试函数
main() {
    log_info "开始系统测试..."
    
    # 检查依赖
    if ! command -v jq &> /dev/null; then
        log_error "请先安装 jq: brew install jq"
        exit 1
    fi
    
    # 执行测试
    if test_backend && test_frontend && test_api_integration; then
        log_success "🎉 所有测试通过！系统运行正常"
        show_system_status
    else
        log_error "❌ 部分测试失败，请检查服务状态"
        exit 1
    fi
}

# 脚本入口
if [ "$(basename "$0")" = "test-system.sh" ]; then
    main "$@"
fi
