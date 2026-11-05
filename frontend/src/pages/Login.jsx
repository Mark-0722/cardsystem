import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Input, Button, Checkbox, Tabs, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login as loginApi } from '../api/auth'

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


    const onFinish = async (values) => {
        setLoading(true);
        try {
            const account = values.account || '';
            const password = values.password || '';

            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // ✅ 加上 role 传给后端
                body: JSON.stringify({ account, password, role })
            });

            const data = await res.json();

            if (data.code === 200) {
                // ✅ 统一存 user（之前存的 key 是 'student'，现在统一）
                localStorage.setItem('user', JSON.stringify(data.data));
                // 兼容旧代码，也存一份 student
                localStorage.setItem('student', JSON.stringify(data.data));

                // 记住密码
                if (values.remember) {
                    localStorage.setItem('remember_account', account);
                    localStorage.setItem('remember_role', role);
                } else {
                    localStorage.removeItem('remember_account');
                    localStorage.removeItem('remember_role');
                }

                message.success('登录成功！');

                // ✅ 按角色跳转
                if (data.data.role === 'admin') {
                    alert("管理员登录")
                    navigate('/admin');
                } else {
                    alert("学生登录")
                    navigate('/user');
                }
            } else if (data.code === 403) {
                // 管理员 Tab 但账号不是管理员
                message.error(data.msg || '无管理员权限');
            } else {
                message.error(data.msg || '登录失败');
            }
        } catch (e) {
            console.error('请求报错:', e);
            message.error('网络错误，请稍后重试');
        } finally {
            setLoading(false);
        }
    };



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
                            {key: 'student', label: '学生登录'},
                            {key: 'admin', label: '管理员登录'}
                        ]}
                    />

                    <Form
                        form={form}
                        name="login"
                        onFinish={onFinish}
                        initialValues={{remember: true}}
                        size="large"
                    >
                        <Form.Item
                            name="account"
                            rules={[{required: true, message: '请输入学号/工号！'}]}
                        >
                            <Input
                                prefix={<UserOutlined/>}
                                placeholder={role === 'student' ? '学号' : '工号'}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[{required: true, message: '请输入密码！'}]}
                        >
                            <Input.Password
                                prefix={<LockOutlined/>}
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
                                style={{height: 44, fontSize: 16}}
                            >
                                登 录
                            </Button>
                        </Form.Item>
                    </Form>

                    <div className="login-tip">
                        {role === 'student'
                            ? '测试账号：2024001 / 123456'
                            : '测试账号：2024001 / 123456（管理员）'}
                    </div>
                </Card>
            </div>
        </div>
    )
}