package com.smartjobportal.smartjobportal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "http://localhost:3000")
public class JobsController {

    private final JobRepository jobRepository;

    public JobsController(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType) {

        if (title != null && location != null) {
            return jobRepository.findByTitleContainingAndLocationContainingAndActiveTrue(title, location);
        } else if (title != null) {
            return jobRepository.findByTitleContainingAndActiveTrue(title);
        } else if (location != null) {
            return jobRepository.findByLocationContainingAndActiveTrue(location);
        } else if (jobType != null) {
            return jobRepository.findByJobTypeAndActiveTrue(jobType);
        } else {
            return jobRepository.findByActiveTrue();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return jobRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Admin only - create
    @PostMapping("/create")
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    // Admin only - update
    @PutMapping("/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updated) {
        return jobRepository.findById(id).map(job -> {
            job.setTitle(updated.getTitle());
            job.setCompany(updated.getCompany());
            job.setLocation(updated.getLocation());
            job.setDescription(updated.getDescription());
            job.setSalary(updated.getSalary());
            job.setJobType(updated.getJobType());
            return ResponseEntity.ok(jobRepository.save(job));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Admin only - deactivate
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id) {
        return jobRepository.findById(id).map(job -> {
            job.setActive(false);
            jobRepository.save(job);
            return ResponseEntity.ok("Job deactivated.");
        }).orElse(ResponseEntity.notFound().build());
    }
}