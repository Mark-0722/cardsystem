//package com.cardsystem.backend.repository;
//
//import com.cardsystem.backend.entity.Student;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.Optional;
//
//public interface StudentRepository extends JpaRepository<Student, Long> {
//    Optional<Student> findByStudentNo(String studentNo);
//}
package com.cardsystem.backend.repository;

import com.cardsystem.backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByStudentNo(String studentNo);

    List<Student> findByNameContaining(String name);

    // 搜索：按学号或姓名模糊查
    @Query("SELECT s FROM Student s WHERE s.studentNo LIKE %:keyword% OR s.name LIKE %:keyword%")
    List<Student> search(@Param("keyword") String keyword);
}