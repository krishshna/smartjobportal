package com.smartjobportal.smartjobportal;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long jobId;
    private String applicantName;
    private String applicantEmail;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    private LocalDateTime appliedAt = LocalDateTime.now();

    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, HIRED
    }

    public Application() {}

    public Application(Long jobId, String applicantName, String applicantEmail) {
        this.jobId = jobId;
        this.applicantName = applicantName;
        this.applicantEmail = applicantEmail;
        this.appliedAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public Long getJobId() { return jobId; }
    public String getApplicantName() { return applicantName; }
    public String getApplicantEmail() { return applicantEmail; }
    public ApplicationStatus getStatus() { return status; }
    public LocalDateTime getAppliedAt() { return appliedAt; }

    public void setId(Long id) { this.id = id; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public void setApplicantName(String name) { this.applicantName = name; }
    public void setApplicantEmail(String email) { this.applicantEmail = email; }
    public void setStatus(ApplicationStatus status) { this.status = status; }
    public void setAppliedAt(LocalDateTime t) { this.appliedAt = t; }
}