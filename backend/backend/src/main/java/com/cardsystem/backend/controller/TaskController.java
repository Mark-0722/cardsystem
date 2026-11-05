package com.cardsystem.backend.controller;

import com.cardsystem.backend.entity.Task;
import com.cardsystem.backend.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    private final TaskRepository taskRepository;

    public TaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // 学生端：只返回已发布的任务
    @GetMapping
    public Map<String, Object> list() {
        List<Task> list = taskRepository.findByStatus(Task.Status.PUBLISHED);
        return Map.of("code", 200, "data", list, "total", list.size());
    }

    // 学生端：任务详情
    @GetMapping("/{id}")
    public Map<String, Object> detail(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(t -> Map.<String, Object>of("code", 200, "data", t))
                .orElse(Map.of("code", 404, "msg", "任务不存在"));
    }
}
