import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

export default function Home() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})

    useEffect(() => {
        // 检查登录态
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('user_role')
        const name = localStorage.getItem('user_name')

        if (!token) {
            navigate('/login')
            return
        }

        setUser({ role, name })
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/login')
    }

    return (
        <div style={{ padding: 60, textAlign: 'center' }}>
            <h1>🎉 登录成功！</h1>
            <p style={{ fontSize: 18, marginTop: 20 }}>
                欢迎你，<strong>{user.name}</strong>
            </p>
            <p style={{ color: '#666' }}>
                当前角色：{user.role === 'admin' ? '管理员' : '学生'}
            </p>
            <Button
                type="primary"
                danger
                size="large"
                onClick={handleLogout}
                style={{ marginTop: 30 }}
            >
                退出登录
            </Button>
        </div>
    )
}