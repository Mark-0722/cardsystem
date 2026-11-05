package com.cardsystem.backend.controller;

import com.cardsystem.backend.entity.Task;
import com.cardsystem.backend.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/tasks")
@CrossOrigin(origins = "*")
public class AdminTaskController {

    private final TaskRepository taskRepository;

    public AdminTaskController(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // 列表
    @GetMapping
    public Map<String, Object> list(@RequestParam(required = false) String status) {
        List<Task> list;
        if (status != null && !status.isEmpty()) {
            list = taskRepository.findByStatus(Task.Status.valueOf(status.toUpperCase()));
        } else {
            list = taskRepository.findAll();
        }
        return Map.of("code", 200, "data", list, "total", list.size());
    }

    // 新增
    @PostMapping
    public Map<String, Object> create(@RequestBody Task task) {
        Task saved = taskRepository.save(task);
        return Map.of("code", 200, "msg", "创建成功", "data", saved);
    }

    // 编辑
    @PutMapping("/{id}")
    public Map<String, Object> update(@PathVariable Long id, @RequestBody Task task) {
        return taskRepository.findById(id)
                .map(t -> {
                    t.setTitle(task.getTitle());
                    t.setDescription(task.getDescription());
                    t.setType(task.getType());
                    t.setPoints(task.getPoints());
                    t.setStatus(task.getStatus());
                    t.setStartDate(task.getStartDate());
                    t.setEndDate(task.getEndDate());
                    t.setTotalCount(task.getTotalCount());
                    taskRepository.save(t);
                    return Map.<String, Object>of("code", 200, "msg", "更新成功");
                })
                .orElse(Map.of("code", 404, "msg", "任务不存在"));
    }

    // 发布
    @PostMapping("/{id}/publish")
    public Map<String, Object> publish(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(t -> {
                    t.setStatus(Task.Status.PUBLISHED);
                    taskRepository.save(t);
                    return Map.<String, Object>of("code", 200, "msg", "已发布");
                })
                .orElse(Map.of("code", 404, "msg", "任务不存在"));
    }

    // 下架
    @PostMapping("/{id}/offline")
    public Map<String, Object> offline(@PathVariable Long id) {
        return taskRepository.findById(id)
                .map(t -> {
                    t.setStatus(Task.Status.OFFLINE);
                    taskRepository.save(t);
                    return Map.<String, Object>of("code", 200, "msg", "已下架");
                })
                .orElse(Map.of("code", 404, "msg", "任务不存在"));
    }

    // 删除
    @DeleteMapping("/{id}")
    public Map<String, Object> delete(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return Map.of("code", 200, "msg", "删除成功");
    }
}