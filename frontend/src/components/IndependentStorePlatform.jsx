import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const IndependentStorePlatform = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stores, setStores] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [storeForm, setStoreForm] = useState({
    name: '',
    domain: '',
    template: '',
    region: 'us-east-1',
    paymentMethods: ['paypal']
  });
  const [deploymentStatus, setDeploymentStatus] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchTemplates();
    fetchDeployments();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/independent-stores');
      const data = await response.json();
      setStores(data.stores || []);
    } catch (error) {
      console.error('获取独立站列表失败:', error);
      // Mock data for development
      setStores([
        {
          id: 1,
          name: 'My Fashion Store',
          domain: 'myfashionstore.com',
          status: 'active',
          template: 'fashion-template',
          region: 'us-east-1',
          createdAt: '2024-01-15',
          revenue: 15420,
          orders: 89
        },
        {
          id: 2,
          name: 'Tech Gadgets Hub',
          domain: 'techgadgets.shop',
          status: 'deploying',
          template: 'tech-template',
          region: 'eu-west-1',
          createdAt: '2024-01-20',
          revenue: 0,
          orders: 0
        }
      ]);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/store-templates');
      const data = await response.json();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('获取模板列表失败:', error);
      // Mock templates
      setTemplates([
        {
          id: 'fashion-template',
          name: '时尚服装模板',
          category: 'fashion',
          description: '专为服装、配饰、美妆品牌设计，包含产品展示、购物车、用户中心等功能',
          preview: '/images/templates/fashion-preview.jpg',
          features: ['响应式设计', '产品轮播', '购物车', '用户注册', '支付集成'],
          awsServices: ['S3', 'CloudFront', 'Lambda', 'RDS'],
          estimatedCost: 50
        },
        {
          id: 'tech-template',
          name: '科技数码模板',
          category: 'electronics',
          description: '适合电子产品、数码配件销售，包含产品对比、技术规格展示等功能',
          preview: '/images/templates/tech-preview.jpg',
          features: ['产品对比', '技术规格', '库存管理', '订单跟踪', '客服系统'],
          awsServices: ['S3', 'CloudFront', 'Lambda', 'DynamoDB', 'SNS'],
          estimatedCost: 75
        },
        {
          id: 'food-template',
          name: '食品饮料模板',
          category: 'food',
          description: '专为食品、饮料、保健品设计，包含营养信息、保质期管理等功能',
          preview: '/images/templates/food-preview.jpg',
          features: ['营养标签', '保质期提醒', '订阅服务', '配送跟踪', '评价系统'],
          awsServices: ['S3', 'CloudFront', 'Lambda', 'RDS', 'SES'],
          estimatedCost: 60
        }
      ]);
    }
  };

  const fetchDeployments = async () => {
    try {
      const response = await fetch('/api/store-deployments');
      const data = await response.json();
      setDeployments(data.deployments || []);
    } catch (error) {
      console.error('获取部署记录失败:', error);
      // Mock deployments
      setDeployments([
        {
          id: 1,
          storeId: 1,
          status: 'completed',
          startTime: '2024-01-15T10:00:00Z',
          endTime: '2024-01-15T10:15:00Z',
          steps: [
            { name: '创建S3存储桶', status: 'completed', duration: 30 },
            { name: '配置CloudFront CDN', status: 'completed', duration: 45 },
            { name: '部署Lambda函数', status: 'completed', duration: 60 },
            { name: '配置RDS数据库', status: 'completed', duration: 90 },
            { name: '设置Route 53域名', status: 'completed', duration: 120 },
            { name: '集成PayPal支付', status: 'completed', duration: 45 }
          ]
        },
        {
          id: 2,
          storeId: 2,
          status: 'in-progress',
          startTime: '2024-01-20T14:30:00Z',
          currentStep: 3,
          steps: [
            { name: '创建S3存储桶', status: 'completed', duration: 35 },
            { name: '配置CloudFront CDN', status: 'completed', duration: 50 },
            { name: '部署Lambda函数', status: 'in-progress', duration: 0 },
            { name: '配置RDS数据库', status: 'pending', duration: 0 },
            { name: '设置Route 53域名', status: 'pending', duration: 0 },
            { name: '集成PayPal支付', status: 'pending', duration: 0 }
          ]
        }
      ]);
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    setIsDeploying(true);
    
    try {
      const response = await fetch('/api/independent-stores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(storeForm),
      });

      if (response.ok) {
        const result = await response.json();
        setShowCreateModal(false);
        setStoreForm({
          name: '',
          domain: '',
          template: '',
          region: 'us-east-1',
          paymentMethods: ['paypal']
        });
        fetchStores();
        
        // 开始部署流程
        const deploymentResponse = await fetch('/api/store-deployments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            storeId: result.data?.id,
            template: storeForm.template,
            region: storeForm.region
          }),
        });
        
        if (deploymentResponse.ok) {
          fetchDeployments();
        }
      } else {
        const errorData = await response.json();
        alert(`创建独立站失败: ${errorData.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('创建独立站失败:', error);
      alert('创建独立站失败，请稍后重试');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeployStore = async (storeId) => {
    setIsDeploying(true);
    try {
      const response = await fetch(`/api/independent-stores/${storeId}/deploy`, {
        method: 'POST',
      });
      
      if (response.ok) {
        fetchDeployments();
        fetchStores();
      }
    } catch (error) {
      console.error('部署失败:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm('确定要删除这个独立站吗？这将删除所有相关数据和配置。')) {
      try {
        const response = await fetch(`/api/independent-stores/${storeId}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          fetchStores();
        }
      } catch (error) {
        console.error('删除独立站失败:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': 
        return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'deploying': 
        return { color: '#2563eb', backgroundColor: '#dbeafe' };
      case 'error': 
        return { color: '#dc2626', backgroundColor: '#fee2e2' };
      case 'pending': 
        return { color: '#ca8a04', backgroundColor: '#fef3c7' };
      default: 
        return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '运行中';
      case 'deploying': return '部署中';
      case 'error': return '错误';
      case 'pending': return '待部署';
      default: return '未知';
    }
  };

  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* 页面标题 */}
      <div style={{
        textAlign: 'center',
        padding: '32px',
        background: 'linear-gradient(to right, #eff6ff, #e0e7ff, #f3e8ff)',
        borderRadius: '16px',
        border: '1px solid #dbeafe'
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>🏗️ 独立站平台</h1>
        <p style={{
          fontSize: '20px',
          color: '#6b7280',
          maxWidth: '672px',
          margin: '0 auto'
        }}>
          基于AWS云服务，快速搭建专业的电商独立站，支持全球部署和自动扩缩容
        </p>
      </div>

      {/* 概览统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #bfdbfe',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1d4ed8', marginBottom: '4px' }}>独立站总数</p>
              <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#1e3a8a', margin: '0' }}>{stores.length}</p>
              <p style={{ fontSize: '12px', color: '#2563eb', marginTop: '4px', margin: '4px 0 0 0' }}>个站点</p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#3b82f6',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '24px' }}>🏪</span>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #bbf7d0',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#15803d', marginBottom: '4px' }}>运行中</p>
              <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#14532d', margin: '0' }}>
                {stores.filter(s => s.status === 'active').length}
              </p>
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px', margin: '4px 0 0 0' }}>个站点</p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#22c55e',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '24px' }}>✅</span>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #faf5ff, #e9d5ff)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #d8b4fe',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#7c3aed', marginBottom: '4px' }}>总营收</p>
              <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#581c87', margin: '0' }}>
                ${stores.reduce((sum, s) => sum + (s.revenue || 0), 0).toLocaleString()}
              </p>
              <p style={{ fontSize: '12px', color: '#8b5cf6', marginTop: '4px', margin: '4px 0 0 0' }}>累计收入</p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#a855f7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '24px' }}>💰</span>
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'linear-gradient(135deg, #fff7ed, #fed7aa)',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #fdba74',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#c2410c', marginBottom: '4px' }}>总订单</p>
              <p style={{ fontSize: '30px', fontWeight: 'bold', color: '#9a3412', margin: '0' }}>
                {stores.reduce((sum, s) => sum + (s.orders || 0), 0)}
              </p>
              <p style={{ fontSize: '12px', color: '#ea580c', marginTop: '4px', margin: '4px 0 0 0' }}>个订单</p>
            </div>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#f97316',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}>
              <span style={{ fontSize: '24px' }}>📦</span>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div style={{
        backgroundColor: '#ffffff',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🚀 快速操作</h3>
          <p style={{ color: '#6b7280', margin: '0' }}>选择您需要的操作，快速开始独立站之旅</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px'
        }}>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#3b82f6';
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <span style={{ fontSize: '24px' }}>➕</span>
              </div>
              <p style={{
                fontWeight: 'bold',
                color: '#111827',
                fontSize: '18px',
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>创建新独立站</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>快速搭建电商网站</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('templates')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.backgroundColor = '#f0fdf4';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <span style={{ fontSize: '24px' }}>🎨</span>
              </div>
              <p style={{
                fontWeight: 'bold',
                color: '#111827',
                fontSize: '18px',
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>浏览模板</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>选择合适的模板</p>
            </div>
          </button>
          
          <button
            onClick={() => setCurrentView('deployments')}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              border: '2px dashed #d1d5db',
              borderRadius: '12px',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#a855f7';
              e.currentTarget.style.backgroundColor = '#faf5ff';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <span style={{ fontSize: '24px' }}>🚀</span>
              </div>
              <p style={{
                fontWeight: 'bold',
                color: '#111827',
                fontSize: '18px',
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>部署管理</p>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: '0' }}>查看部署状态</p>
            </div>
          </button>
        </div>
      </div>

      {/* 独立站列表 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        <div style={{
          padding: '32px',
          borderBottom: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '8px',
                margin: '0 0 8px 0'
              }}>🏪 我的独立站</h3>
              <p style={{ color: '#6b7280', margin: '0' }}>管理和监控您的所有独立站</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                color: '#ffffff',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #3730a3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #4f46e5)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span style={{ marginRight: '8px' }}>➕</span>
              创建新站
            </button>
          </div>
        </div>
        
        <div>
          {stores.map((store, index) => (
            <div key={store.id} style={{
              padding: '32px',
              borderBottom: index < stores.length - 1 ? '1px solid #f3f4f6' : 'none',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 246, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #dbeafe, #e0e7ff)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '20px' }}>🏪</span>
                    </div>
                    <div>
                      <h4 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#111827',
                        margin: '0 0 4px 0'
                      }}>{store.name}</h4>
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '9999px',
                        ...getStatusColor(store.status)
                      }}>
                        {getStatusText(store.status)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '16px',
                      fontSize: '14px'
                    }}>
                      <div>
                        <span style={{ color: '#6b7280' }}>域名:</span>
                        <p style={{ fontWeight: '500', color: '#111827', margin: '4px 0 0 0' }}>{store.domain}</p>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>模板:</span>
                        <p style={{ fontWeight: '500', color: '#111827', margin: '4px 0 0 0' }}>{store.template}</p>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>区域:</span>
                        <p style={{ fontWeight: '500', color: '#111827', margin: '4px 0 0 0' }}>{store.region}</p>
                      </div>
                      <div>
                        <span style={{ color: '#6b7280' }}>创建时间:</span>
                        <p style={{ fontWeight: '500', color: '#111827', margin: '4px 0 0 0' }}>{new Date(store.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>💰</span>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 2px 0' }}>营收</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#16a34a', margin: '0' }}>${store.revenue?.toLocaleString()}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '20px', marginRight: '8px' }}>📦</span>
                      <div>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 2px 0' }}>订单</p>
                        <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#2563eb', margin: '0' }}>{store.orders}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px' }}>
                  {store.status === 'active' && (
                    <a
                      href={`https://${store.domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#dcfce7',
                        color: '#166534',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#bbf7d0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#dcfce7';
                      }}
                    >
                      <span style={{ marginRight: '4px' }}>🌐</span>
                      访问网站
                    </a>
                  )}
                  {store.status === 'pending' && (
                    <button
                      onClick={() => handleDeployStore(store.id)}
                      disabled={isDeploying}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: isDeploying ? 'not-allowed' : 'pointer',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        opacity: isDeploying ? 0.5 : 1,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isDeploying) {
                          e.currentTarget.style.backgroundColor = '#bfdbfe';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isDeploying) {
                          e.currentTarget.style.backgroundColor = '#dbeafe';
                        }
                      }}
                    >
                      <span style={{ marginRight: '4px' }}>🚀</span>
                      开始部署
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#fee2e2',
                      color: '#dc2626',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fecaca';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                    }}
                  >
                    <span style={{ marginRight: '4px' }}>🗑️</span>
                    删除
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">🎨 模板库</h2>
          <p className="text-gray-600">选择适合您业务的电商模板，快速搭建专业网站</p>
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="px-6 py-3 text-gray-600 hover:text-gray-900 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← 返回控制台
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20"></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl mb-2">
                  {template.category === 'fashion' ? '👗' : 
                   template.category === 'electronics' ? '📱' : '🍎'}
                </div>
                <div className="text-sm font-medium text-gray-600 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                  {template.category === 'fashion' ? '时尚服装' : 
                   template.category === 'electronics' ? '科技数码' : '食品饮料'}
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{template.name}</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">{template.description}</p>
              
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  主要功能
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full font-medium">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  AWS服务
                </p>
                <div className="flex flex-wrap gap-2">
                  {template.awsServices.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 text-xs rounded-full font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-green-600">${template.estimatedCost}</span>
                  <span className="text-sm text-gray-500 ml-1">/月</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedTemplate(template);
                    setShowCreateModal(true);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  选择模板
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDeployments = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🚀 部署管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>监控和管理您的独立站部署状态</p>
        </div>
        <button
          onClick={() => setCurrentView('dashboard')}
          style={{
            padding: '12px 24px',
            color: '#6b7280',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#111827';
            e.currentTarget.style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#6b7280';
            e.currentTarget.style.backgroundColor = '#ffffff';
          }}
        >
          ← 返回控制台
        </button>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {deployments.map((deployment) => (
          <div key={deployment.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '24px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '4px',
                    margin: '0 0 4px 0'
                  }}>
                    部署 #{deployment.id}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0'
                  }}>
                    独立站ID: {deployment.storeId} | 模板: {deployment.template} | 区域: {deployment.region}
                  </p>
                </div>
                <span style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '9999px',
                  ...getStatusColor(deployment.status)
                }}>
                  {deployment.status === 'completed' ? '✅ 已完成' :
                   deployment.status === 'in-progress' ? '⏳ 进行中' : '❌ 失败'}
                </span>
              </div>
            </div>
            
            <div style={{ padding: '24px' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {deployment.steps.map((step, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '12px',
                    backgroundColor: step.status === 'completed' ? '#f0fdf4' : 
                                   step.status === 'in-progress' ? '#eff6ff' : '#f9fafb',
                    borderRadius: '8px',
                    border: step.status === 'completed' ? '1px solid #bbf7d0' :
                           step.status === 'in-progress' ? '1px solid #bfdbfe' : '1px solid #f3f4f6'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '500',
                      backgroundColor: step.status === 'completed' ? '#22c55e' :
                                     step.status === 'in-progress' ? '#3b82f6' : '#d1d5db',
                      color: step.status === 'pending' ? '#6b7280' : '#ffffff',
                      flexShrink: 0
                    }}>
                      {step.status === 'completed' ? '✓' :
                       step.status === 'in-progress' ? '⏳' : index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{
                        fontSize: '16px',
                        fontWeight: '500',
                        color: '#111827',
                        marginBottom: '4px',
                        margin: '0 0 4px 0'
                      }}>{step.name}</p>
                      {step.duration > 0 && (
                        <p style={{
                          fontSize: '14px',
                          color: '#6b7280',
                          margin: '0'
                        }}>耗时: {step.duration}秒</p>
                      )}
                      {step.logs && (
                        <p style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          margin: '4px 0 0 0',
                          fontStyle: 'italic'
                        }}>{step.logs}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                  color: '#6b7280'
                }}>
                  <div>
                    <span style={{ fontWeight: '500' }}>开始时间:</span> {new Date(deployment.startTime).toLocaleString()}
                  </div>
                  {deployment.endTime && (
                    <div>
                      <span style={{ fontWeight: '500' }}>结束时间:</span> {new Date(deployment.endTime).toLocaleString()}
                    </div>
                  )}
                </div>
                
                {deployment.awsResources && (
                  <div style={{
                    marginTop: '16px',
                    padding: '16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '12px',
                      margin: '0 0 12px 0'
                    }}>🔧 AWS资源</h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '12px',
                      fontSize: '14px'
                    }}>
                      {Object.entries(deployment.awsResources).map(([key, value]) => (
                        <div key={key} style={{
                          padding: '8px 12px',
                          backgroundColor: '#ffffff',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <span style={{ fontWeight: '500', color: '#374151' }}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                          </span>
                          <br />
                          <span style={{ color: '#6b7280', fontSize: '12px' }}>
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '24px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'templates' && renderTemplates()}
      {currentView === 'deployments' && renderDeployments()}

      {/* 创建独立站模态框 */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            padding: '32px',
            width: '100%',
            maxWidth: '512px',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#111827',
                  margin: '0 0 4px 0'
                }}>🏗️ 创建新独立站</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>快速搭建您的专属电商网站</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  color: '#9ca3af',
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6b7280';
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#9ca3af';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateStore} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                background: 'linear-gradient(to right, #eff6ff, #e0e7ff)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>🏪</span>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0'
                  }}>基本信息</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></span>
                        站点名称
                      </span>
                    </label>
                    <input
                      type="text"
                      value={storeForm.name}
                      onChange={(e) => setStoreForm({...storeForm, name: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="例如: My Fashion Store"
                      required
                    />
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></span>
                        域名
                      </span>
                    </label>
                    <input
                      type="text"
                      value={storeForm.domain}
                      onChange={(e) => setStoreForm({...storeForm, domain: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#3b82f6';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="example.com"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(to right, #f0fdf4, #ecfdf5)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>🎨</span>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0'
                  }}>模板配置</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#22c55e',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></span>
                        选择模板
                      </span>
                    </label>
                    <select
                      value={storeForm.template}
                      onChange={(e) => setStoreForm({...storeForm, template: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#22c55e';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      required
                    >
                      <option value="">请选择模板</option>
                      {templates.map((template) => (
                        <option key={template.id} value={template.id}>
                          {template.name} - ${template.estimatedCost}/月
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#374151',
                      marginBottom: '8px'
                    }}>
                      <span style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#22c55e',
                          borderRadius: '50%',
                          marginRight: '8px'
                        }}></span>
                        AWS区域
                      </span>
                    </label>
                    <select
                      value={storeForm.region}
                      onChange={(e) => setStoreForm({...storeForm, region: e.target.value})}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#22c55e';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(34, 197, 94, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="us-east-1">🇺🇸 美国东部 (弗吉尼亚)</option>
                      <option value="us-west-2">🇺🇸 美国西部 (俄勒冈)</option>
                      <option value="eu-west-1">🇪🇺 欧洲 (爱尔兰)</option>
                      <option value="ap-southeast-1">🇸🇬 亚太 (新加坡)</option>
                      <option value="ap-northeast-1">🇯🇵 亚太 (东京)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div style={{
                background: 'linear-gradient(to right, #faf5ff, #fdf4ff)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #d8b4fe'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <span style={{ fontSize: '20px', marginRight: '8px' }}>💳</span>
                  <h4 style={{
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0'
                  }}>支付配置</h4>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}>
                    <input
                      type="checkbox"
                      checked={storeForm.paymentMethods.includes('paypal')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStoreForm({
                            ...storeForm,
                            paymentMethods: [...storeForm.paymentMethods, 'paypal']
                          });
                        } else {
                          setStoreForm({
                            ...storeForm,
                            paymentMethods: storeForm.paymentMethods.filter(p => p !== 'paypal')
                          });
                        }
                      }}
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '12px'
                      }}
                    />
                    <span style={{ fontSize: '20px', marginRight: '12px' }}>💙</span>
                    <div>
                      <span style={{
                        fontWeight: '500',
                        color: '#111827',
                        display: 'block'
                      }}>PayPal</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0'
                      }}>全球最受欢迎的支付方式</p>
                    </div>
                  </label>
                  
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                  }}>
                    <input
                      type="checkbox"
                      checked={storeForm.paymentMethods.includes('stripe')}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStoreForm({
                            ...storeForm,
                            paymentMethods: [...storeForm.paymentMethods, 'stripe']
                          });
                        } else {
                          setStoreForm({
                            ...storeForm,
                            paymentMethods: storeForm.paymentMethods.filter(p => p !== 'stripe')
                          });
                        }
                      }}
                      style={{
                        width: '16px',
                        height: '16px',
                        marginRight: '12px'
                      }}
                    />
                    <span style={{ fontSize: '20px', marginRight: '12px' }}>💜</span>
                    <div>
                      <span style={{
                        fontWeight: '500',
                        color: '#111827',
                        display: 'block'
                      }}>Stripe</span>
                      <p style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        margin: '0'
                      }}>支持信用卡和数字钱包</p>
                    </div>
                  </label>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                gap: '16px',
                paddingTop: '24px'
              }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    border: '1px solid #d1d5db',
                    color: '#374151',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isDeploying}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: isDeploying ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    opacity: isDeploying ? 0.5 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeploying) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #1d4ed8, #3730a3)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isDeploying) {
                      e.currentTarget.style.background = 'linear-gradient(to right, #2563eb, #4f46e5)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  {isDeploying ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg style={{
                        animation: 'spin 1s linear infinite',
                        marginRight: '12px',
                        width: '20px',
                        height: '20px'
                      }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      创建中...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ marginRight: '8px' }}>🚀</span>
                      创建并部署
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default IndependentStorePlatform;
