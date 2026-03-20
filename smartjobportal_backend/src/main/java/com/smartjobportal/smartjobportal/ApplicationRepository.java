package com.smartjobportal.smartjobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByApplicantName(String applicantName);
    List<Application> findByApplicantEmail(String email);
    boolean existsByJobIdAndApplicantEmail(Long jobId, String email);
    List<Application> findByJobId(Long jobId);
}