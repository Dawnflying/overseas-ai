#!/bin/bash

# 出海AI平台部署脚本
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

# 检查Docker是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker未安装，请先安装Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose未安装，请先安装Docker Compose"
        exit 1
    fi
    
    log_success "Docker和Docker Compose检查通过"
}

# 检查端口占用
check_ports() {
    local frontend_port=80
    local backend_port=3000
    
    if lsof -Pi :$frontend_port -sTCP:LISTEN -t >/dev/null ; then
        log_warning "端口 $frontend_port 已被占用，前端服务将无法启动"
    fi
    
    if lsof -Pi :$backend_port -sTCP:LISTEN -t >/dev/null ; then
        log_warning "端口 $backend_port 已被占用，后端服务将无法启动"
    fi
}

# 构建镜像
build_images() {
    log_info "开始构建Docker镜像..."
    
    # 构建前端镜像
    log_info "构建前端镜像..."
    docker build -f Dockerfile.frontend -t overseas-ai-frontend:latest .
    
    # 构建后端镜像
    log_info "构建后端镜像..."
    cd backend
    docker build -t overseas-ai-backend:latest .
    cd ..
    
    log_success "Docker镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动出海AI平台服务..."
    
    # 使用docker-compose启动所有服务
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 10
    
    # 检查服务状态
    check_services
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    # 检查前端服务
    if curl -f http://localhost/health > /dev/null 2>&1; then
        log_success "前端服务运行正常"
    else
        log_error "前端服务启动失败"
    fi
    
    # 检查后端服务
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "后端服务运行正常"
    else
        log_error "后端服务启动失败"
    fi
}

# 停止服务
stop_services() {
    log_info "停止出海AI平台服务..."
    docker-compose down
    log_success "服务已停止"
}

# 重启服务
restart_services() {
    log_info "重启出海AI平台服务..."
    docker-compose restart
    log_success "服务已重启"
}

# 查看日志
show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        log_info "显示所有服务日志 (Ctrl+C退出)"
        docker-compose logs -f
    else
        log_info "显示 $service 服务日志 (Ctrl+C退出)"
        docker-compose logs -f $service
    fi
}

# 清理资源
cleanup() {
    log_info "清理Docker资源..."
    
    # 停止并删除容器
    docker-compose down
    
    # 删除未使用的镜像
    docker image prune -f
    
    log_success "资源清理完成"
}

# 显示服务状态
show_status() {
    log_info "服务状态:"
    docker-compose ps
    
    echo ""
    log_info "服务访问地址:"
    echo "前端服务: http://localhost"
    echo "后端API: http://localhost:3000"
    echo "健康检查: http://localhost/health"
    echo "API文档: http://localhost:3000/health"
}

# 显示使用说明
show_usage() {
    echo "出海AI平台部署脚本"
    echo ""
    echo "使用方法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  build     构建Docker镜像"
    echo "  start     启动所有服务"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    查看服务状态"
    echo "  logs [服务名] 查看日志"
    echo "  cleanup   清理Docker资源"
    echo "  deploy    完整部署（构建+启动）"
    echo ""
    echo "示例:"
    echo "  $0 deploy     # 完整部署"
    echo "  $0 logs       # 查看所有日志"
    echo "  $0 logs backend # 查看后端日志"
}

# 主函数
main() {
    local command=$1
    
    case $command in
        "build")
            check_docker
            build_images
            ;;
        "start")
            check_docker
            check_ports
            start_services
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs $2
            ;;
        "cleanup")
            cleanup
            ;;
        "deploy"|"")
            check_docker
            check_ports
            build_images
            start_services
            show_status
            ;;
        *)
            log_error "未知命令: $command"
            show_usage
            exit 1
            ;;
    esac
}

# 脚本入口
if [ "$(basename "$0")" = "deploy.sh" ]; then
    main "$@"
fi
