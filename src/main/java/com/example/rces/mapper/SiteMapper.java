package com.example.rces.mapper;

import com.example.rces.dto.SiteDto;
import com.example.rces.models.Site;
import org.mapstruct.Mapper;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface SiteMapper {

    List<SiteDto> toSiteDtoList(List<Site> siteList);

}
