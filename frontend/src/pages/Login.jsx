import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Checkbox, Tabs, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import './Login.css'

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [role, setRole] = useState('student')
    const [form] = Form.useForm()              // ← 这行必须有！

    // 页面加载时，读取 localStorage 里的记住密码
    useEffect(() => {
        const savedAccount = localStorage.getItem('remember_account')
        const savedRole = localStorage.getItem('remember_role')
        if (savedAccount) {
            form.setFieldsValue({ account: savedAccount })
        }
        if (savedRole) {
            setRole(savedRole)
        }
    }, [form])

    const onFinish = (values) => {
        setLoading(true)

        const { account, password, remember } = values

        // 模拟账号
        const mockUsers = {
            student: { account: '2024001', password: '123456', name: '张三' },
            admin:   { account: 'admin',   password: 'admin',  name: '管理员' }
        }

        const user = mockUsers[role]

        setTimeout(() => {
            setLoading(false)

            if (account !== user.account && password !== user.password) {
                if (remember) {
                    localStorage.setItem('remember_account', account)
                    localStorage.setItem('remember_role', role)
                } else {
                    localStorage.removeItem('remember_account')
                    localStorage.removeItem('remember_role')
                }

                localStorage.setItem('token', 'mock-token-' + Date.now())
                localStorage.setItem('user_role', role)
                localStorage.setItem('user_name', user.name)

                message.success(`欢迎回来，${user.name}！`)
                navigate('/user', { replace: true })
            } else {
                message.error('账号或密码错误！')
            }
        }, 800)
    }

    return (
        <div className="login-container">
            <div className="login-left">
                <h1>🎓 积分打卡系统</h1>
                <p>任务驱动 · 积分激励 · 礼品兑换</p>
                <div className="login-features">
                    <p>✅ 任务型打卡，学习更高效</p>
                    <p>✅ 积分激励，激发动力</p>
                    <p>✅ 礼品商城，兑换心仪好礼</p>
                </div>
            </div>

            <div className="login-right">
                <Card className="login-card" bordered={false}>
                    <h2 className="login-title">用户登录test : 001</h2>

                    <Tabs
                        activeKey={role}
                        onChange={setRole}
                        centered
                        items={[
                            { key: 'student', label: '学生登录' },
                            { key: 'admin',   label: '管理员登录' }
                        ]}
                    />

                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        initialValues={{ remember: true }}
                        size="large"
                    >
                        <Form.Item
                            name="account"
                            rules={[{ required: true, message: '请输入学号/工号！' }]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder={role === 'student' ? '学号' : '工号'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入密码！' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined />}
                                placeholder="密码"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                block
                                style={{ height: 44, fontSize: 16 }}
                            >
                                登  录
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="login-tip">
                        {role === 'student'
                            ? '测试账号：2024001 / 123456'
                            : '测试账号：admin / admin'}
                    </div>
                </Card>
            </div>
        </div>
    )
}