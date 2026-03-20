package com.smartjobportal.smartjobportal;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {
    "http://localhost:3000",
    "https://smartjobportal-chi.vercel.app"
})
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final EmailService emailService;
    private final JobRepository jobRepository;

    public ApplicationController(ApplicationRepository applicationRepository,
                                  EmailService emailService,
                                  JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.emailService = emailService;
        this.jobRepository = jobRepository;
    }

    @PostMapping("/apply")
    public ResponseEntity<String> apply(@AuthenticationPrincipal UserDetailsImpl userDetails,
                                         @RequestParam Long jobId) {
        String email = userDetails.getUsername();
        String name = userDetails.getFullName();

        if (applicationRepository.existsByJobIdAndApplicantEmail(jobId, email)) {
            return ResponseEntity.badRequest().body("Already applied to this job.");
        }

        Application app = new Application(jobId, name, email);
        applicationRepository.save(app);

        Job job = jobRepository.findById(jobId).orElse(null);
        if (job != null) {
            emailService.sendApplicationConfirmation(email, name, job.getTitle(), job.getCompany());
        }

        return ResponseEntity.ok("Applied successfully!");
    }

    @GetMapping("/applications/my")
    public List<Application> getMyApplications(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return applicationRepository.findByApplicantEmail(userDetails.getUsername());
    }

    // Admin only
    @GetMapping("/admin/applications/{jobId}")
    public List<Application> getApplicationsByJob(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    @PutMapping("/admin/applications/{id}/status")
    public ResponseEntity<String> updateStatus(@PathVariable Long id,
                                                @RequestParam Application.ApplicationStatus status) {
        Application app = applicationRepository.findById(id).orElse(null);
        if (app == null) return ResponseEntity.notFound().build();

        app.setStatus(status);
        applicationRepository.save(app);

        emailService.sendStatusUpdate(app.getApplicantEmail(), app.getApplicantName(), status.name());
        return ResponseEntity.ok("Status updated.");
    }
}