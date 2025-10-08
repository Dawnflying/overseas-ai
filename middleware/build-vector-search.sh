#!/bin/bash

# 构建和推送向量检索 Elasticsearch 镜像脚本
# 作者: Overseas AI Team
# 用途: 构建支持向量检索的 Elasticsearch 和 Kibana 镜像并推送到阿里云镜像仓库

set -e

# 配置变量
REGISTRY="registry.cn-hangzhou.aliyuncs.com/jarvis-ai"
ELASTICSEARCH_VERSION="8.13.0"
KIBANA_VERSION="8.13.0"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否运行
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker 未运行，请先启动 Docker"
        exit 1
    fi
    log_info "Docker 检查通过"
}

# 登录阿里云镜像仓库
login_registry() {
    log_info "正在登录阿里云镜像仓库..."
    read -p "请输入阿里云镜像仓库用户名: " username
    read -s -p "请输入密码: " password
    echo
    
    if echo "$password" | docker login --username="$username" --password-stdin "$REGISTRY"; then
        log_info "登录成功"
    else
        log_error "登录失败"
        exit 1
    fi
}

# 构建 Elasticsearch 向量检索镜像
build_elasticsearch() {
  log_info "开始构建 Elasticsearch 向量检索镜像..."
  
  if [ -d "build/elasticsearch" ]; then
    cd build/elasticsearch
    log_info "正在构建镜像，这可能需要几分钟时间..."
    if docker build -t "${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}" .; then
      log_info "Elasticsearch 镜像构建完成"
      cd ../..
    else
      log_error "Elasticsearch 镜像构建失败"
      cd ../..
      exit 1
    fi
  else
    log_error "build/elasticsearch 目录不存在"
    exit 1
  fi
}

# 构建 Kibana 镜像
build_kibana() {
  log_info "开始构建 Kibana 镜像..."
  
  # 检查 Kibana Dockerfile 是否存在
  if [ ! -f "build/kibana/Dockerfile" ]; then
    log_info "创建 Kibana Dockerfile..."
    mkdir -p build/kibana
    cat > build/kibana/Dockerfile << 'EOF'
# 基于官方 Kibana 8.13.0 镜像
FROM --platform=linux/amd64 docker.elastic.co/kibana/kibana:8.13.0

# 暴露端口
EXPOSE 5601

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5601/api/status || exit 1
EOF
  fi

  cd build/kibana
  log_info "正在构建 Kibana 镜像，这可能需要几分钟时间..."
  if docker build -t "${REGISTRY}/kibana-vector:${KIBANA_VERSION}" .; then
    log_info "Kibana 镜像构建完成"
    cd ../..
  else
    log_warn "Kibana 镜像构建失败，跳过..."
    cd ../..
  fi
}

# 推送镜像到阿里云仓库
push_images() {
  log_info "开始推送镜像到阿里云仓库..."
  
  # 推送 Elasticsearch 镜像
  log_info "正在推送 Elasticsearch 镜像..."
  if docker push "${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}"; then
    log_info "Elasticsearch 镜像推送完成"
  else
    log_error "Elasticsearch 镜像推送失败"
    exit 1
  fi
  
  # 推送 Kibana 镜像
  log_info "正在推送 Kibana 镜像..."
  if docker push "${REGISTRY}/kibana-vector:${KIBANA_VERSION}"; then
    log_info "Kibana 镜像推送完成"
  else
    log_warn "Kibana 镜像推送失败，跳过..."
  fi
}

# 清理本地镜像（可选）
cleanup() {
    read -p "是否删除本地构建的镜像以节省空间? (y/N): " cleanup_choice
    if [[ $cleanup_choice =~ ^[Yy]$ ]]; then
        docker rmi "${REGISTRY}/elasticsearch-vector:${ELASTICSEARCH_VERSION}" || true
        docker rmi "${REGISTRY}/kibana-vector:${KIBANA_VERSION}" || true
        log_info "本地镜像清理完成"
    fi
}

# 显示使用说明
show_usage() {
    log_info "镜像构建完成！"
    echo ""
    echo "使用方法："
    echo "1. 启动向量检索服务："
    echo "   ./start.sh start"
    echo ""
    echo "2. 检查服务状态："
    echo "   ./start.sh status"
    echo ""
    echo "3. 查看 Elasticsearch 健康状态："
    echo "   curl http://localhost:9200/_cluster/health"
    echo ""
    echo "4. 访问 Kibana："
    echo "   http://localhost:5601"
    echo ""
    echo "5. 停止服务："
    echo "   ./start.sh stop"
}

# 主函数
main() {
    log_info "开始构建向量检索 Elasticsearch 镜像..."
    
    check_docker
    login_registry
    build_elasticsearch
    build_kibana
    push_images
    cleanup
    show_usage
    
    log_info "所有操作完成！"
}

# 运行主函数
main "$@"
