import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Modal, Empty, Row, Col, message } from 'antd'
import {
    GiftOutlined,
    TrophyOutlined,
    CheckCircleFilled,
    ExclamationCircleOutlined,
    ShoppingOutlined
} from '@ant-design/icons'
import { getBalance, deductPoints, addRedeemRecord } from '../../utils/points'
import './GiftShop.css'

// ===== Mock 礼品数据 =====
const mockGifts = [
    {
        id: 1,
        name: '星巴克咖啡券',
        points: 80,
        stock: 23,
        icon: '☕',
        desc: '中杯任意饮品兑换券一张，校内门店可用',
        hot: true
    },
    {
        id: 2,
        name: '定制笔记本',
        points: 200,
        stock: 8,
        icon: '📓',
        desc: 'A5 硬面笔记本，简约设计，附书签带'
    },
    {
        id: 3,
        name: '蓝牙耳机',
        points: 1200,
        stock: 3,
        icon: '🎧',
        desc: '入耳式蓝牙耳机，续航 20 小时'
    },
    {
        id: 4,
        name: '校园文创帆布袋',
        points: 60,
        stock: 50,
        icon: '👜',
        desc: '校徽刺绣帆布袋，轻便耐用'
    },
    {
        id: 5,
        name: '保温杯',
        points: 150,
        stock: 0,
        icon: '🧋',
        desc: '316 不锈钢保温杯，500ml，12 小时保温'
    },
    {
        id: 6,
        name: '罗技无线鼠标',
        points: 800,
        stock: 5,
        icon: '🖱️',
        desc: '人体工学设计，2.4G 无线连接'
    },
    {
        id: 7,
        name: '京东 100 元券',
        points: 500,
        stock: 12,
        icon: '🎫',
        desc: '满 100.01 可用，无门槛通用'
    },
    {
        id: 8,
        name: '运动毛巾套装',
        points: 100,
        stock: 30,
        icon: '🏃',
        desc: '速干吸汗运动毛巾，3 条装'
    }
]

export default function GiftShop() {
    const navigate = useNavigate()
    const [balance, setBalance] = useState(0)
    const [gifts] = useState(mockGifts)
    const [confirmGift, setConfirmGift] = useState(null)

    // 加载积分
    useEffect(() => {
        setBalance(getBalance())
    }, [])

    // 点击兑换
    const handleRedeemClick = (gift) => {
        if (gift.stock <= 0) {
            message.warning('该礼品已兑完，看看其他吧～')
            return
        }
        if (balance < gift.points) {
            message.error(`积分不足，还差 ${gift.points - balance} 分`)
            return
        }
        setConfirmGift(gift)
    }

    // 确认兑换
    const handleConfirm = () => {
        const ok = deductPoints(confirmGift.points)
        if (!ok) {
            message.error('兑换失败，积分不足')
            setConfirmGift(null)
            return
        }

        // 记录到兑换历史
        addRedeemRecord({
            id: Date.now(),
            giftId: confirmGift.id,
            giftName: confirmGift.name,
            points: confirmGift.points,
            time: new Date().toLocaleString('zh-CN')
        })

        setBalance(getBalance())
        setConfirmGift(null)
        message.success(`兑换成功！已扣除 ${confirmGift.points} 积分`)

        // 可选：刷新页面数据
    }

    return (
        <div className="gift-shop">
            {/* 顶部积分面板 */}
            <Card className="shop-balance-card">
                <div className="balance-left">
                    <TrophyOutlined className="balance-icon" />
                    <div>
                        <div className="balance-label">我的积分</div>
                        <div className="balance-value">{balance}</div>
                    </div>
                </div>
                <div className="balance-right">
                    <Button
                        icon={<ShoppingOutlined />}
                        onClick={() => navigate('/user/points')}
                    >
                        查看积分明细
                    </Button>
                </div>
            </Card>

            {/* 礼品列表 */}
            <div className="gift-section-title">
                全部礼品 <span className="gift-count">共 {gifts.length} 件</span>
            </div>

            <Row gutter={[16, 16]}>
                {gifts.map(gift => {
                    const canAfford = balance >= gift.points
                    const outOfStock = gift.stock <= 0
                    return (
                        <Col xs={24} sm={12} lg={8} xl={6} key={gift.id}>
                            <Card
                                className={`gift-card ${outOfStock ? 'gift-out' : ''} ${!canAfford ? 'gift-poor' : ''}`}
                                hoverable={!outOfStock}
                            >
                                {/* 角标 */}
                                {gift.hot && !outOfStock && (
                                    <Tag color="red" className="gift-badge">🔥 热门</Tag>
                                )}
                                {outOfStock && (
                                    <Tag color="default" className="gift-badge">已兑完</Tag>
                                )}

                                {/* 图标 */}
                                <div className="gift-icon-wrap">
                                    <span className="gift-icon">{gift.icon}</span>
                                </div>

                                {/* 名称 */}
                                <div className="gift-name">{gift.name}</div>

                                {/* 描述 */}
                                <div className="gift-desc">{gift.desc}</div>

                                {/* 底部 */}
                                <div className="gift-footer">
                                    <div className="gift-points">
                                        <TrophyOutlined /> {gift.points} 积分
                                    </div>
                                    <div className="gift-stock">
                                        剩余 {gift.stock}
                                    </div>
                                </div>

                                {/* 兑换按钮 */}
                                <Button
                                    type="primary"
                                    block
                                    disabled={outOfStock || !canAfford}
                                    onClick={() => handleRedeemClick(gift)}
                                    style={{ marginTop: 12 }}
                                >
                                    {outOfStock
                                        ? '已兑完'
                                        : !canAfford
                                            ? `差 ${gift.points - balance} 分`
                                            : '立即兑换'}
                                </Button>
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            {gifts.length === 0 && (
                <Empty description="暂无礼品" />
            )}

            {/* 兑换确认弹窗 */}
            <Modal
                open={!!confirmGift}
                onCancel={() => setConfirmGift(null)}
                footer={null}
                centered
                width={380}
            >
                {confirmGift && (
                    <div className="redeem-modal">
                        <ExclamationCircleOutlined
                            style={{ fontSize: 48, color: '#faad14', marginBottom: 16 }}
                        />
                        <h3>确认兑换</h3>
                        <p className="redeem-gift-name">{confirmGift.icon} {confirmGift.name}</p>
                        <div className="redeem-cost">
                            将消耗 <span>{confirmGift.points}</span> 积分
                        </div>
                        <div className="redeem-after">
                            兑换后剩余：<span>{balance - confirmGift.points}</span> 积分
                        </div>
                        <div className="redeem-actions">
                            <Button onClick={() => setConfirmGift(null)} style={{ flex: 1 }}>
                                再想想
                            </Button>
                            <Button
                                type="primary"
                                onClick={handleConfirm}
                                style={{ flex: 1 }}
                            >
                                确认兑换
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    )
}