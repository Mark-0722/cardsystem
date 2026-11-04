import { useState, useEffect } from 'react'
import { Card, Tag, Empty, Tabs, Timeline, Badge, Statistic, Row, Col, Result } from 'antd'
import {
    TrophyOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    FireOutlined,
    GiftOutlined
} from '@ant-design/icons'
import './PointsRecord.css'

// ===== Mock 积分流水数据 =====
const mockRecords = [
    {
        id: 1,
        taskName: '早读打卡',
        taskId: 1,
        points: 10,
        type: 'earn',           // earn / spend / refund
        status: 'approved',    // approved / pending / rejected
        time: '2026-10-08 07:32',
        description: '每日早读打卡完成'
    },
    {
        id: 2,
        taskName: '英语单词打卡',
        taskId: 3,
        points: 15,
        type: 'earn',
        status: 'pending',
        time: '2026-10-08 21:15',
        description: '等待管理员审核'
    },
    {
        id: 3,
        taskName: '兑换笔记本',
        taskId: null,
        points: 200,
        type: 'spend',
        status: 'approved',
        time: '2026-10-07 16:40',
        description: '礼品商城兑换'
    },
    {
        id: 4,
        taskName: '专业课学习打卡',
        taskId: 2,
        points: 20,
        type: 'earn',
        status: 'approved',
        time: '2026-10-07 21:05',
        description: '每日专业课打卡完成'
    },
    {
        id: 5,
        taskName: '周测验',
        taskId: 4,
        points: 50,
        type: 'earn',
        status: 'rejected',
        time: '2026-10-06 19:20',
        description: '正确率未达80%，请重新提交'
    },
    {
        id: 6,
        taskName: '读书分享',
        taskId: 5,
        points: 40,
        type: 'earn',
        status: 'approved',
        time: '2026-10-06 10:12',
        description: '读后感审核通过'
    },
    {
        id: 7,
        taskName: '兑换咖啡券',
        taskId: null,
        points: 80,
        type: 'spend',
        status: 'approved',
        time: '2026-10-05 14:30',
        description: '礼品商城兑换'
    },
    {
        id: 8,
        taskName: '早读打卡',
        taskId: 1,
        points: 10,
        type: 'earn',
        status: 'approved',
        time: '2026-10-05 07:45',
        description: '每日早读打卡完成'
    }
]

const statusConfig = {
    approved: { color: 'green', text: '已到账', icon: <CheckCircleFilled /> },
    pending:  { color: 'blue',  text: '审核中', icon: <ClockCircleOutlined /> },
    rejected: { color: 'red',   text: '已驳回', icon: <CloseCircleOutlined /> }
}

export default function PointsRecord() {
    const [records, setRecords] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('all')

    // 加载数据
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setRecords(mockRecords)
            setLoading(false)
        }, 400)
    }, [])

    // 筛选
    const filteredRecords = activeTab === 'all'
        ? records
        : records.filter(r => r.status === activeTab)

    // 统计
    const totalPoints = records
        .filter(r => r.status === 'approved')
        .reduce((sum, r) => sum + (r.type === 'earn' ? r.points : -r.points), 0)

    const todayPoints = records
        .filter(r => r.time.startsWith('2026-10-08') && r.status === 'approved' && r.type === 'earn')
        .reduce((sum, r) => sum + r.points, 0)

    const pendingPoints = records
        .filter(r => r.status === 'pending' && r.type === 'earn')
        .reduce((sum, r) => sum + r.points, 0)

    // 按日期分组
    const groupedByDate = filteredRecords.reduce((groups, record) => {
        const date = record.time.split(' ')[0]
        if (!groups[date]) groups[date] = []
        groups[date].push(record)
        return groups
    }, {})

    const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

    return (
        <div className="points-record">
            {/* 顶部统计 */}
            <Row gutter={16} className="record-stats-row">
                <Col span={8}>
                    <Card className="record-stat-card">
                        <Statistic
                            title="累计积分"
                            value={totalPoints}
                            prefix={<TrophyOutlined style={{ color: '#f5222d' }} />}
                            suffix="分"
                            valueStyle={{ color: '#f5222d', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="record-stat-card">
                        <Statistic
                            title="今日获得"
                            value={todayPoints}
                            prefix={<FireOutlined style={{ color: '#fa8c16' }} />}
                            suffix="分"
                            valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card className="record-stat-card">
                        <Statistic
                            title="审核中"
                            value={pendingPoints}
                            prefix={<ClockCircleOutlined style={{ color: '#1677ff' }} />}
                            suffix="分"
                            valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* 筛选 Tabs */}
            <Card className="record-filter-card" style={{ marginTop: 16 }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={[
                        { key: 'all',     label: `全部 (${records.length})` },
                        { key: 'approved', label: `已到账 (${records.filter(r => r.status === 'approved').length})` },
                        { key: 'pending',  label: `审核中 (${records.filter(r => r.status === 'pending').length})` },
                        { key: 'rejected', label: `已驳回 (${records.filter(r => r.status === 'rejected').length})` }
                    ]}
                />
            </Card>

            {/* 流水列表 */}
            <Card className="record-list-card" style={{ marginTop: 16 }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: 60 }}>
                        <Badge status="processing" />
                        <p style={{ marginTop: 16, color: '#999' }}>加载中...</p>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <Empty
                        description="暂无积分记录"
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                ) : (
                    <div className="record-timeline">
                        {sortedDates.map(date => (
                            <div key={date} className="record-date-group">
                                <div className="record-date-header">
                                    {date === '2026-10-08' ? '今天' : date}
                                </div>
                                {groupedByDate[date].map(record => {
                                    const status = statusConfig[record.status]
                                    const isEarn = record.type === 'earn'
                                    return (
                                        <div key={record.id} className={`record-item record-${record.status}`}>
                                            <div className="record-item-left">
                                                <div className={`record-icon ${isEarn ? 'earn' : 'spend'}`}>
                                                    {isEarn
                                                        ? <ArrowUpOutlined />
                                                        : <GiftOutlined />
                                                    }
                                                </div>
                                                <div className="record-info">
                                                    <div className="record-task-name">{record.taskName}</div>
                                                    <div className="record-desc">{record.description}</div>
                                                    <div className="record-time">{record.time}</div>
                                                </div>
                                            </div>
                                            <div className="record-item-right">
                                                <div className={`record-points ${isEarn ? 'earn' : 'spend'}`}>
                                                    {isEarn ? '+' : '-'}{record.points}
                                                </div>
                                                <Tag color={status.color} className="record-status-tag">
                                                    {status.icon} {status.text}
                                                </Tag>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    )
}