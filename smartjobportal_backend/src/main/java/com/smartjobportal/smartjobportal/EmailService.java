package com.smartjobportal.smartjobportal;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendApplicationConfirmation(String toEmail, String name,
                                             String jobTitle, String company) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Application Received – " + jobTitle + " at " + company);
        message.setText("Hi " + name + ",\n\n"
                + "Your application for the position of " + jobTitle
                + " at " + company + " has been received.\n\n"
                + "We will review your profile and get back to you shortly.\n\n"
                + "Best regards,\nSmartJobPortal Team");
        mailSender.send(message);
    }

    public void sendStatusUpdate(String toEmail, String name, String status) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Application Status Update");
        message.setText("Hi " + name + ",\n\n"
                + "Your application status has been updated to: " + status + ".\n\n"
                + "Log in to SmartJobPortal to view details.\n\n"
                + "Best regards,\nSmartJobPortal Team");
        mailSender.send(message);
    }
}