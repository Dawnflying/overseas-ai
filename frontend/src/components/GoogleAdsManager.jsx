import React, { useState, useEffect } from 'react';

const GoogleAdsManager = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [accounts, setAccounts] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authFormData, setAuthFormData] = useState({
    developerToken: '',
    clientId: '',
    clientSecret: '',
    refreshToken: '',
    customerId: '',
    loginCustomerId: ''
  });
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('disconnected');

  // 模拟数据
  useEffect(() => {
    setAccounts([
      {
        id: '1234567890',
        name: '我的电商店铺',
        currency: 'USD',
        timeZone: 'America/New_York',
        status: 'active',
        budget: 1000,
        spend: 350,
        impressions: 125000,
        clicks: 2500,
        conversions: 45
      }
    ]);
    
    setCampaigns([
      {
        id: '1001',
        name: '夏季促销活动',
        status: 'active',
        type: 'Search',
        budget: 500,
        spend: 180,
        impressions: 45000,
        clicks: 900,
        conversions: 18,
        ctr: 2.0,
        cpc: 0.20,
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      },
      {
        id: '1002',
        name: '品牌展示广告',
        status: 'active',
        type: 'Display',
        budget: 300,
        spend: 95,
        impressions: 35000,
        clicks: 420,
        conversions: 8,
        ctr: 1.2,
        cpc: 0.23,
        startDate: '2024-01-01',
        endDate: '2024-12-31'
      }
    ]);
  }, []);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/google-ads/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authFormData)
      });
      
      if (response.ok) {
        setApiStatus('connected');
        setShowAuthModal(false);
        // 获取账户信息
        await fetchAccounts();
      }
    } catch (error) {
      console.error('Google Ads授权失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch('/api/google-ads/accounts');
      const data = await response.json();
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error('获取账户信息失败:', error);
    }
  };

  const fetchCampaigns = async (customerId) => {
    try {
      const response = await fetch(`/api/google-ads/campaigns?customerId=${customerId}`);
      const data = await response.json();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('获取广告活动失败:', error);
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      const response = await fetch('/api/google-ads/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignData)
      });
      
      if (response.ok) {
        await fetchCampaigns(selectedAccount?.id);
      }
    } catch (error) {
      console.error('创建广告活动失败:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'paused': return { color: '#ca8a04', backgroundColor: '#fef3c7' };
      case 'removed': return { color: '#dc2626', backgroundColor: '#fee2e2' };
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
          }}>📊 Google Ads 概览</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理您的Google广告账户和营销活动</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {apiStatus === 'disconnected' && (
            <button
              onClick={() => setShowAuthModal(true)}
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
              🔗 连接账户
            </button>
          )}
          <button
            onClick={() => setCurrentView('campaigns')}
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
            📈 管理广告活动
          </button>
        </div>
      </div>

      {/* 连接状态 */}
      <div style={{
        padding: '16px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        backgroundColor: apiStatus === 'connected' ? '#f0fdf4' : '#fef3c7'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>
            {apiStatus === 'connected' ? '✅' : '⚠️'}
          </span>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#111827',
              margin: '0 0 4px 0'
            }}>
              {apiStatus === 'connected' ? '已连接Google Ads API' : '未连接Google Ads API'}
            </h3>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0'
            }}>
              {apiStatus === 'connected' 
                ? '您的Google Ads账户已成功连接，可以开始管理广告活动'
                : '请先配置API凭证以连接您的Google Ads账户'
              }
            </p>
          </div>
        </div>
      </div>

      {/* 账户列表 */}
      {accounts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>📋 广告账户</h3>
          {accounts.map((account) => (
            <div key={account.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>{account.name}</h4>
                  <p style={{
                    fontSize: '14px',
                    color: '#6b7280',
                    margin: '0 0 4px 0'
                  }}>账户ID: {account.id} | 货币: {account.currency} | 时区: {account.timeZone}</p>
                </div>
                <span style={{
                  padding: '6px 12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  borderRadius: '9999px',
                  ...getStatusColor(account.status)
                }}>
                  {account.status === 'active' ? '活跃' : '暂停'}
                </span>
              </div>
              
              <div style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '16px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    ${account.budget}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>总预算</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    ${account.spend}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>已花费</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {account.impressions.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>展示次数</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {account.clicks}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>点击次数</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                    {account.conversions}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>转化次数</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderCampaigns = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>📈 广告活动管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>创建、管理和优化您的Google广告活动</p>
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

      {/* 广告活动列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {campaigns.map((campaign) => (
          <div key={campaign.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>{campaign.name}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>
                  类型: {campaign.type} | 预算: ${campaign.budget} | 日期: {campaign.startDate} - {campaign.endDate}
                </p>
              </div>
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '9999px',
                ...getStatusColor(campaign.status)
              }}>
                {campaign.status === 'active' ? '活跃' : '暂停'}
              </span>
            </div>
            
            <div style={{
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                  ${campaign.spend}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>花费</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                  {campaign.impressions.toLocaleString()}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>展示</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {campaign.clicks}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>点击</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {campaign.conversions}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>转化</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ef4444' }}>
                  {campaign.ctr}%
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>CTR</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#06b6d4' }}>
                  ${campaign.cpc}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>CPC</div>
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
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '32px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {currentView === 'overview' && renderOverview()}
          {currentView === 'campaigns' && renderCampaigns()}

          {/* 授权模态框 */}
          {showAuthModal && (
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
                maxWidth: '600px',
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
                      marginBottom: '4px',
                      margin: '0 0 4px 0'
                    }}>🔗 Google Ads API 授权</h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      margin: '0'
                    }}>配置您的Google Ads API凭证以连接账户</p>
                  </div>
                  <button
                    onClick={() => setShowAuthModal(false)}
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
                      Developer Token
                    </label>
                    <input
                      type="text"
                      value={authFormData.developerToken}
                      onChange={(e) => setAuthFormData({...authFormData, developerToken: e.target.value})}
                      placeholder="输入您的Developer Token"
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
                      Client ID
                    </label>
                    <input
                      type="text"
                      value={authFormData.clientId}
                      onChange={(e) => setAuthFormData({...authFormData, clientId: e.target.value})}
                      placeholder="输入您的Client ID"
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
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={authFormData.clientSecret}
                      onChange={(e) => setAuthFormData({...authFormData, clientSecret: e.target.value})}
                      placeholder="输入您的Client Secret"
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
                      Refresh Token
                    </label>
                    <input
                      type="text"
                      value={authFormData.refreshToken}
                      onChange={(e) => setAuthFormData({...authFormData, refreshToken: e.target.value})}
                      placeholder="输入您的Refresh Token"
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
                      Customer ID
                    </label>
                    <input
                      type="text"
                      value={authFormData.customerId}
                      onChange={(e) => setAuthFormData({...authFormData, customerId: e.target.value})}
                      placeholder="输入您的Customer ID"
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
                      Login Customer ID
                    </label>
                    <input
                      type="text"
                      value={authFormData.loginCustomerId}
                      onChange={(e) => setAuthFormData({...authFormData, loginCustomerId: e.target.value})}
                      placeholder="输入您的Login Customer ID"
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
                </div>

                <div style={{
                  marginTop: '32px',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setShowAuthModal(false)}
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
                    onClick={handleAuth}
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
                    连接账户
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GoogleAdsManager;
