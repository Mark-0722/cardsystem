import { getReminderConfig } from './reminder'
import { getNotifications, addNotification, showSystemNotification } from './notification'

// 读取已打卡的任务 ID 列表（从 localStorage）
function getTodaySubmittedTaskIds() {
    const submitted = JSON.parse(localStorage.getItem('submitted_tasks') || '[]')
    // 只算今天的
    const today = new Date().toISOString().split('T')[0]
    return submitted
        .filter(s => {
            const d = new Date(s.time).toISOString().split('T')[0]
            return d === today
        })
        .map(s => s.id)
}

// 检查是否需要提醒
function checkReminders() {
    const config = getReminderConfig()
    if (!config.enabled) return

    const now = new Date()
    const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const submittedIds = getTodaySubmittedTaskIds()

    // 匹配当前时间点的提醒
    config.times.forEach(reminder => {
        if (!reminder.enabled) return
        if (reminder.time !== current) return

        // 检查这个任务今天是否已打卡
        // 这里用 taskName 匹配（简单版，后续接后端用 taskId）
        const taskNameMap = {
            '早读打卡': 1,
            '专业课学习打卡': 2,
            '英语单词打卡': 3
        }
        const taskId = taskNameMap[reminder.taskName]
        if (taskId && submittedIds.includes(taskId)) {
            return // 已打卡，不提醒
        }

        // 发通知
        const title = '⏰ 打卡提醒'
        const body = `${reminder.taskName} 还没完成哦，快去打卡赚积分吧！`

        showSystemNotification(title, body)
        addNotification({
            type: 'reminder',
            title,
            body
        })
    })
}

// 启动引擎
let timer = null

export function startReminderEngine() {
    if (timer) return // 已启动

    // 每分钟检查一次
    timer = setInterval(checkReminders, 60 * 1000)

    // 立即检查一次（防止刚好在提醒时间点刷新）
    checkReminders()
}

export function stopReminderEngine() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}