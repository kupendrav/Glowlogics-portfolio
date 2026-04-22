package com.glowlogics.portfolio.service;

import com.glowlogics.portfolio.dto.ContactRequest;
import com.glowlogics.portfolio.dto.ContactResponse;
import com.glowlogics.portfolio.model.ContactMessage;
import com.glowlogics.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class ContactService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender javaMailSender;
    private final String notificationRecipient;

    public ContactService(ContactMessageRepository contactMessageRepository,
                          ObjectProvider<JavaMailSender> javaMailSenderProvider,
                          @Value("${app.contact.notification-to:}") String notificationRecipient) {
        this.contactMessageRepository = contactMessageRepository;
        this.javaMailSender = javaMailSenderProvider.getIfAvailable();
        this.notificationRecipient = notificationRecipient;
    }

    @Transactional
    public ContactResponse submit(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim());
        message.setMessage(request.message().trim());
        message.setHandled(false);

        ContactMessage saved = contactMessageRepository.save(message);
        sendNotificationEmail(saved);

        return new ContactResponse(
                true,
                "Message sent successfully. I will get back to you shortly.",
                saved.getCreatedAt() != null ? saved.getCreatedAt() : Instant.now()
        );
    }

    private void sendNotificationEmail(ContactMessage contactMessage) {
        if (javaMailSender == null || notificationRecipient == null || notificationRecipient.isBlank()) {
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(notificationRecipient.trim());
            message.setSubject("New portfolio contact from " + contactMessage.getName());
            message.setText("""
                    You received a new contact message.

                    Name: %s
                    Email: %s

                    Message:
                    %s
                    """.formatted(contactMessage.getName(), contactMessage.getEmail(), contactMessage.getMessage()));
            javaMailSender.send(message);
        } catch (MailException ex) {
            LOGGER.warn("Contact message stored but email notification failed: {}", ex.getMessage());
        }
    }
}
