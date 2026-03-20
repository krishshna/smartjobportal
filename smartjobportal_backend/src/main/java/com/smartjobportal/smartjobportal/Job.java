package com.smartjobportal.smartjobportal;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String company;
    private String location;
    private String description;
    private String salary;
    private String jobType;   // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    private boolean active = true;
    private LocalDateTime postedAt = LocalDateTime.now();

    public Job() {}

    public Job(String title, String company, String location) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.postedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getCompany() { return company; }
    public String getLocation() { return location; }
    public String getDescription() { return description; }
    public String getSalary() { return salary; }
    public String getJobType() { return jobType; }
    public boolean isActive() { return active; }
    public LocalDateTime getPostedAt() { return postedAt; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setCompany(String company) { this.company = company; }
    public void setLocation(String location) { this.location = location; }
    public void setDescription(String description) { this.description = description; }
    public void setSalary(String salary) { this.salary = salary; }
    public void setJobType(String jobType) { this.jobType = jobType; }
    public void setActive(boolean active) { this.active = active; }
    public void setPostedAt(LocalDateTime t) { this.postedAt = t; }
}