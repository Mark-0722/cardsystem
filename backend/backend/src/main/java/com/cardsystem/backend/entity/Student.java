package com.cardsystem.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "students")
@Data
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String studentNo;

    @Column(nullable = false)
    private String name;

    private String password;

    private Integer points = 0;

    private String phone;

    private String email;

    private Boolean enabled = true;   // 是否启用（软删除用）

    private Boolean isAdmin = false;

    @Column(updatable = false)
    private java.time.LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = java.time.LocalDateTime.now();
    }
}


//package com.cardsystem.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//@Entity
//@Table(name = "students")
//public class Student {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false, length = 20)
//    private String studentNo;          // 学号，如 2024001
//
//    @Column(nullable = false)
//    private String password;           // 密码（先明文，后面加密）
//
//    private String name;               // 姓名
//
//    private Integer points = 0;        // 当前积分
//
//    @Column(name = "created_at")
//    private LocalDateTime createdAt;
//
//    @PrePersist
//    public void prePersist() {
//        createdAt = LocalDateTime.now();
//    }
//}
