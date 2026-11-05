package com.cardsystem.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.cardsystem.backend.repository.StudentRepository;
import com.cardsystem.backend.entity.Student;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;




@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(StudentRepository studentRepository) {
        return args -> {
            if (studentRepository.findByStudentNo("2024001").isEmpty()) {
                Student s = new Student();
                s.setStudentNo("2024001");
                s.setPassword("123456");
                s.setName("测试学生");
                s.setPoints(0);
                studentRepository.save(s);
                System.out.println("✅ 测试学生 2024001 已插入");
            }
        };
    }
}
