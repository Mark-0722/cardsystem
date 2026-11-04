const REMINDER_KEY = 'reminder_config'

// 默认提醒配置
const defaultConfig = {
    enabled: true,
    times: [
        { id: 1, time: '07:30', taskName: '早读打卡', enabled: true },
        { id: 2, time: '21:00', taskName: '专业课学习打卡', enabled: true },
        { id: 3, time: '22:30', taskName: '英语单词打卡', enabled: true }
    ]
}

export function getReminderConfig() {
    const stored = localStorage.getItem(REMINDER_KEY)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(REMINDER_KEY, JSON.stringify(defaultConfig))
    return { ...defaultConfig }
}

export function saveReminderConfig(config) {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(config))
}

export function toggleReminder(enabled) {
    const config = getReminderConfig()
    config.enabled = enabled
    saveReminderConfig(config)
}