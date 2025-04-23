package com.example.rces.configuration;

import com.example.rces.models.Requests;
import com.example.rces.services.UniversalService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TypeBasedRequestMatcher implements RequestMatcher {

    private final Pattern pattern = Pattern.compile("/view/(\\d+)");
    private final UniversalService service;

    public TypeBasedRequestMatcher(UniversalService service) {
        this.service = service;
    }

    @Override
    public boolean matches(HttpServletRequest request) {
        Matcher matcher = pattern.matcher(request.getRequestURI());
        if (matcher.matches()) {
            String requestNumber = matcher.group(1);
            String type = String.valueOf(service.findSingleByField(Requests.class, "requestNumber", requestNumber).getTypeRequest());

            return switch (type) {
                case "otk" -> request.isUserInRole("OTK") ||
                        request.isUserInRole("ADMIN") ||
                        request.isUserInRole("MASTER");
                case "technologist" -> request.isUserInRole("TECHNOLOGIST") ||
                        request.isUserInRole("ADMIN") ||
                        request.isUserInRole("MASTER");
                case "constructor" -> request.isUserInRole("CONSTRUCTOR") ||
                        request.isUserInRole("ADMIN") ||
                        request.isUserInRole("MASTER");
                default -> false;
            };
        }
        return false;
    }

}
