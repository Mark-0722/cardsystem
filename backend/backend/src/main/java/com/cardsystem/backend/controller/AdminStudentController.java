package com.cardsystem.backend.controller;

import com.cardsystem.backend.entity.Student;
import com.cardsystem.backend.repository.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/students")
@CrossOrigin(origins = "*")
public class AdminStudentController {

    private final StudentRepository studentRepository;

    public AdminStudentController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // 列表 + 搜索
    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String keyword) {
        List<Student> list;
        if (keyword != null && !keyword.isEmpty()) {
            list = studentRepository.search(keyword);
        } else {
            list = studentRepository.findAll();
        }
        return Map.of("code", 200, "data", list, "total", list.size());
    }

    // 新增
    @PostMapping
    public Map<String, Object> create(@RequestBody Student student) {
        // 检查学号重复
        if (studentRepository.findByStudentNo(student.getStudentNo()).isPresent()) {
            return Map.of("code", 400, "msg", "学号已存在");
        }
        // 默认密码
        if (student.getPassword() == null || student.getPassword().isEmpty()) {
            student.setPassword("123456");
        }
        Student saved = studentRepository.save(student);
        return Map.of("code", 200, "msg", "添加成功", "data", saved);
    }

    // 编辑
    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Student student) {
        return studentRepository.findById(id)
                .map(s -> {
                    s.setName(student.getName());
                    s.setPhone(student.getPhone());
                    s.setEmail(student.getEmail());
                    s.setEnabled(student.getEnabled());
                    if (student.getPoints() != null) {
                        s.setPoints(student.getPoints());
                    }
                    studentRepository.save(s);
                    return Map.<String, Object>of("code", 200, "msg", "更新成功");
                })
                .orElse(Map.of("code", 404, "msg", "学生不存在"));
    }

    // 重置密码
    @PostMapping("/{id}/reset-password")
    public Map<String, Object> resetPassword(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(s -> {
                    s.setPassword("123456");
                    studentRepository.save(s);
                    return Map.<String, Object>of("code", 200, "msg", "密码已重置为 123456");
                })
                .orElse(Map.of("code", 404, "msg", "学生不存在"));
    }

    // 删除（软删除）
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        return studentRepository.findById(id)
                .map(s -> {
                    s.setEnabled(false);
                    studentRepository.save(s);
                    return Map.<String, Object>of("code", 200, "msg", "删除成功");
                })
                .orElse(Map.of("code", 404, "msg", "学生不存在"));
    }
}
