package com.taskmaster.backend.model;

import jakarta.persistence.*;
import lombok.Data; // Lombok writes the Getters/Setters for us!

@Entity // This tells Java: "Save this to the Database table"
@Data   // This tells Lombok: "Generate getters, setters, and toString"
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID (1, 2, 3...)
    private Long id;

    private String title;      // e.g., "Buy Milk"
    private boolean completed; // true = ✅, false = ⬜
}