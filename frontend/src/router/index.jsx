import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Home from '../pages/Home'
import UserLayout from '../pages/user/UserLayout'
import TaskList from '../pages/user/TaskList'
import TaskDetail from '../pages/user/TaskDetail'
import PointsRecord from '../pages/user/PointsRecord'
import GiftShop from '../pages/user/GiftShop'   // ← 加这行

export default function AppRouter() {
    return (
        <Routes>
            {/* 默认跳登录页 */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* 登录页 */}
            <Route path="/login" element={<Login />} />

            {/* 学生端（带侧边栏布局） */}
            <Route path="/user" element={<UserLayout />}>
                <Route index element={<TaskList />} />
                <Route path="tasks" element={<TaskList />} />        {/* ← 加这行 */}
                <Route path="task/:id" element={<TaskDetail />} />
                <Route path="points" element={<PointsRecord />} />
                <Route path="gifts" element={<GiftShop />} />

            </Route>

            {/* 旧主页保留（后面替换为管理员后台） */}
            <Route path="/home" element={<Home />} />

            {/* 404 */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}