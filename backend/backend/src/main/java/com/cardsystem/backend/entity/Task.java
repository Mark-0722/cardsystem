package com.cardsystem.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "tasks")
@Data
public class Task {

    public enum Type { DAILY, WEEKLY, SINGLE }
    public enum Status { DRAFT, PUBLISHED, OFFLINE }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    private Type type = Type.SINGLE;  // DAILY / WEEKLY / SINGLE

    private Integer points = 0;       // 完成奖励积分

    @Enumerated(EnumType.STRING)
    private Status status = Status.DRAFT;  // DRAFT / PUBLISHED / OFFLINE

    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;

    private Integer totalCount = 1;   // 需完成次数（如连续打卡7天）

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}