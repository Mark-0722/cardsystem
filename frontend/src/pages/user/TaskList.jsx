import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Tag, Progress, Button, Empty, Row, Col } from 'antd'
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    FireOutlined
} from '@ant-design/icons'
import './TaskList.css'

// ===== Mock 任务数据（放在组件外面，纯数据，没问题） =====
const mockTasks = [
    {
        id: 1,
        title: '早读打卡',
        description: '每天早晨朗读英语123456分钟，上传朗读录音或笔记截图',
        points: 10,
        deadline: '今天 08:00 前',
        status: 'pending',
        category: '每日任务',
        difficulty: '简单',
        icon: '📖'
    },
    {
        id: 2,
        title: '专业课学习打卡',
        description: '学习本学期专业课内容，提交学习笔记（不少于200字）',
        points: 20,
        deadline: '今天 22:00 前',
        status: 'pending',
        category: '每日任务',
        difficulty: '中等',
        icon: '📝'
    },
    {
        id: 3,
        title: '英语单词打卡',
        description: '完成百词斩/墨墨背单词100个，截图上传',
        points: 15,
        deadline: '今天 23:00 前',
        status: 'submitted',
        category: '每日任务',
        difficulty: '简单',
        icon: '🔤'
    },
    {
        id: 4,
        title: '周测验',
        description: '完成本周课程章节测验，正确率需达80%以上',
        points: 50,
        deadline: '本周日 23:59 前',
        status: 'pending',
        category: '周任务',
        difficulty: '困难',
        icon: '📊'
    },
    {
        id: 5,
        title: '读书分享',
        description: '阅读指定书籍章节，撰写500字读后感',
        points: 40,
        deadline: '本周五 22:00 前',
        status: 'approved',
        category: '周任务',
        difficulty: '中等',
        icon: '📚'
    }
]

export default function TaskList() {
    const navigate = useNavigate()
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(true)

    // ✅✅✅ 只有一个 useEffect，在组件内部，读 localStorage 合并状态 ✅✅✅
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            const submittedTasks = JSON.parse(localStorage.getItem('submitted_tasks') || '[]')

            const updatedTasks = mockTasks.map(task => {
                const submitted = submittedTasks.find(t => t.id === task.id)
                if (submitted) {
                    return { ...task, status: submitted.status }
                }
                return { ...task }
            })

            setTasks(updatedTasks)
            setLoading(false)
        }, 500)
    }, [])

    // 统计
    const totalPoints = tasks
        .filter(t => t.status === 'approved')
        .reduce((sum, t) => sum + t.points, 0)
    const completedCount = tasks.filter(t => t.status === 'approved').length
    const pendingCount = tasks.filter(t => t.status === 'pending').length
    const progressPercent = Math.round((completedCount / tasks.length) * 100) || 0

    // 状态标签配置
    const statusConfig = {
        pending:   { color: 'orange', text: '待打卡', icon: <ClockCircleOutlined /> },
        submitted: { color: 'blue',   text: '已提交', icon: <ClockCircleOutlined /> },
        approved:  { color: 'green',  text: '已通过', icon: <CheckCircleFilled /> }
    }

    const difficultyColor = {
        '简单': 'green',
        '中等': 'gold',
        '困难': 'red'
    }

    return (
        <div className="task-list">
            {/* 顶部统计卡片 */}
            <Row gutter={16} className="stats-row">
                <Col span={6}>
                    <Card className="stat-card stat-total">
                        <div className="stat-value">{totalPoints}</div>
                        <div className="stat-label">累计积分</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card stat-completed">
                        <div className="stat-value">{completedCount}</div>
                        <div className="stat-label">已完成任务</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card stat-pending">
                        <div className="stat-value">{pendingCount}</div>
                        <div className="stat-label">待完成任务</div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card className="stat-card stat-streak">
                        <div className="stat-value">7 <span className="streak-unit">天</span></div>
                        <div className="stat-label">
                            <FireOutlined /> 连续打卡
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* 今日进度 */}
            <Card className="progress-card" title="今日完成进度">
                <Progress
                    percent={progressPercent}
                    strokeColor={{ from: '#108ee9', to: '#87d068' }}
                    status="active"
                />
            </Card>

            {/* 任务列表 */}
            <div className="task-section-title">今日任务</div>
            <Row gutter={[16, 16]}>
                {tasks.map(task => {
                    const status = statusConfig[task.status]
                    return (
                        <Col xs={24} sm={12} lg={8} key={task.id}>
                            <Card
                                className={`task-card task-${task.status}`}
                                hoverable
                                onClick={() => navigate(`/user/task/${task.id}`)}
                            >
                                <div className="task-card-header">
                                    <span className="task-icon">{task.icon}</span>
                                    <Tag color={status.color}>
                                        {status.icon} {status.text}
                                    </Tag>
                                </div>

                                <div className="task-title">{task.title}</div>
                                <div className="task-desc">{task.description}</div>

                                <div className="task-card-footer">
                                    <div className="task-meta">
                                        <Tag color={difficultyColor[task.difficulty]}>
                                            {task.difficulty}
                                        </Tag>
                                        <span className="task-category">{task.category}</span>
                                    </div>
                                    <div className="task-points">+{task.points} 积分</div>
                                </div>

                                <div className="task-deadline">
                                    <ClockCircleOutlined /> 截止：{task.deadline}
                                </div>

                                {task.status === 'pending' && (
                                    <Button
                                        type="primary"
                                        block
                                        style={{ marginTop: 12 }}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            navigate(`/user/task/${task.id}`)
                                        }}
                                    >
                                        立即打卡
                                    </Button>
                                )}
                                {task.status === 'submitted' && (
                                    <Button block disabled style={{ marginTop: 12 }}>
                                        等待审核
                                    </Button>
                                )}
                                {task.status === 'approved' && (
                                    <Button
                                        type="primary"
                                        block
                                        disabled
                                        style={{ marginTop: 12, background: '#52c41a', borderColor: '#52c41a' }}
                                    >
                                        ✅ 已完成
                                    </Button>
                                )}
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            {tasks.length === 0 && !loading && (
                <Empty description="暂无任务" />
            )}
        </div>
    )
}