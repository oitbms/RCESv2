package com.example.rces.controller.mvc;

import com.example.rces.dto.AuthorControlDeviationDto;
import com.example.rces.dto.AuthorControlDto;
import com.example.rces.models.AuthorControl;
import com.example.rces.service.AuthorControlDeviationService;
import com.example.rces.service.AuthorControlService;
import com.example.rces.specifications.AuthorControlSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorControlService authorControlService;
    private final AuthorControlDeviationService deviationService;

    @GetMapping("/view/author-control")
    public String getRequestList(
            @PageableDefault(sort = "createdDate", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestParam(required = false) String filterNumber,
            @RequestParam(required = false) String filterEmployee,
            @RequestParam(required = false) String filterOrder,
            @RequestParam(required = false) String filterSubDivision,
            @RequestParam(required = false) String filterSubDivisionSite,
            @RequestParam(required = false) String filterStatus,
            @RequestParam(required = false) String filterType,
            @RequestParam(required = false) String filterInconsistency,
            @RequestParam(required = false) String filterCreateDateFrom,
            @RequestParam(required = false) String filterCreateDateTo,
            @RequestParam(required = false) String filterUpdateDateFrom,
            @RequestParam(required = false) String filterUpdateDateTo,
            @RequestParam(required = false, defaultValue = "25") Integer size,
            Model model) {

        if (size != null && size > 0) {
            pageable = PageRequest.of(pageable.getPageNumber(), size, pageable.getSort());
        }

        Specification<AuthorControl> spec = Specification
                .where(AuthorControlSpecifications.hasFilterNumber(filterNumber))
                .and(AuthorControlSpecifications.hasFilterEmployee(filterEmployee))
                .and(AuthorControlSpecifications.hasFilterOrder(filterOrder))
                .and(AuthorControlSpecifications.hasFilterSubDivision(filterSubDivision))
                .and(AuthorControlSpecifications.hasFilterSubDivisionSite(filterSubDivisionSite))
                .and(AuthorControlSpecifications.hasFilterStatus(filterStatus))
                .and(AuthorControlSpecifications.hasFilterType(filterType))
                .and(AuthorControlSpecifications.hasFilterInconsistency(filterInconsistency))
                .and(AuthorControlSpecifications.hasFilterCreateDateBetween(filterCreateDateFrom, filterCreateDateTo))
                .and(AuthorControlSpecifications.hasFilterUpdateDateBetween(filterUpdateDateFrom, filterUpdateDateTo));

        Page<AuthorControlDto> requestsPage = authorControlService.getAllAuthorControls(spec, pageable);

        model.addAttribute("authorControlList", requestsPage.getContent());
        model.addAttribute("currentPage", requestsPage.getNumber());
        model.addAttribute("totalPages", requestsPage.getTotalPages());
        model.addAttribute("totalElements", requestsPage.getTotalElements());
        model.addAttribute("pageSize", requestsPage.getSize());

        model.addAttribute("filterNumber", filterNumber);
        model.addAttribute("filterEmployee", filterEmployee);
        model.addAttribute("filterOrder", filterOrder);
        model.addAttribute("filterSubDivision", filterSubDivision);
        model.addAttribute("filterSubDivisionSite", filterSubDivisionSite);
        model.addAttribute("filterStatus", filterStatus);
        model.addAttribute("filterType", filterType);
        model.addAttribute("filterInconsistency", filterInconsistency);
        model.addAttribute("filterCreateDateFrom", filterCreateDateFrom);
        model.addAttribute("filterCreateDateTo", filterCreateDateTo);
        model.addAttribute("filterUpdateDateFrom", filterUpdateDateFrom);
        model.addAttribute("filterUpdateDateTo", filterUpdateDateTo);

        return "author-controllist";
    }

    @GetMapping("/view/author-control/{id}")
    public String getAuthorControl(@PathVariable long id, Model model) {

        AuthorControlDto authorControlDto = authorControlService.getAuthorControl(id);

        model.addAttribute("authorControl", authorControlDto);

        return "author-control";
    }

    @GetMapping("/control/deviation/{id}/images")
    public String getImages(@PathVariable long id, Model model) {

        AuthorControlDeviationDto authorControlDto = deviationService.getDeviation(id);

        model.addAttribute("authorControl", authorControlDto);

        return "author-control-images";
    }

    @GetMapping("/control/deviation/{id}/fix-photo")
    public String getFixPhoto(@PathVariable long id, Model model) {

        AuthorControlDeviationDto authorControlDto = deviationService.getDeviation(id);

        model.addAttribute("authorControl", authorControlDto);

        return "author-control-fix";
    }

}
