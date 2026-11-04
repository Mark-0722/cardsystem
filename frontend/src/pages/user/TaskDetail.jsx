import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Input, Upload, message, Tag, Progress, Modal, Result, Space, Divider } from 'antd'
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    FireOutlined,
    TrophyOutlined,
    UploadOutlined,
    FileImageOutlined,
    SendOutlined
} from '@ant-design/icons'
import './TaskDetail.css'

const { TextArea } = Input

// ===== Mock 任务数据（和 TaskList 里的一致，后续从接口拿） =====
const mockTasks = {
    1: {
        id: 1,
        title: '早读打卡',
        description: '每天早晨朗读英语30分钟，上传朗读录音或笔记截图。要求：朗读内容需包含当天指定的课文段落，发音清晰。',
        points: 10,
        deadline: '今天 08:00 前',
        status: 'pending',
        category: '每日任务',
        difficulty: '简单',
        icon: '📖',
        checkInCount: 12,
        totalDays: 30
    },
    2: {
        id: 2,
        title: '专业课学习打卡',
        description: '学习本学期专业课内容，提交学习笔记（不少于200字）。要求：笔记需包含核心概念、个人理解、疑问点三个部分。',
        points: 20,
        deadline: '今天 22:00 前',
        status: 'pending',
        category: '每日任务',
        difficulty: '中等',
        icon: '📝',
        checkInCount: 8,
        totalDays: 30
    },
    3: {
        id: 3,
        title: '英语单词打卡',
        description: '完成百词斩/墨墨背单词100个，截图上传。要求：截图需显示日期和完成数量。',
        points: 15,
        deadline: '今天 23:00 前',
        status: 'submitted',
        category: '每日任务',
        difficulty: '简单',
        icon: '🔤',
        checkInCount: 15,
        totalDays: 30
    },
    4: {
        id: 4,
        title: '周测验',
        description: '完成本周课程章节测验，正确率需达80%以上。测验涵盖本周所有知识点。',
        points: 50,
        deadline: '本周日 23:59 前',
        status: 'pending',
        category: '周任务',
        difficulty: '困难',
        icon: '📊',
        checkInCount: 3,
        totalDays: 7
    },
    5: {
        id: 5,
        title: '读书分享',
        description: '阅读指定书籍章节，撰写500字读后感。要求：结合个人经历，有独立思考。',
        points: 40,
        deadline: '本周五 22:00 前',
        status: 'approved',
        category: '周任务',
        difficulty: '中等',
        icon: '📚',
        checkInCount: 5,
        totalDays: 7
    }
}

export default function TaskDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const [task, setTask] = useState(null)
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [fileList, setFileList] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [earnedPoints, setEarnedPoints] = useState(0)

    // 加载任务详情
    useEffect(() => {
        setTimeout(() => {
            const found = mockTasks[id]
            if (found) {
                setTask(found)
            }
            setLoading(false)
        }, 300)
    }, [id])

    // 提交打卡
    const handleSubmit = () => {
        if (!content.trim() && fileList.length === 0) {
            message.error('请填写打卡内容或上传图片！')
            return
        }

        setSubmitting(true)

        // 模拟提交（后续替换为接口）
        setTimeout(() => {
            setSubmitting(false)

            // 计算积分（后续由后端返回）
            const points = task.points
            setEarnedPoints(points)

            // 更新状态
            setTask(prev => ({ ...prev, status: 'submitted' }))

            // ✅✅✅ 存到 localStorage，让 TaskList 能读到 ✅✅✅
            const submittedTasks = JSON.parse(localStorage.getItem('submitted_tasks') || '[]')
            // 防止重复添加
            const exists = submittedTasks.find(t => t.id === task.id)
            if (!exists) {
                submittedTasks.push({ id: task.id, status: 'submitted', time: Date.now() })
            } else {
                exists.status = 'submitted'
                exists.time = Date.now()
            }
            localStorage.setItem('submitted_tasks', JSON.stringify(submittedTasks))

            // 显示成功弹窗
            setShowSuccessModal(true)

            message.success('打卡提交成功！等待审核')
        }, 1000)
    }

    // 关闭成功弹窗
    const handleCloseSuccess = () => {
        setShowSuccessModal(false)
        navigate('/user')
    }

    // 状态配置
    const statusConfig = {
        pending:   { color: 'orange', text: '待打卡', icon: <ClockCircleOutlined /> },
        submitted: { color: 'blue',   text: '已提交（等待审核）', icon: <ClockCircleOutlined /> },
        approved:  { color: 'green',  text: '已通过', icon: <CheckCircleFilled /> }
    }

    const difficultyColor = {
        '简单': 'green',
        '中等': 'gold',
        '困难': 'red'
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 60 }}>
                <Progress type="loading" />
                <p style={{ marginTop: 16, color: '#999' }}>加载中...</p>
            </div>
        )
    }

    if (!task) {
        return (
            <Result
                status="404"
                title="任务不存在"
                subTitle="该任务可能已被删除或链接错误"
                extra={
                    <Button type="primary" onClick={() => navigate('/user')}>
                        返回任务列表
                    </Button>
                }
            />
        )
    }

    const status = statusConfig[task.status]
    const progressPercent = Math.round((task.checkInCount / task.totalDays) * 100)

    return (
        <div className="task-detail">
            {/* 返回按钮 */}
            <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/user')}
                style={{ marginBottom: 16 }}
            >
                返回任务列表
            </Button>

            <div className="detail-layout">
                {/* 左侧：任务详情 */}
                <div className="detail-main">
                    <Card className="detail-card">
                        {/* 头部 */}
                        <div className="detail-header">
                            <span className="detail-icon">{task.icon}</span>
                            <div className="detail-title-wrap">
                                <h1 className="detail-title">{task.title}</h1>
                                <Space size={8} style={{ marginTop: 8 }}>
                                    <Tag color={status.color}>{status.icon} {status.text}</Tag>
                                    <Tag color={difficultyColor[task.difficulty]}>{task.difficulty}</Tag>
                                    <Tag>{task.category}</Tag>
                                </Space>
                            </div>
                            <div className="detail-points">
                                <TrophyOutlined style={{ color: '#f5222d', marginRight: 4 }} />
                                <span className="points-num">+{task.points}</span>
                                <span className="points-label">积分</span>
                            </div>
                        </div>

                        <Divider />

                        {/* 描述 */}
                        <div className="detail-section">
                            <h3>📋 任务要求</h3>
                            <p className="detail-desc">{task.description}</p>
                        </div>

                        {/* 打卡进度 */}
                        <div className="detail-section">
                            <h3><FireOutlined /> 打卡进度</h3>
                            <div className="progress-wrap">
                                <Progress
                                    percent={progressPercent}
                                    strokeColor={{ from: '#faad14', to: '#f5222d' }}
                                    format={() => `${task.checkInCount}/${task.totalDays} 天`}
                                />
                            </div>
                        </div>

                        {/* 截止时间 */}
                        <div className="detail-deadline">
                            <ClockCircleOutlined /> 截止时间：{task.deadline}
                        </div>
                    </Card>

                    {/* 打卡提交区（仅 pending 状态显示） */}
                    {task.status === 'pending' && (
                        <Card className="submit-card" title="📝 提交打卡">
                            <div className="submit-form">
                                <div className="form-item">
                                    <label className="form-label">
                                        打卡内容 <span className="required">*</span>
                                    </label>
                                    <TextArea
                                        rows={5}
                                        placeholder="请输入你的打卡内容（学习笔记、心得体会等）..."
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        maxLength={500}
                                        showCount
                                    />
                                </div>

                                <div className="form-item">
                                    <label className="form-label">上传图片（可选）</label>
                                    <Upload
                                        listType="picture-card"
                                        fileList={fileList}
                                        onChange={({ fileList }) => setFileList(fileList)}
                                        beforeUpload={() => false}
                                        maxCount={3}
                                    >
                                        {fileList.length < 3 && (
                                            <div>
                                                <UploadOutlined />
                                                <div style={{ marginTop: 8 }}>上传</div>
                                            </div>
                                        )}
                                    </Upload>
                                    <p className="upload-tip">
                                        <FileImageOutlined /> 支持 jpg/png，最多3张，单张不超过5MB
                                    </p>
                                </div>

                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<SendOutlined />}
                                    loading={submitting}
                                    onClick={handleSubmit}
                                    block
                                    style={{ height: 48, fontSize: 16, marginTop: 24 }}
                                >
                                    提交打卡
                                </Button>
                            </div>
                        </Card>
                    )}

                    {/* 已提交状态 */}
                    {task.status === 'submitted' && (
                        <Card className="submitted-card">
                            <Result
                                icon={<ClockCircleOutlined style={{ color: '#1677ff', fontSize: 48 }} />}
                                title="打卡已提交"
                                subTitle="管理员正在审核中，请耐心等待..."
                                extra={
                                    <Button onClick={() => navigate('/user')}>
                                        返回任务列表
                                    </Button>
                                }
                            />
                        </Card>
                    )}

                    {/* 已通过状态 */}
                    {task.status === 'approved' && (
                        <Card className="approved-card">
                            <Result
                                status="success"
                                title="打卡已完成"
                                subTitle={`获得 ${task.points} 积分！继续保持！`}
                                extra={
                                    <Button type="primary" onClick={() => navigate('/user')}>
                                        继续下一个任务
                                    </Button>
                                }
                            />
                        </Card>
                    )}
                </div>

                {/* 右侧：信息栏 */}
                <div className="detail-side">
                    <Card title="📊 任务信息" className="info-card">
                        <div className="info-item">
                            <span className="info-label">任务类型</span>
                            <span className="info-value">{task.category}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">难度</span>
                            <Tag color={difficultyColor[task.difficulty]}>{task.difficulty}</Tag>
                        </div>
                        <div className="info-item">
                            <span className="info-label">积分奖励</span>
                            <span className="info-value" style={{ color: '#f5222d', fontWeight: 'bold' }}>
                                +{task.points}
                            </span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">已打卡天数</span>
                            <span className="info-value">{task.checkInCount} / {task.totalDays}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">截止时间</span>
                            <span className="info-value">{task.deadline}</span>
                        </div>
                    </Card>

                    <Card title="💡 打卡提示" className="tip-card">
                        <ul className="tip-list">
                            <li>内容需真实有效，抄袭将被驳回</li>
                            <li>图片需清晰，能证明任务完成</li>
                            <li>提交后不可修改，请确认无误再提交</li>
                            <li>审核通常在24小时内完成</li>
                        </ul>
                    </Card>
                </div>
            </div>

            {/* 提交成功弹窗 */}
            <Modal
                open={showSuccessModal}
                footer={null}
                closable={false}
                centered
                width={400}
            >
                <div className="success-modal">
                    <div className="success-icon">🎉</div>
                    <h2 className="success-title">打卡提交成功！</h2>
                    <div className="success-points">
                        <TrophyOutlined /> +{earnedPoints} 积分
                    </div>
                    <p className="success-tip">等待管理员审核后积分将正式到账</p>
                    <Button
                        type="primary"
                        size="large"
                        block
                        onClick={handleCloseSuccess}
                        style={{ marginTop: 24, height: 44 }}
                    >
                        返回任务列表
                    </Button>
                </div>
            </Modal>
        </div>
    )
}