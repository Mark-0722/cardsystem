// 读取当前可用积分（默认 500 演示用）
export function getBalance() {
    const stored = localStorage.getItem('points_balance')
    return stored ? parseInt(stored, 10) : 500
}

// 保存积分
export function setBalance(value) {
    localStorage.setItem('points_balance', value)
}

// 扣积分
export function deductPoints(amount) {
    const current = getBalance()
    if (current < amount) return false
    setBalance(current - amount)
    return true
}

// 加积分
export function addPoints(amount) {
    const current = getBalance()
    setBalance(current + amount)
}

// 读取兑换记录（用于礼品页展示已兑换数量，可选）
export function getRedeemHistory() {
    return JSON.parse(localStorage.getItem('redeem_history') || '[]')
}

export function addRedeemRecord(record) {
    const list = getRedeemHistory()
    list.unshift(record)
    localStorage.setItem('redeem_history', JSON.stringify(list))
}