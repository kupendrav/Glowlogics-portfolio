package com.glowlogics.portfolio.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/admin/login")
    public String loginPage() {
        return "admin-login";
    }

    @GetMapping("/admin")
    public String adminDashboard() {
        return "admin-dashboard";
    }
}
