import React, { useState, useEffect } from 'react';

const CustomerManagement = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    tags: '',
    status: '',
    location: '',
    registrationDate: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);

  // 表单数据
  const [customerForm, setCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    tags: [],
    notes: ''
  });

  // 模拟数据初始化
  useEffect(() => {
    fetchCustomers();
  }, [filters, page]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters
      });
      
      const response = await fetch(`/api/customer-service/customers?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('获取客户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/customer-service/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCustomerForm({
          name: '',
          email: '',
          phone: '',
          location: '',
          tags: [],
          notes: ''
        });
        await fetchCustomers();
      }
    } catch (error) {
      console.error('创建客户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCustomer = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customer-service/customers/${selectedCustomer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm)
      });

      if (response.ok) {
        setShowEditModal(false);
        setSelectedCustomer(null);
        await fetchCustomers();
      }
    } catch (error) {
      console.error('更新客户失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      const response = await fetch(`/api/customer-service/customers/${customerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setShowDeleteModal(false);
        setSelectedCustomer(null);
        await fetchCustomers();
      }
    } catch (error) {
      console.error('删除客户失败:', error);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  const handleSelectCustomer = (customerId) => {
    setSelectedCustomers(prev => {
      if (prev.includes(customerId)) {
        return prev.filter(id => id !== customerId);
      } else {
        return [...prev, customerId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const handleBatchDelete = async () => {
    setLoading(true);
    try {
      const promises = selectedCustomers.map(id => 
        fetch(`/api/customer-service/customers/${id}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(promises);
      setSelectedCustomers([]);
      setShowBatchModal(false);
      await fetchCustomers();
    } catch (error) {
      console.error('批量删除失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'inactive': return { color: '#6b7280', backgroundColor: '#f3f4f6' };
      case 'vip': return { color: '#dc2626', backgroundColor: '#fee2e2' };
      default: return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>👥 客户管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理客户信息和标签</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentView('customers')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            📋 客户列表
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            ➕ 添加客户
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {customers.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>总客户数</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⭐
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {customers.filter(c => c.tags?.includes('VIP')).length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>VIP客户</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💰
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                ${customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>总消费额</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f3e8ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🎯
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {(customers.reduce((sum, c) => sum + (c.satisfaction || 0), 0) / customers.length || 0).toFixed(1)}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>平均满意度</div>
            </div>
          </div>
        </div>
      </div>

      {/* 客户分布 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '20px',
          margin: '0 0 20px 0'
        }}>🌍 客户分布</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {['北京', '上海', 'New York', 'London', 'Tokyo'].map((location) => {
            const count = customers.filter(c => c.location === location).length;
            return (
              <div key={location} style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                  {count}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>{location}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近客户 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '20px',
          margin: '0 0 20px 0'
        }}>👤 最近客户</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {customers.slice(0, 5).map((customer) => (
            <div key={customer.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#6b7280'
                }}>
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {customer.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {customer.email} | {customer.location}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {customer.tags?.map((tag) => (
                  <span key={tag} style={{
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: '500',
                    borderRadius: '4px',
                    backgroundColor: tag === 'VIP' ? '#fee2e2' : '#eff6ff',
                    color: tag === 'VIP' ? '#dc2626' : '#1e40af'
                  }}>
                    {tag}
                  </span>
                ))}
                <span style={{
                  padding: '2px 6px',
                  fontSize: '10px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  ...getStatusColor(customer.status)
                }}>
                  {customer.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>📋 客户列表</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理所有客户信息</p>
        </div>
        <button
          onClick={() => setCurrentView('overview')}
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
          ← 返回概览
        </button>
      </div>

      {/* 筛选器 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>🔍 筛选条件</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              搜索客户
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="姓名、邮箱或电话"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              标签
            </label>
            <select
              value={filters.tags}
              onChange={(e) => handleFilterChange('tags', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部标签</option>
              <option value="VIP">VIP</option>
              <option value="新用户">新用户</option>
              <option value="活跃用户">活跃用户</option>
              <option value="海外用户">海外用户</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              状态
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部状态</option>
              <option value="active">活跃</option>
              <option value="inactive">非活跃</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              地区
            </label>
            <select
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部地区</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Tokyo">Tokyo</option>
            </select>
          </div>
        </div>
      </div>

      {/* 批量操作工具栏 */}
      {selectedCustomers.length > 0 && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280' }}>
              已选择 {selectedCustomers.length} 个客户
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setShowBatchModal(true)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              批量删除
            </button>
            <button
              onClick={() => setSelectedCustomers([])}
              style={{
                padding: '8px 16px',
                color: '#6b7280',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500'
              }}
            >
              取消选择
            </button>
          </div>
        </div>
      )}

      {/* 客户列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px' }}>加载中...</div>
          </div>
        ) : customers.length > 0 ? (
          customers.map((customer) => (
            <div key={customer.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: selectedCustomers.includes(customer.id) ? '2px solid #3b82f6' : '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input
                    type="checkbox"
                    checked={selectedCustomers.includes(customer.id)}
                    onChange={() => handleSelectCustomer(customer.id)}
                    style={{
                      width: '18px',
                      height: '18px',
                      cursor: 'pointer'
                    }}
                  />
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: '600',
                    color: '#6b7280'
                  }}>
                    {customer.name.charAt(0)}
                  </div>
                  
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      margin: '0 0 4px 0'
                    }}>{customer.name}</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      marginBottom: '8px',
                      margin: '0 0 8px 0'
                    }}>{customer.email}</p>
                    
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        📱 {customer.phone}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        📍 {customer.location}
                      </span>
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        📅 注册: {customer.registrationDate}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {customer.tags?.map((tag) => (
                        <span key={tag} style={{
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: '500',
                          borderRadius: '4px',
                          backgroundColor: tag === 'VIP' ? '#fee2e2' : 
                                         tag === '新用户' ? '#fef3c7' :
                                         tag === '活跃用户' ? '#dcfce7' : '#eff6ff',
                          color: tag === 'VIP' ? '#dc2626' : 
                                tag === '新用户' ? '#ca8a04' :
                                tag === '活跃用户' ? '#16a34a' : '#1e40af'
                        }}>
                          {tag}
                        </span>
                      ))}
                      <span style={{
                        padding: '2px 6px',
                        fontSize: '10px',
                        fontWeight: '500',
                        borderRadius: '4px',
                        ...getStatusColor(customer.status)
                      }}>
                        {customer.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleViewCustomer(customer)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6b7280',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      查看
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setCustomerForm({
                          name: customer.name,
                          email: customer.email,
                          phone: customer.phone,
                          location: customer.location,
                          tags: customer.tags || [],
                          notes: customer.notes || ''
                        });
                        setShowEditModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setShowDeleteModal(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      删除
                    </button>
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
                    <div>订单: {customer.totalOrders} | 消费: ${customer.totalSpent}</div>
                    <div>对话: {customer.conversationCount} | 满意度: {customer.satisfaction}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '16px' }}>暂无客户数据</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCustomerDetailModal = () => (
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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0'
          }}>
            👤 客户详情
          </h3>
          <button
            onClick={() => {
              setShowDetailModal(false);
              setSelectedCustomer(null);
            }}
            style={{
              color: '#9ca3af',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* 基本信息 */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>基本信息</h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  姓名
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  邮箱
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  电话
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  地区
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.location}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  注册时间
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.registrationDate}</div>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                  最后活跃
                </div>
                <div style={{ fontSize: '16px', color: '#111827' }}>{selectedCustomer.lastActiveDate}</div>
              </div>
            </div>
          </div>

          {/* 业务数据 */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>业务数据</h4>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>
                  {selectedCustomer.totalOrders}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>总订单数</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>
                  ${selectedCustomer.totalSpent}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>总消费额</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>
                  {selectedCustomer.conversationCount}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>对话次数</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>
                  {selectedCustomer.satisfaction}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>满意度评分</div>
              </div>
            </div>
          </div>

          {/* 标签和状态 */}
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '20px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>标签和状态</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  客户标签
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedCustomer.tags?.map((tag) => (
                    <span key={tag} style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      backgroundColor: tag === 'VIP' ? '#fee2e2' : 
                                     tag === '新用户' ? '#fef3c7' :
                                     tag === '活跃用户' ? '#dcfce7' : '#eff6ff',
                      color: tag === 'VIP' ? '#dc2626' : 
                            tag === '新用户' ? '#ca8a04' :
                            tag === '活跃用户' ? '#16a34a' : '#1e40af'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  客户状态
                </div>
                <span style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '9999px',
                  ...getStatusColor(selectedCustomer.status)
                }}>
                  {selectedCustomer.status === 'active' ? '活跃' : '非活跃'}
                </span>
              </div>
            </div>
          </div>

          {/* 备注信息 */}
          {selectedCustomer.notes && (
            <div style={{
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #e5e7eb'
            }}>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '16px',
                margin: '0 0 16px 0'
              }}>备注信息</h4>
              <div style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                backgroundColor: '#ffffff',
                padding: '12px',
                borderRadius: '6px',
                border: '1px solid #e5e7eb'
              }}>
                {selectedCustomer.notes}
              </div>
            </div>
          )}
        </div>

        <div style={{
          marginTop: '24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setShowDetailModal(false);
              setSelectedCustomer(null);
            }}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            关闭
          </button>
          <button
            onClick={() => {
              setShowDetailModal(false);
              setCustomerForm({
                name: selectedCustomer.name,
                email: selectedCustomer.email,
                phone: selectedCustomer.phone,
                location: selectedCustomer.location,
                tags: selectedCustomer.tags || [],
                notes: selectedCustomer.notes || ''
              });
              setShowEditModal(true);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            编辑客户
          </button>
        </div>
      </div>
    </div>
  );

  const renderBatchModal = () => (
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
        maxWidth: '500px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            🔄 批量操作
          </h3>
          <button
            onClick={() => {
              setShowBatchModal(false);
            }}
            style={{
              color: '#9ca3af',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '16px',
            color: '#374151',
            marginBottom: '16px',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            您选择了 <strong>{selectedCustomers.length}</strong> 个客户，请选择要执行的操作：
          </p>
          
          <div style={{
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #e5e7eb'
          }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px',
              margin: '0 0 12px 0'
            }}>选中的客户：</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {customers
                .filter(c => selectedCustomers.includes(c.id))
                .map(customer => (
                  <div key={customer.id} style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    padding: '4px 0'
                  }}>
                    {customer.name} ({customer.email})
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setShowBatchModal(false);
            }}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            取消
          </button>
          <button
            onClick={handleBatchDelete}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#9ca3af' : '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            批量删除
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeleteConfirmModal = () => (
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
        maxWidth: '400px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            🗑️ 确认删除
          </h3>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedCustomer(null);
            }}
            style={{
              color: '#9ca3af',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{
            fontSize: '16px',
            color: '#374151',
            marginBottom: '16px',
            margin: '0 0 16px 0',
            lineHeight: '1.5'
          }}>
            确定要删除客户 <strong>{selectedCustomer.name}</strong> 吗？
          </p>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px',
            fontSize: '14px',
            color: '#dc2626'
          }}>
            ⚠️ 此操作不可撤销，将永久删除客户的所有数据。
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              setShowDeleteModal(false);
              setSelectedCustomer(null);
            }}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            取消
          </button>
          <button
            onClick={() => handleDeleteCustomer(selectedCustomer.id)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            确认删除
          </button>
        </div>
      </div>
    </div>
  );

  const renderCustomerModal = (isEdit = false) => (
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
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827',
            margin: '0'
          }}>
            {isEdit ? '✏️ 编辑客户' : '➕ 添加客户'}
          </h3>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setSelectedCustomer(null);
              } else {
                setShowCreateModal(false);
              }
            }}
            style={{
              color: '#9ca3af',
              padding: '8px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '20px'
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              姓名 *
            </label>
            <input
              type="text"
              value={customerForm.name}
              onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
              placeholder="输入客户姓名"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              邮箱 *
            </label>
            <input
              type="email"
              value={customerForm.email}
              onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
              placeholder="输入客户邮箱"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              电话
            </label>
            <input
              type="tel"
              value={customerForm.phone}
              onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
              placeholder="输入客户电话"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              地区
            </label>
            <select
              value={customerForm.location}
              onChange={(e) => setCustomerForm({...customerForm, location: e.target.value})}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="">选择地区</option>
              <option value="北京">北京</option>
              <option value="上海">上海</option>
              <option value="广州">广州</option>
              <option value="深圳">深圳</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Tokyo">Tokyo</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              备注
            </label>
            <textarea
              value={customerForm.notes}
              onChange={(e) => setCustomerForm({...customerForm, notes: e.target.value})}
              placeholder="输入客户备注信息"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                resize: 'vertical'
              }}
            />
          </div>
        </div>

        <div style={{
          marginTop: '32px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={() => {
              if (isEdit) {
                setShowEditModal(false);
                setSelectedCustomer(null);
              } else {
                setShowCreateModal(false);
              }
            }}
            style={{
              padding: '12px 24px',
              color: '#6b7280',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            取消
          </button>
          <button
            onClick={isEdit ? handleEditCustomer : handleCreateCustomer}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {loading && (
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #ffffff',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
            {isEdit ? '更新' : '创建'}
          </button>
        </div>
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
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {currentView === 'overview' && renderOverview()}
          {currentView === 'customers' && renderCustomers()}
          
          {/* 创建客户模态框 */}
          {showCreateModal && renderCustomerModal(false)}
          
          {/* 编辑客户模态框 */}
          {showEditModal && renderCustomerModal(true)}
          
          {/* 客户详情模态框 */}
          {showDetailModal && selectedCustomer && renderCustomerDetailModal()}
          
          {/* 删除确认模态框 */}
          {showDeleteModal && selectedCustomer && renderDeleteConfirmModal()}
          
          {/* 批量操作模态框 */}
          {showBatchModal && renderBatchModal()}
        </div>
      </div>
    </>
  );
};

export default CustomerManagement;
