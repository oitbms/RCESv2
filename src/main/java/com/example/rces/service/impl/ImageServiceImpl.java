package com.example.rces.service.impl;

import com.example.rces.payload.ImagesPayload;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.repository.ImageRepository;
import com.example.rces.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.example.rces.utils.FilesUtil.getBytes;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class ImageServiceImpl implements ImageService {

    private final ImageRepository repository;

    @Override
    public void save(Images newImage) {
        repository.save(newImage);
    }

    @Override
    public void deleteById(UUID imageId) {
        repository.deleteById(imageId);
    }

    @Autowired
    public ImageServiceImpl(ImageRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Images> createImages(MultipartFile[] additionalFiles, Requests request, Boolean save) {
        return createImages(additionalFiles, file -> new Images(getBytes(file), request, null, null, null, file.getOriginalFilename()), save);
    }

    @Override
    public List<Images> createImages(MultipartFile[] additionalFiles, SGI sgi, Boolean save) {
        return createImages(additionalFiles, file -> new Images(getBytes(file), null, null, sgi, null, file.getOriginalFilename()), save);
    }

    @Override
    public List<Images> createImages(MultipartFile[] additionalFiles, FactExecutionSGI factExecutionSGI, Boolean save) {
        return createImages(additionalFiles, file -> new Images(getBytes(file), null, factExecutionSGI, null, null, file.getOriginalFilename()), save);
    }

    @Override
    public List<ImagesPayload> getImagesByRequestId(UUID requestId) {
        List<Images> images = repository.findAllByRequestId(requestId);
        return images.stream()
                .map(image -> new ImagesPayload(image.getId(), image.getName(), image.getBase64Data(), image.getRequest().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ImagesPayload> getImagesForSgiId(UUID sgiId) {
        List<Images> images = repository.findAllBySgimId(sgiId);
        return images.stream()
                .map(image -> new ImagesPayload(image.getId(), image.getName(), image.getBase64Data(), image.getSgim().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ImagesPayload> getImagesForFactSgiId(UUID factSgiId) {
        List<Images> images = repository.findAllBySgiId(factSgiId);
        return images.stream()
                .map(image -> new ImagesPayload(image.getId(), image.getName(), image.getBase64Data(), image.getSgi().getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<Images> findAllByIds(List<UUID> imageIds) {
        return repository.findAllById(imageIds);
    }

    public List<Images> createImages(MultipartFile[] files, Function<MultipartFile, Images> imageCreator, Boolean save) {
        List<Images> images = Arrays.stream(files)
                .filter(file -> !file.isEmpty())
                .map(imageCreator)
                .collect(Collectors.toList());

        return save ? repository.saveAll(images) : images;
    }

}
