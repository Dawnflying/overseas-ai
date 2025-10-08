#!/bin/bash

# 出海AI平台 - Docker镜像构建和推送脚本
# 支持多架构构建 (macOS -> Linux)

set -e

# 配置变量
REGISTRY="registry.cn-hangzhou.aliyuncs.com"
NAMESPACE="jarvis-ai"
VERSION=${1:-"latest"}
PLATFORMS="linux/amd64"

# 颜色输出
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

# 检查Docker是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker Desktop."
        exit 1
    fi
    log_success "Docker is running"
}

# 检查是否已登录阿里云镜像仓库
check_registry_login() {
    log_info "Checking registry login status..."
    if ! docker info | grep -q "registry.cn-hangzhou.aliyuncs.com"; then
        log_warning "Not logged in to Alibaba Cloud registry"
        log_info "Please login first:"
        log_info "docker login registry.cn-hangzhou.aliyuncs.com"
        read -p "Press Enter after login to continue..."
    else
        log_success "Already logged in to registry"
    fi
}

# 构建前端镜像
build_frontend() {
    log_info "Building frontend image..."
    
    cd frontend
    
    # 构建多架构镜像
    docker buildx build \
        --platform ${PLATFORMS} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-frontend:${VERSION} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-frontend:latest \
        --push \
        .
    
    log_success "Frontend image built and pushed successfully"
    cd ..
}

# 构建后端镜像
build_backend() {
    log_info "Building backend image..."
    
    cd backend
    
    # 构建多架构镜像
    docker buildx build \
        --platform ${PLATFORMS} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-backend:${VERSION} \
        --tag ${REGISTRY}/${NAMESPACE}/overseas-backend:latest \
        --push \
        .
    
    log_success "Backend image built and pushed successfully"
    cd ..
}

# 构建所有镜像
build_all() {
    log_info "Building all images..."
    
    # 构建前端
    build_frontend
    
    # 构建后端
    build_backend
    
    log_success "All images built and pushed successfully"
}

# 显示镜像信息
show_images() {
    log_info "Image information:"
    echo ""
    echo "Frontend:"
    echo "  ${REGISTRY}/${NAMESPACE}/overseas-frontend:${VERSION}"
    echo "  ${REGISTRY}/${NAMESPACE}/overseas-frontend:latest"
    echo ""
    echo "Backend:"
    echo "  ${REGISTRY}/${NAMESPACE}/overseas-backend:${VERSION}"
    echo "  ${REGISTRY}/${NAMESPACE}/overseas-backend:latest"
    echo ""
    echo "Platforms: ${PLATFORMS}"
    echo ""
}

# 清理本地镜像
cleanup_local() {
    log_info "Cleaning up local images..."
    
    # 删除本地构建的镜像
    docker rmi ${REGISTRY}/${NAMESPACE}/overseas-frontend:${VERSION} 2>/dev/null || true
    docker rmi ${REGISTRY}/${NAMESPACE}/overseas-frontend:latest 2>/dev/null || true
    docker rmi ${REGISTRY}/${NAMESPACE}/overseas-backend:${VERSION} 2>/dev/null || true
    docker rmi ${REGISTRY}/${NAMESPACE}/overseas-backend:latest 2>/dev/null || true
    
    log_success "Local images cleaned up"
}

# 主函数
main() {
    log_info "Starting Docker image build and push process..."
    log_info "Registry: ${REGISTRY}"
    log_info "Namespace: ${NAMESPACE}"
    log_info "Version: ${VERSION}"
    log_info "Platforms: ${PLATFORMS}"
    echo ""
    
    # 检查环境
    check_docker
    check_registry_login
    
    # 显示将要构建的镜像信息
    show_images
    
    # 确认构建
    read -p "Do you want to continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Build cancelled"
        exit 0
    fi
    
    # 构建镜像
    build_all
    
    # 清理本地镜像
    cleanup_local
    
    log_success "All done! Images have been pushed to registry."
    echo ""
    log_info "You can now deploy using:"
    log_info "docker pull ${REGISTRY}/${NAMESPACE}/overseas-frontend:${VERSION}"
    log_info "docker pull ${REGISTRY}/${NAMESPACE}/overseas-backend:${VERSION}"
}

# 显示帮助信息
show_help() {
    echo "Usage: $0 [VERSION]"
    echo ""
    echo "Arguments:"
    echo "  VERSION    Image version tag (default: latest)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Build with 'latest' tag"
    echo "  $0 v1.0.0            # Build with 'v1.0.0' tag"
    echo "  $0 dev                # Build with 'dev' tag"
    echo ""
    echo "Environment:"
    echo "  REGISTRY   Docker registry URL (default: registry.cn-hangzhou.aliyuncs.com)"
    echo "  NAMESPACE  Image namespace (default: jarvis-ai)"
    echo ""
}

# 处理命令行参数
case "${1:-}" in
    -h|--help)
        show_help
        exit 0
        ;;
    *)
        main
        ;;
esac
