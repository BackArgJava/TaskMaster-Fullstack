package com.taskmaster.backend.controller;

import com.taskmaster.backend.model.Task;
import com.taskmaster.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks") // This means all URLs start with /tasks
@CrossOrigin(origins = "http://localhost:5173") // 🔓 OPEN THE GATES FOR REACT!
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    // 1. READ (Get all tasks) 📖
    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // 2. CREATE (Add a new task) ➕
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskRepository.save(task);
    }

    // 3. UPDATE (Toggle Checkbox or Edit Title) ✏️
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        // Find the task, or throw an error if not found
        Task task = taskRepository.findById(id).orElseThrow();

        // Update the info
        task.setTitle(taskDetails.getTitle());
        task.setCompleted(taskDetails.isCompleted());

        // Save it back to the database
        return taskRepository.save(task);
    }

    // 4. DELETE (Remove task) 🗑️
    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }
}