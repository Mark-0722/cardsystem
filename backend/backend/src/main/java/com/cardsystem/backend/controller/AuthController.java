package com.cardsystem.backend.controller;

import com.cardsystem.backend.entity.Student;
import com.cardsystem.backend.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final StudentRepository studentRepository;

    public AuthController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String account = body.get("account");
        String password = body.get("password");
        String role = body.get("role");   // ← 新增：接收前端传的角色

        var studentOpt = studentRepository.findByStudentNo(account);

        if (studentOpt.isEmpty() || !studentOpt.get().getPassword().equals(password)) {
            return Map.of("code", 401, "msg", "学号或密码错误");
        }

        Student s = studentOpt.get();

        // ← 新增：管理员登录校验
        if ("admin".equals(role) && !Boolean.TRUE.equals(s.getIsAdmin())) {
            return Map.of("code", 403, "msg", "该账号不是管理员");
        }

        // ← 修改：返回里加 role 字段
        return Map.of(
                "code", 200,
                "msg", "登录成功",
                "data", Map.of(
                        "id", s.getId(),
                        "studentNo", s.getStudentNo(),
                        "name", s.getName(),
                        "points", s.getPoints(),
                        "role", Boolean.TRUE.equals(s.getIsAdmin()) ? "admin" : "student"
                )
        );
    }
}