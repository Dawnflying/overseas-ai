#!/bin/bash

# Elasticsearch 向量检索镜像构建和推送脚本
# 简化版本 - 仅构建和推送 Elasticsearch

set -e

# 配置变量
REGISTRY="registry.cn-hangzhou.aliyuncs.com/jarvis-ai"
ELASTICSEARCH_VERSION="8.13.0"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行"
        exit 1
    fi
    log_info "Docker 检查通过"
}

# 登录阿里云
login_registry() {
    log_info "请登录阿里云镜像仓库..."
    read -p "用户名: " username
    read -s -p "密码: " password
    echo
    
    if echo "$password" | docker login --username="$username" --password-stdin "$REGISTRY"; then
        log_info "登录成功"
    else
        log_error "登录失败"
        exit 1
    fi
}

# 构建镜像
build_image() {
    log_info "开始构建 Elasticsearch 向量检索镜像..."
    
    if [ ! -d "build/elasticsearch" ]; then
        log_error "build/elasticsearch 目录不存在"
        exit 1
    fi
    
    cd build/elasticsearch
    log_info "正在构建镜像（这可能需要几分钟）..."
    
    if docker build -t "${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}" .; then
        log_info "✅ 镜像构建成功！"
        cd ../..
        return 0
    else
        log_error "镜像构建失败"
        cd ../..
        exit 1
    fi
}

# 推送镜像
push_image() {
    log_info "开始推送镜像到阿里云..."
    
    if docker push "${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}"; then
        log_info "✅ 镜像推送成功！"
        return 0
    else
        log_error "镜像推送失败"
        exit 1
    fi
}

# 显示使用说明
show_usage() {
    echo ""
    log_info "✅ 所有操作完成！"
    echo ""
    echo "镜像信息："
    echo "  - ${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}"
    echo ""
    echo "使用方法："
    echo "1. 更新 docker-compose.yml 中的 Elasticsearch 镜像地址"
    echo "2. 启动服务："
    echo "   ./start.sh start elasticsearch"
    echo ""
    echo "3. 检查服务状态："
    echo "   ./start.sh status"
    echo ""
    echo "4. 查看日志："
    echo "   ./start.sh logs elasticsearch"
    echo ""
}

# 主函数
main() {
    log_info "=== Elasticsearch 向量检索镜像构建工具 ==="
    echo ""
    
    check_docker
    login_registry
    build_image
    push_image
    show_usage
    
    log_info "🎉 完成！"
}

# 运行
main "$@"
