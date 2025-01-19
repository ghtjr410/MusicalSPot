package com.housing.back.provider;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class EmailProvider {
    
    private final JavaMailSender javaMailSender;

    private final String SUBJECT = "[Musical Spot 프로젝트] 인증메일입니다.";

    public boolean sendCertificationMail (String email,String certificationNumber){

        try {

            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper messageHelper = new MimeMessageHelper(message,true, "UTF-8");    

            String htmlContent = getCertificationMessage(certificationNumber);

            messageHelper.setTo(email);
            messageHelper.setSubject(SUBJECT);
            messageHelper.setText(htmlContent, true);
            messageHelper.setFrom("teamhyy0626@gmail.com");
            
            javaMailSender.send(message);

        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }

        return true;
    }

    private String getCertificationMessage (String certificationNumber){

        String certificationMessage = "";
        certificationMessage += "<h1 style='text-align: center;'>[Musical Spot] 인증메일</h1>";
        certificationMessage += "<h3 style='text-align: center;'>인증코드 : <strong style='font-size: 32px; letter-spacing: 8px;'>"+ certificationNumber + "</strong></h3>";
        return certificationMessage;

    }
}
