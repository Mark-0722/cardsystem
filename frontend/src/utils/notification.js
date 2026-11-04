// ===== 浏览器系统通知 =====
export function requestNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('此浏览器不支持系统通知')
        return false
    }
    if (Notification.permission === 'granted') return true
    if (Notification.permission !== 'denied') {
        Notification.requestPermission()
    }
    return Notification.permission === 'granted'
}

export function showSystemNotification(title, body) {
    if (Notification.permission !== 'granted') return
    const notif = new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'checkin-reminder',
        renotify: true
    })
    notif.onclick = () => {
        window.focus()
        notif.close()
    }
}

// ===== 页面内消息存储 =====
const MSG_KEY = 'checkin_notifications'

export function getNotifications() {
    return JSON.parse(localStorage.getItem(MSG_KEY) || '[]')
}

export function addNotification({ type, title, body }) {
    const list = getNotifications()
    list.unshift({
        id: Date.now(),
        type,           // 'reminder' | 'review' | 'system'
        title,
        body,
        time: new Date().toLocaleString('zh-CN'),
        read: false
    })
    // 最多保留 50 条
    if (list.length > 50) list.length = 50
    localStorage.setItem(MSG_KEY, JSON.stringify(list))
}

export function markAllRead() {
    const list = getNotifications()
    list.forEach(n => { n.read = true })
    localStorage.setItem(MSG_KEY, JSON.stringify(list))
}

export function getUnreadCount() {
    return getNotifications().filter(n => !n.read).length
}