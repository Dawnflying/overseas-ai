#!/bin/bash

# 测试构建脚本 - 仅构建不推送

set -e

# 配置变量
REGISTRY="registry.cn-hangzhou.aliyuncs.com"
NAMESPACE="jarvis-ai"
VERSION=${1:-"latest"}
PLATFORMS="linux/amd64"

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# 构建前端镜像 (仅构建，不推送)
build_frontend() {
    log_info "Building frontend image (no push)..."
    
    cd frontend
    
    docker buildx build \
        --platform ${PLATFORMS} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-frontend:${VERSION} \
        --load \
        .
    
    log_success "Frontend image built successfully"
    cd ..
}

# 构建后端镜像 (仅构建，不推送)
build_backend() {
    log_info "Building backend image (no push)..."
    
    cd backend
    
    docker buildx build \
        --platform ${PLATFORMS} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-backend:${VERSION} \
        --load \
        .
    
    log_success "Backend image built successfully"
    cd ..
}

# 主函数
main() {
    log_info "Testing Docker image build process..."
    log_info "Registry: ${REGISTRY}"
    log_info "Namespace: ${NAMESPACE}"
    log_info "Version: ${VERSION}"
    log_info "Platforms: ${PLATFORMS}"
    echo ""
    
    # 构建镜像
    build_frontend
    build_backend
    
    log_success "Test build completed!"
    echo ""
    log_info "Built images:"
    docker images | grep "${REGISTRY}/${NAMESPACE}"
}

main
