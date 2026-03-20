package com.smartjobportal.smartjobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByActiveTrue();
    List<Job> findByTitleContainingAndActiveTrue(String title);
    List<Job> findByLocationContainingAndActiveTrue(String location);
    List<Job> findByTitleContainingAndLocationContainingAndActiveTrue(String title, String location);
    List<Job> findByJobTypeAndActiveTrue(String jobType);
}