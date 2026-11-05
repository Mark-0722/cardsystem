import { useState, useEffect } from 'react'
import { Table, Button, Input, Modal, Form, message, Popconfirm, Space, Tag, Select } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, CheckOutlined, StopOutlined } from '@ant-design/icons'

const statusColor = {
    DRAFT: 'default',
    PUBLISHED: 'green',
    OFFLINE: 'red'
}

const statusLabel = {
    DRAFT: '草稿',
    PUBLISHED: '已发布',
    OFFLINE: '已下架'
}

const typeLabel = {
    DAILY: '每日',
    WEEKLY: '每周',
    SINGLE: '单次'
}

export default function TaskManage() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [statusFilter, setStatusFilter] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form] = Form.useForm()

    const fetchList = async () => {
        setLoading(true)
        try {
            const url = statusFilter ? `/api/admin/tasks?status=${statusFilter}` : '/api/admin/tasks'
            const res = await fetch(url)
            const json = await res.json()
            if (json.code === 200) setData(json.data || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchList() }, [statusFilter])

    const handleSubmit = async () => {
        const values = await form.validateFields()
        if (editing) {
            const res = await fetch(`/api/admin/tasks/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
            const json = await res.json()
            if (json.code === 200) { message.success('更新成功'); setModalOpen(false); fetchList() }
            else message.error(json.msg)
        } else {
            const res = await fetch('/api/admin/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
            const json = await res.json()
            if (json.code === 200) { message.success('创建成功'); setModalOpen(false); form.resetFields(); fetchList() }
            else message.error(json.msg)
        }
    }

    const handlePublish = async (id) => {
        const res = await fetch(`/api/admin/tasks/${id}/publish`, { method: 'POST' })
        const json = await res.json()
        if (json.code === 200) { message.success('已发布'); fetchList() }
    }

    const handleOffline = async (id) => {
        const res = await fetch(`/api/admin/tasks/${id}/offline`, { method: 'POST' })
        const json = await res.json()
        if (json.code === 200) { message.success('已下架'); fetchList() }
    }

    const handleDelete = async (id) => {
        const res = await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' })
        const json = await res.json()
        if (json.code === 200) { message.success('删除成功'); fetchList() }
    }

    const columns = [
        { title: '任务名称', dataIndex: 'title', key: 'title' },
        {
            title: '类型', dataIndex: 'type', key: 'type', width: 80,
            render: (v) => typeLabel[v] || v
        },
        { title: '奖励积分', dataIndex: 'points', key: 'points', width: 90 },
        {
            title: '状态', dataIndex: 'status', key: 'status', width: 90,
            render: (v) => <Tag color={statusColor[v]}>{statusLabel[v] || v}</Tag>
        },
        { title: '开始日期', dataIndex: 'startDate', key: 'startDate', width: 120 },
        { title: '结束日期', dataIndex: 'endDate', key: 'endDate', width: 120 },
        {
            title: '操作', key: 'action', width: 260,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditing(record)
                        form.setFieldsValue(record)
                        setModalOpen(true)
                    }}>编辑</Button>
                    {record.status === 'PUBLISHED'
                        ? <Button size="small" icon={<StopOutlined />} onClick={() => handleOffline(record.id)}>下架</Button>
                        : <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handlePublish(record.id)}>发布</Button>
                    }
                    <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
                        <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div style={{ padding: 24 }}>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Space>
                    <Select
                        placeholder="全部状态"
                        value={statusFilter || undefined}
                        onChange={(v) => setStatusFilter(v || '')}
                        style={{ width: 140 }}
                        options={[
                            { value: '', label: '全部状态' },
                            { value: 'DRAFT', label: '草稿' },
                            { value: 'PUBLISHED', label: '已发布' },
                            { value: 'OFFLINE', label: '已下架' }
                        ]}
                    />
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditing(null)
                    form.resetFields()
                    form.setFieldsValue({ type: 'SINGLE', status: 'DRAFT', points: 10, totalCount: 1 })
                    setModalOpen(true)
                }}>新建任务</Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10, showTotal: (t) => `共 ${t} 条` }}
            />

            <Modal
                title={editing ? '编辑任务' : '新建任务'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
                width={560}
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="title" label="任务名称" rules={[{ required: true, message: '请输入任务名称' }]}>
                        <Input placeholder="如：每日早起打卡" />
                    </Form.Item>
                    <Form.Item name="description" label="任务描述">
                        <Input.TextArea rows={3} placeholder="任务详情说明" />
                    </Form.Item>
                    <Form.Item name="type" label="任务类型" rules={[{ required: true }]}>
                        <Select options={[
                            { value: 'DAILY', label: '每日' },
                            { value: 'WEEKLY', label: '每周' },
                            { value: 'SINGLE', label: '单次' }
                        ]} />
                    </Form.Item>
                    <Form.Item name="points" label="奖励积分" rules={[{ required: true }]}>
                        <Input type="number" placeholder="完成后奖励的积分" />
                    </Form.Item>
                    <Form.Item name="totalCount" label="需完成次数">
                        <Input type="number" placeholder="如连续打卡7天填7" />
                    </Form.Item>
                    <Form.Item name="startDate" label="开始日期">
                        <Input type="date" />
                    </Form.Item>
                    <Form.Item name="endDate" label="结束日期">
                        <Input type="date" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}