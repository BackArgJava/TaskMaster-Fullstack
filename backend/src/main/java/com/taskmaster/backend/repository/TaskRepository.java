package com.taskmaster.backend.repository;

import com.taskmaster.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// JpaRepository gives us free methods: save(), findAll(), deleteById()...
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    // We don't need to write ANY code here!
    // Spring generates the SQL for us automatically. 🤯
}