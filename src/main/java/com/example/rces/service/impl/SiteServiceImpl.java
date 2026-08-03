package com.example.rces.service.impl;

import com.example.rces.dto.SiteDto;
import com.example.rces.mapper.SiteMapper;
import com.example.rces.repository.SiteRepository;
import com.example.rces.service.SiteService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SiteServiceImpl implements SiteService {

    private final SiteRepository siteRepository;
    private final SiteMapper siteMapper;

    @Override
    @Transactional(readOnly = true)
    public List<SiteDto> getAll() {

        List<SiteDto> sitesDto = siteMapper.toSiteDtoList(siteRepository.findAll());

        return sitesDto;
    }

}
