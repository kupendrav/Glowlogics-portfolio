package com.glowlogics.portfolio.service;

import com.glowlogics.portfolio.dto.SkillResponse;
import com.glowlogics.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    @Transactional(readOnly = true)
    public List<SkillResponse> getSkills() {
        return skillRepository.findAllByOrderBySortOrderAsc()
                .stream()
                .map(skill -> new SkillResponse(
                        skill.getId(),
                        skill.getName(),
                        skill.getCategory(),
                        skill.getLevel()
                ))
                .toList();
    }
}
