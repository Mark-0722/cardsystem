import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd'
import {
    DashboardOutlined,
    TeamOutlined,
    CheckSquareOutlined,
    GiftOutlined,
    TrophyOutlined,
    SettingOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

export default function AdminLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    const user = JSON.parse(localStorage.getItem('user') || '{}')

    const menuItems = [
        {
            key: '/admin/dashboard',
            icon: <DashboardOutlined />,
            label: '数据概览'
        },
        {
            key: '/admin/students',
            icon: <TeamOutlined />,
            label: '学生管理'
        },
        {
            key: '/admin/tasks',
            icon: <CheckSquareOutlined />,
            label: '任务管理'
        },
        {
            key: '/admin/gifts',
            icon: <GiftOutlined />,
            label: '礼品管理'
        },
        {
            key: '/admin/check-ins',
            icon: <TrophyOutlined />,
            label: '打卡审核'
        },
        {
            key: '/admin/settings',
            icon: <SettingOutlined />,
            label: '系统设置'
        }
    ]

    // 当前选中项
    const selectedKey = menuItems.find(item =>
        location.pathname.startsWith(item.key.split('/').slice(0, 3).join('/'))
    )?.key || '/admin/students'

    const dropdownItems = {
        items: [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录',
                danger: true
            }
        ],
        onClick: ({ key }) => {
            if (key === 'logout') {
                localStorage.removeItem('user')
                localStorage.removeItem('student')
                navigate('/login')
            }
        }
    }

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={220}
            >
                {/* Logo */}
                <div style={{
                    height: 64,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}>
                    <span style={{ fontSize: collapsed ? 16 : 18, color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                        {collapsed ? '🎓' : '🎓 积分打卡后台'}
                    </span>
                </div>

                {/* 菜单 */}
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                    style={{ marginTop: 8 }}
                />
            </Sider>

            <Layout>
                {/* 顶部栏 */}
                <Header style={{
                    background: '#fff',
                    padding: '0 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
                }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ fontSize: 16 }}
                    />

                    <Dropdown menu={dropdownItems} placement="bottomRight">
                        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Avatar style={{ backgroundColor: '#1677ff' }}>
                                {user.name?.charAt(0) || 'A'}
                            </Avatar>
                            <span>{user.name || '管理员'}</span>
                        </div>
                    </Dropdown>
                </Header>

                {/* 内容区 */}
                <Content style={{
                    margin: 24,
                    padding: 0,
                    minHeight: 280,
                    background: '#fff',
                    borderRadius: 8,
                    overflow: 'auto'
                }}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}