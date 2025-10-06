#!/bin/bash

# 出海AI平台本地启动脚本
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

# 检查Node.js是否安装
check_node() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js未安装，请先安装Node.js"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm未安装，请先安装npm"
        exit 1
    fi
    
    log_success "Node.js和npm检查通过"
    log_info "Node.js版本: $(node --version)"
    log_info "npm版本: $(npm --version)"
}

# 检查端口占用
check_ports() {
    local backend_port=3000
    local frontend_port=8000
    
    if lsof -Pi :$backend_port -sTCP:LISTEN -t >/dev/null ; then
        log_warning "端口 $backend_port 已被占用，后端服务将无法启动"
    fi
    
    if lsof -Pi :$frontend_port -sTCP:LISTEN -t >/dev/null ; then
        log_warning "端口 $frontend_port 已被占用，前端服务将无法启动"
    fi
}

# 安装后端依赖
install_backend_deps() {
    log_info "安装后端依赖..."
    cd backend
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        log_info "后端依赖已存在，跳过安装"
    fi
    
    cd ..
    log_success "后端依赖安装完成"
}

# 启动后端服务
start_backend() {
    log_info "启动后端API服务..."
    cd backend
    
    # 检查是否已启动
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "后端服务已在运行，端口 3000"
        cd ..
        return
    fi
    
    # 启动后端服务（后台运行）
    nohup node server.js > ../backend.log 2>&1 &
    BACKEND_PID=$!
    echo $BACKEND_PID > ../backend.pid
    
    # 等待服务启动
    sleep 3
    
    # 检查是否启动成功
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "后端服务启动成功 (PID: $BACKEND_PID)"
        log_info "后端API: http://localhost:3000"
        log_info "健康检查: http://localhost:3000/health"
    else
        log_error "后端服务启动失败，请查看 backend.log 文件"
        cd ..
        exit 1
    fi
    
    cd ..
}

# 安装前端依赖
install_frontend_deps() {
    log_info "安装前端依赖..."
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        npm install
    else
        log_info "前端依赖已存在，跳过安装"
    fi
    
    cd ..
    log_success "前端依赖安装完成"
}

# 启动前端服务
start_frontend() {
    log_info "启动前端服务..."
    
    # 检查是否已启动
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
        log_warning "前端服务已在运行，端口 5173"
        return
    fi
    
    cd frontend
    
    # 启动Vite开发服务器
    nohup npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    echo $FRONTEND_PID > ../frontend.pid
    
    # 等待服务启动
    sleep 5
    
    # 检查是否启动成功
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        log_success "前端服务启动成功 (PID: $FRONTEND_PID)"
        log_info "前端地址: http://localhost:5173"
    else
        log_error "前端服务启动失败，请查看 frontend.log 文件"
        cd ..
        exit 1
    fi
    
    cd ..
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    # 检查后端服务
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        log_success "后端服务运行正常"
    else
        log_error "后端服务未运行"
    fi
    
    # 检查前端服务
    if curl -f http://localhost:5173 > /dev/null 2>&1; then
        log_success "前端服务运行正常"
    else
        log_error "前端服务未运行"
    fi
}

# 停止服务
stop_services() {
    log_info "停止服务..."
    
    # 停止后端服务
    if [ -f "backend.pid" ]; then
        BACKEND_PID=$(cat backend.pid)
        if kill -0 $BACKEND_PID 2>/dev/null; then
            kill $BACKEND_PID
            log_success "后端服务已停止 (PID: $BACKEND_PID)"
        fi
        rm -f backend.pid
    fi
    
    # 停止前端服务
    if [ -f "frontend.pid" ]; then
        FRONTEND_PID=$(cat frontend.pid)
        if kill -0 $FRONTEND_PID 2>/dev/null; then
            kill $FRONTEND_PID
            log_success "前端服务已停止 (PID: $FRONTEND_PID)"
        fi
        rm -f frontend.pid
    fi
    
    # 清理日志文件
    rm -f backend.log frontend.log
}

# 显示服务状态
show_status() {
    log_info "服务状态:"
    
    echo ""
    echo "后端服务:"
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "  ${GREEN}● 运行中${NC}"
        echo "  地址: http://localhost:3000"
        echo "  健康检查: http://localhost:3000/health"
        if [ -f "backend.pid" ]; then
            echo "  PID: $(cat backend.pid)"
        fi
    else
        echo -e "  ${RED}● 未运行${NC}"
    fi
    
    echo ""
    echo "前端服务:"
    if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null ; then
        echo -e "  ${GREEN}● 运行中${NC}"
        echo "  地址: http://localhost:5173"
        if [ -f "frontend.pid" ]; then
            echo "  PID: $(cat frontend.pid)"
        fi
    else
        echo -e "  ${RED}● 未运行${NC}"
    fi
    
    echo ""
    echo "API接口:"
    echo "  AI聊天: http://localhost:3000/ai/chat"
    echo "  出海规划: http://localhost:3000/api/planning"
    echo "  市场分析: http://localhost:3000/api/market-analysis"
}

# 查看日志
show_logs() {
    local service=$1
    
    if [ -z "$service" ]; then
        log_info "显示所有服务日志 (Ctrl+C退出)"
        tail -f backend.log frontend.log
    elif [ "$service" = "backend" ]; then
        log_info "显示后端服务日志 (Ctrl+C退出)"
        tail -f backend.log
    elif [ "$service" = "frontend" ]; then
        log_info "显示前端服务日志 (Ctrl+C退出)"
        tail -f frontend.log
    else
        log_error "未知服务: $service"
        show_usage
    fi
}

# 显示使用说明
show_usage() {
    echo "出海AI平台本地启动脚本"
    echo ""
    echo "使用方法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  start     启动所有服务"
    echo "  stop      停止所有服务"
    echo "  restart   重启所有服务"
    echo "  status    查看服务状态"
    echo "  logs [服务名] 查看日志"
    echo "  install   安装依赖"
    echo ""
    echo "示例:"
    echo "  $0 start        # 启动所有服务"
    echo "  $0 logs         # 查看所有日志"
    echo "  $0 logs backend # 查看后端日志"
    echo "  $0 status       # 查看服务状态"
}

# 安装依赖
install_deps() {
    check_node
    install_backend_deps
    install_frontend_deps
    log_success "所有依赖安装完成"
}

# 主函数
main() {
    local command=$1
    
    case $command in
        "start")
            check_node
            check_ports
            install_backend_deps
            install_frontend_deps
            start_backend
            start_frontend
            check_services
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            stop_services
            sleep 2
            check_node
            check_ports
            install_backend_deps
            install_frontend_deps
            start_backend
            start_frontend
            check_services
            show_status
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs $2
            ;;
        "install")
            install_deps
            ;;
        *)
            log_error "未知命令: $command"
            show_usage
            exit 1
            ;;
    esac
}

# 脚本入口
if [ "$(basename "$0")" = "start-local.sh" ]; then
    main "$@"
fi
