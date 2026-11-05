// 开发环境走 Vite 代理，生产环境走同域或真实后端地址
const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function login(studentNo, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentNo, password })
    })
    return res.json()
}