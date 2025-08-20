package com.example.rces.controller.api.service;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.SGI;
import com.example.rces.services.UniversalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ApiSGIService {

    private final UniversalService service;

    @Autowired
    public ApiSGIService(UniversalService service) {
        this.service = service;
    }

    public Page<SGI> getPage(int page, int size) {
        Sort sort = Sort.by(Sort.Direction.ASC, "requestNumber");
        String conditions = "WHERE e.parentSGI IS NULL";
        return service.getPage(SGI.class, page, size, sort, conditions);
    }

    public SGI getSgi(UUID id) {
        return service.findById(SGI.class, id);
    }

    public List<FactExecutionSGI> getExecutions(UUID id) {
        return service.findAllByField(FactExecutionSGI.class, "sgi", service.findById(SGI.class, id));
    }

    public List<ImagesPayload> findImages(UUID param) {
        List<Images> images;
        FactExecutionSGI factExecutionSGI = service.findById(FactExecutionSGI.class, param);
        if (factExecutionSGI != null) {
            images = service.findAllByField(Images.class, "sgi", factExecutionSGI);
        } else {
            SGI sgi = service.findById(SGI.class, param);
            images = service.findAllByField(Images.class, "sgim", sgi);
        }

        return images.stream()
                .map(image -> new ImagesPayload(
                        image, factExecutionSGI != null ? image.getSgi().getId() : image.getSgim().getId()))
                .collect(Collectors.toList());
    }
}
