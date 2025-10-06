#!/bin/bash

# 出海AI后端服务重启脚本
# 使用方法: ./restart-backend.sh [start|stop|restart|status]

set -e

# 配置
BACKEND_DIR="/Users/lixiaofei/Documents/overseas-ai/backend"
PID_FILE="/Users/lixiaofei/Documents/overseas-ai/backend.pid"
LOG_FILE="/Users/lixiaofei/Documents/overseas-ai/backend.log"
PORT=3000

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

# 检查后端进程是否存在
is_backend_running() {
    if [ -f "$PID_FILE" ]; then
        local pid=$(cat "$PID_FILE")
        if ps -p "$pid" > /dev/null 2>&1; then
            return 0
        else
            rm -f "$PID_FILE"
            return 1
        fi
    fi
    return 1
}

# 获取后端进程ID
get_backend_pid() {
    if [ -f "$PID_FILE" ]; then
        cat "$PID_FILE"
    else
        echo ""
    fi
}

# 检查端口是否被占用
is_port_in_use() {
    lsof -ti:$PORT > /dev/null 2>&1
}

# 停止后端服务
stop_backend() {
    log_info "正在停止后端服务..."
    
    if is_backend_running; then
        local pid=$(get_backend_pid)
        log_info "找到运行中的后端进程 (PID: $pid)"
        
        # 优雅关闭
        kill -TERM "$pid" 2>/dev/null || true
        sleep 2
        
        # 检查是否还在运行
        if ps -p "$pid" > /dev/null 2>&1; then
            log_warning "进程仍在运行，强制终止..."
            kill -KILL "$pid" 2>/dev/null || true
            sleep 1
        fi
        
        # 清理PID文件
        rm -f "$PID_FILE"
        log_success "后端服务已停止"
    else
        log_info "后端服务未运行"
    fi
    
    # 清理可能残留的进程
    local pids=$(lsof -ti:$PORT 2>/dev/null || true)
    if [ -n "$pids" ]; then
        log_warning "发现端口 $PORT 被占用，清理残留进程..."
        echo "$pids" | xargs kill -9 2>/dev/null || true
    fi
}

# 启动后端服务
start_backend() {
    log_info "正在启动后端服务..."
    
    if is_backend_running; then
        log_warning "后端服务已在运行中"
        return 0
    fi
    
    # 检查端口是否被占用
    if is_port_in_use; then
        log_error "端口 $PORT 已被占用，请先停止相关服务"
        return 1
    fi
    
    # 进入后端目录
    cd "$BACKEND_DIR" || {
        log_error "无法进入后端目录: $BACKEND_DIR"
        return 1
    }
    
    # 检查依赖
    if [ ! -f "package.json" ]; then
        log_error "未找到 package.json 文件"
        return 1
    fi
    
    # 安装依赖（如果需要）
    if [ ! -d "node_modules" ]; then
        log_info "安装依赖包..."
        npm install
    fi
    
    # 启动服务
    log_info "启动后端服务..."
    nohup npm start > "$LOG_FILE" 2>&1 &
    local pid=$!
    
    # 保存PID
    echo "$pid" > "$PID_FILE"
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 3
    
    # 检查服务是否成功启动
    if is_backend_running; then
        log_success "后端服务启动成功 (PID: $pid)"
        log_info "服务地址: http://localhost:$PORT"
        log_info "健康检查: http://localhost:$PORT/health"
        log_info "日志文件: $LOG_FILE"
        return 0
    else
        log_error "后端服务启动失败"
        rm -f "$PID_FILE"
        return 1
    fi
}

# 重启后端服务
restart_backend() {
    log_info "正在重启后端服务..."
    stop_backend
    sleep 2
    start_backend
}

# 检查服务状态
check_status() {
    log_info "检查后端服务状态..."
    
    if is_backend_running; then
        local pid=$(get_backend_pid)
        log_success "后端服务正在运行 (PID: $pid)"
        
        # 检查端口
        if is_port_in_use; then
            log_info "端口 $PORT 正常监听"
        else
            log_warning "端口 $PORT 未监听"
        fi
        
        # 测试健康检查
        log_info "测试健康检查..."
        if curl -s "http://localhost:$PORT/health" > /dev/null 2>&1; then
            log_success "健康检查通过"
        else
            log_warning "健康检查失败"
        fi
        
        # 显示进程信息
        log_info "进程信息:"
        ps -p "$pid" -o pid,ppid,cmd,etime,pcpu,pmem 2>/dev/null || true
        
    else
        log_warning "后端服务未运行"
        
        # 检查是否有残留进程占用端口
        if is_port_in_use; then
            log_warning "端口 $PORT 被其他进程占用:"
            lsof -i:$PORT 2>/dev/null || true
        fi
    fi
    
    # 显示日志文件信息
    if [ -f "$LOG_FILE" ]; then
        log_info "日志文件: $LOG_FILE"
        log_info "最近日志:"
        tail -5 "$LOG_FILE" 2>/dev/null || true
    fi
}

# 显示帮助信息
show_help() {
    echo "出海AI后端服务管理脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 start    启动后端服务"
    echo "  $0 stop     停止后端服务"
    echo "  $0 restart  重启后端服务"
    echo "  $0 status   检查服务状态"
    echo "  $0 help     显示帮助信息"
    echo ""
    echo "配置文件:"
    echo "  后端目录: $BACKEND_DIR"
    echo "  PID文件:  $PID_FILE"
    echo "  日志文件: $LOG_FILE"
    echo "  服务端口: $PORT"
}

# 主函数
main() {
    case "${1:-help}" in
        start)
            start_backend
            ;;
        stop)
            stop_backend
            ;;
        restart)
            restart_backend
            ;;
        status)
            check_status
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $1"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
