import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Layout, Menu, Avatar, Dropdown, Popover, Badge, List, Switch } from 'antd'
import {
    HomeOutlined,
    GiftOutlined,
    TrophyOutlined,
    UserOutlined,
    LogoutOutlined,
    CheckSquareOutlined,
    BellOutlined
} from '@ant-design/icons'
import './UserLayout.css'

import { startReminderEngine } from '../../utils/reminderEngine'
import { requestNotificationPermission, getNotifications, markAllRead, getUnreadCount } from '../../utils/notification'

const { Header, Sider, Content } = Layout

export default function UserLayout() {
    const navigate = useNavigate()
    const location = useLocation()
    const [collapsed, setCollapsed] = useState(false)

    // ===== 通知相关状态 =====
    const [unreadCount, setUnreadCount] = useState(0)
    const [notifications, setNotifications] = useState([])
    const [reminderEnabled, setReminderEnabled] = useState(true)

    useEffect(() => {
        startReminderEngine()
        requestNotificationPermission()
        setNotifications(getNotifications())
        setUnreadCount(getUnreadCount())
        const config = JSON.parse(localStorage.getItem('reminder_config') || '{}')
        if (config.enabled !== undefined) setReminderEnabled(config.enabled)
    }, [])

    const handleOpenNotification = () => {
        markAllRead()
        setUnreadCount(0)
        setNotifications(getNotifications())
    }

    const handleToggleReminder = (checked) => {
        setReminderEnabled(checked)
        const config = JSON.parse(localStorage.getItem('reminder_config') || '{}')
        config.enabled = checked
        localStorage.setItem('reminder_config', JSON.stringify(config))
    }

    // ===== 用户信息 =====
    const userName = localStorage.getItem('user_name') || '用户'
    const userRole = localStorage.getItem('user_role')

    // 侧边栏菜单
    const menuItems = [
        { key: '/user/tasks',  icon: <HomeOutlined />,     label: '任务中心' },
        { key: '/user/gifts',  icon: <GiftOutlined />,     label: '礼品商城' },
        { key: '/user/points', icon: <TrophyOutlined />,   label: '积分明细' }
    ]

    // 右上角用户下拉菜单
    const userMenu = {
        items: [
            {
                key: 'logout',
                icon: <LogoutOutlined />,
                label: '退出登录'
            }
        ],
        onClick: ({ key }) => {
            if (key === 'logout') {
                localStorage.clear()
                navigate('/login')
            }
        }
    }

    return (
        <Layout className="user-layout">
            {/* 侧边栏 */}
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                theme="dark"
                width={220}
            >
                <div className="layout-logo">
                    {collapsed ? '🎓' : '🎓 积分打卡'}
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={({ key }) => navigate(key)}
                />
            </Sider>

            <Layout>
                {/* 顶部 */}
                <Header className="layout-header">
                    <div className="header-left">
                        <CheckSquareOutlined style={{ marginRight: 8 }} />
                        <span>任务驱动型积分打卡系统</span>
                    </div>

                    <div className="header-right">
                        {/* ===== 消息铃铛（加在这里！） ===== */}
                        <Popover
                            content={
                                <div style={{width: 320, maxHeight: 400, overflow: 'auto'}}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <span style={{fontWeight: 600}}>消息通知</span>
                                        <div>
                                            <span style={{fontSize: 12, color: '#999', marginRight: 8}}>
                                                提醒 {reminderEnabled ? '开' : '关'}
                                            </span>
                                            <Switch
                                                size="small"
                                                checked={reminderEnabled}
                                                onChange={handleToggleReminder}
                                            />
                                        </div>
                                    </div>
                                    {notifications.length === 0 ? (
                                        <div style={{textAlign: 'center', padding: 32, color: '#bbb'}}>
                                            暂无消息
                                        </div>
                                    ) : (
                                        <List
                                            dataSource={notifications.slice(0, 10)}
                                            renderItem={item => (
                                                <List.Item
                                                    style={{padding: '10px 0', borderBottom: '1px solid #f5f5f5'}}>
                                                    <List.Item.Meta
                                                        title={<span style={{fontSize: 14}}>{item.title}</span>}
                                                        description={
                                                            <div>
                                                                <div style={{
                                                                    fontSize: 12,
                                                                    color: '#666'
                                                                }}>{item.body}</div>
                                                                <div style={{
                                                                    fontSize: 11,
                                                                    color: '#bbb',
                                                                    marginTop: 4
                                                                }}>{item.time}</div>
                                                            </div>
                                                        }
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    )}
                                </div>
                            }
                            trigger="click"
                            placement="bottomRight"
                            onOpenChange={(open) => open && handleOpenNotification()}
                        >
                            <div className="header-bell" style={{marginTop: 40, marginRight: 240}}>
                                <Badge count={unreadCount} size="small" offset={[-2, 2]}>
                                    <BellOutlined
                                        style={{fontSize: 28, cursor: 'pointer', padding: '0 8px', color: '#fff'}}/>
                                </Badge>
                            </div>
                        </Popover>

                        {/* 用户头像 */}
                        <Dropdown menu={userMenu} placement="bottomRight">
                            <div className="user-info">
                                <Avatar icon={<UserOutlined/>}/>
                                <span style={{ marginLeft: 8 }}>{userName}</span>
                                <span className="role-tag">
                                    {userRole === 'admin' ? '管理员' : '学生'}
                                </span>
                            </div>
                        </Dropdown>
                    </div>
                </Header>

                {/* 内容区 */}
                <Content className="layout-content">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    )
}