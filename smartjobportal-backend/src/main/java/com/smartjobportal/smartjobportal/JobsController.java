package com.smartjobportal.smartjobportal;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/jobs")
public class JobsController {

    private final JobRepository jobRepository;

    public JobsController(JobRepository jobRepository){
        this.jobRepository = jobRepository;
    }

    @GetMapping
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    @PostMapping("/create")
    public Job createJob(@RequestBody Job job) {
        return jobRepository.save(job);
    }

    @DeleteMapping("/{id}")
    public String deleteJob(@PathVariable int id) {
        jobRepository.deleteById(id);
        return "Job deleted!";
    }

    @GetMapping("/{id}")
    public Job getJobById(@PathVariable int id) {
        return jobRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Job updateJob(@PathVariable int id, @RequestBody Job updatedJob) {
        return jobRepository.findById(id)
            .map(job -> {
                job.setTitle(updatedJob.getTitle());
                job.setCompany(updatedJob.getCompany());
                job.setLocation(updatedJob.getLocation());
                return jobRepository.save(job);
            })
            .orElse(null);
    }
}