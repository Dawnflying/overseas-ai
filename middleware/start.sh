#!/bin/bash

# 中间件服务启动脚本
# 使用 docker compose (新版命令)

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

log_blue() {
    echo -e "${BLUE}$1${NC}"
}

# 显示 banner
show_banner() {
    log_blue "╔═══════════════════════════════════════════════════════╗"
    log_blue "║         出海AI平台 - 中间件服务管理工具              ║"
    log_blue "╚═══════════════════════════════════════════════════════╝"
    echo ""
}

# 检查 Docker
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        log_error "Docker 未运行"
        exit 1
    fi
    
    log_info "Docker 检查通过"
}

# 启动所有服务
start_all() {
    log_info "启动所有中间件服务..."
    docker compose up -d
    log_info "所有服务已启动"
    show_status
}

# 启动特定服务
start_service() {
    local service=$1
    log_info "启动 $service..."
    docker compose up -d $service
    log_info "$service 已启动"
}

# 停止所有服务
stop_all() {
    log_info "停止所有中间件服务..."
    docker compose down
    log_info "所有服务已停止"
}

# 重启所有服务
restart_all() {
    log_info "重启所有中间件服务..."
    docker compose restart
    log_info "所有服务已重启"
}

# 查看服务状态
show_status() {
    log_info "服务状态："
    docker compose ps
    echo ""
    log_info "服务访问地址："
    echo "  MySQL:          localhost:3306"
    echo "  Elasticsearch:  http://localhost:9200"
    echo "  Kibana:         http://localhost:5601"
    echo "  Redis:          localhost:6379"
}

# 查看日志
show_logs() {
    local service=$1
    if [ -z "$service" ]; then
        docker compose logs -f
    else
        docker compose logs -f $service
    fi
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    # MySQL
    if docker exec overseas-ai-mysql mysqladmin ping -h localhost -u root -p${MYSQL_ROOT_PASSWORD:-rootpassword} &> /dev/null; then
        echo -e "  MySQL:         ${GREEN}✓ 健康${NC}"
    else
        echo -e "  MySQL:         ${RED}✗ 异常${NC}"
    fi
    
    # Elasticsearch
    if curl -s http://localhost:9200/_cluster/health &> /dev/null; then
        echo -e "  Elasticsearch: ${GREEN}✓ 健康${NC}"
    else
        echo -e "  Elasticsearch: ${RED}✗ 异常${NC}"
    fi
    
    # Redis
    if docker exec overseas-ai-redis redis-cli -a ${REDIS_PASSWORD:-redispassword} ping &> /dev/null; then
        echo -e "  Redis:         ${GREEN}✓ 健康${NC}"
    else
        echo -e "  Redis:         ${RED}✗ 异常${NC}"
    fi
}

# 清理数据（危险操作）
clean_data() {
    log_warn "⚠️  警告：此操作将删除所有数据！"
    read -p "确认删除所有数据？输入 'YES' 继续: " confirm
    
    if [ "$confirm" != "YES" ]; then
        log_info "操作已取消"
        return
    fi
    
    log_info "停止所有服务..."
    docker compose down -v
    
    log_info "删除数据目录..."
    rm -rf mysql/data/* elasticsearch/data/* redis/data/* elasticsearch/logs/*
    
    log_info "数据清理完成"
}

# 显示帮助
show_help() {
    echo "用法: $0 [命令] [选项]"
    echo ""
    echo "命令:"
    echo "  start [service]    启动服务（不指定则启动全部）"
    echo "  stop               停止所有服务"
    echo "  restart            重启所有服务"
    echo "  status             查看服务状态"
    echo "  logs [service]     查看日志（不指定则查看全部）"
    echo "  health             健康检查"
    echo "  clean              清理所有数据（危险操作）"
    echo "  help               显示帮助信息"
    echo ""
    echo "服务名称:"
    echo "  mysql              MySQL 数据库"
    echo "  elasticsearch      Elasticsearch 搜索引擎"
    echo "  kibana             Kibana 可视化界面"
    echo "  redis              Redis 缓存服务"
    echo ""
    echo "示例:"
    echo "  $0 start           # 启动所有服务"
    echo "  $0 start mysql     # 只启动 MySQL"
    echo "  $0 logs            # 查看所有日志"
    echo "  $0 logs mysql      # 只查看 MySQL 日志"
    echo "  $0 health          # 执行健康检查"
}

# 主函数
main() {
    show_banner
    check_docker
    
    local command=${1:-help}
    local service=$2
    
    case "$command" in
        start)
            if [ -z "$service" ]; then
                start_all
            else
                start_service $service
            fi
            ;;
        stop)
            stop_all
            ;;
        restart)
            restart_all
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs $service
            ;;
        health)
            health_check
            ;;
        clean)
            clean_data
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            log_error "未知命令: $command"
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 运行
main "$@"

