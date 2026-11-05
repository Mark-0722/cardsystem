import { useState, useEffect } from 'react'
import { Table, Button, Input, Modal, Form, message, Popconfirm, Space, Tag } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'

export default function StudentManage() {
    const [data, setData] = useState([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [keyword, setKeyword] = useState('')
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form] = Form.useForm()

    // 加载列表
    const fetchList = async (kw = '') => {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/students${kw ? '?keyword=' + kw : ''}`)
            const json = await res.json()
            if (json.code === 200) {
                setData(json.data || [])
                setTotal(json.total || 0)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchList()
    }, [])

    // 新增 / 编辑
    const handleSubmit = async () => {
        const values = await form.validateFields()
        if (editing) {
            // 编辑
            const res = await fetch(`/api/admin/students/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values)
            })
            const json = await res.json()
            if (json.code === 200) {
                message.success('更新成功')
                setModalOpen(false)
                fetchList(keyword)
            } else {
                message.error(json.msg)
            }
        } else {
            // 新增
            const res = await fetch('/api/admin/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...values, points: 0 })
            })
            const json = await res.json()
            if (json.code === 200) {
                message.success('添加成功，默认密码 123456')
                setModalOpen(false)
                form.resetFields()
                fetchList(keyword)
            } else {
                message.error(json.msg)
            }
        }
    }

    // 重置密码
    const handleResetPwd = async (id) => {
        const res = await fetch(`/api/admin/students/${id}/reset-password`, { method: 'POST' })
        const json = await res.json()
        if (json.code === 200) {
            message.success('密码已重置为 123456')
        } else {
            message.error(json.msg)
        }
    }

    // 删除
    const handleDelete = async (id) => {
        const res = await fetch(`/api/admin/students/${id}`, { method: 'DELETE' })
        const json = await res.json()
        if (json.code === 200) {
            message.success('删除成功')
            fetchList(keyword)
        } else {
            message.error(json.msg)
        }
    }

    const columns = [
        { title: '学号', dataIndex: 'studentNo', key: 'studentNo' },
        { title: '姓名', dataIndex: 'name', key: 'name' },
        { title: '电话', dataIndex: 'phone', key: 'phone' },
        { title: '邮箱', dataIndex: 'email', key: 'email' },
        { title: '积分', dataIndex: 'points', key: 'points', width: 80 },
        {
            title: '状态', dataIndex: 'enabled', key: 'enabled', width: 80,
            render: (v) => v !== false
                ? <Tag color="green">正常</Tag>
                : <Tag color="red">已禁用</Tag>
        },
        {
            title: '操作', key: 'action', width: 240,
            render: (_, record) => (
                <Space>
                    <Button size="small" icon={<EditOutlined />} onClick={() => {
                        setEditing(record)
                        form.setFieldsValue(record)
                        setModalOpen(true)
                    }}>编辑</Button>
                    <Button size="small" icon={<ReloadOutlined />} onClick={() => handleResetPwd(record.id)}>重置密码</Button>
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
                    <Input
                        placeholder="搜索学号/姓名"
                        prefix={<SearchOutlined />}
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                        onPressEnter={() => fetchList(keyword)}
                        style={{ width: 220 }}
                    />
                    <Button onClick={() => fetchList(keyword)}>搜索</Button>
                    <Button onClick={() => { setKeyword(''); fetchList('') }}>重置</Button>
                </Space>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => {
                    setEditing(null)
                    form.resetFields()
                    setModalOpen(true)
                }}>新增学生</Button>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                rowKey="id"
                pagination={{ pageSize: 10, total, showTotal: (t) => `共 ${t} 条` }}
            />

            <Modal
                title={editing ? '编辑学生' : '新增学生'}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                destroyOnClose
            >
                <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                    <Form.Item name="studentNo" label="学号" rules={[{ required: !editing, message: '请输入学号' }]}>
                        <Input disabled={!!editing} placeholder="如 2024002" />
                    </Form.Item>
                    <Form.Item name="name" label="姓名" rules={[{ required: true, message: '请输入姓名' }]}>
                        <Input placeholder="学生姓名" />
                    </Form.Item>
                    <Form.Item name="phone" label="电话">
                        <Input placeholder="手机号" />
                    </Form.Item>
                    <Form.Item name="email" label="邮箱">
                        <Input placeholder="邮箱地址" />
                    </Form.Item>
                    {editing && (
                        <Form.Item name="points" label="积分">
                            <Input type="number" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    )
}