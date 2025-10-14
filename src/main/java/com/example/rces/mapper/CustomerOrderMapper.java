package com.example.rces.mapper;

import com.example.rces.dto.CustomerOrderCreateDTO;
import com.example.rces.dto.CustomerOrderDTO;
import com.example.rces.models.CustomerOrder;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CustomerOrderMapper extends BaseMapper<CustomerOrder, CustomerOrderDTO, CustomerOrderCreateDTO> {
}
