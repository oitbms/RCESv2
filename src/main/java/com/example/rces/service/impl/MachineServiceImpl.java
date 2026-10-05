package com.example.rces.service.impl;

import com.example.rces.dto.EmployeeDTO;
import com.example.rces.dto.MachineCreateDto;
import com.example.rces.dto.MachineDto;
import com.example.rces.exception.EntityNotFoundExceptionBormash;
import com.example.rces.mapper.DocumentFileMapper;
import com.example.rces.mapper.EmployeeMapper;
import com.example.rces.mapper.ImagesMapper;
import com.example.rces.mapper.MachineMapper;
import com.example.rces.models.*;
import com.example.rces.models.enums.NotificationType;
import com.example.rces.repository.MachineRepository;
import com.example.rces.service.DocumentService;
import com.example.rces.service.EmployeeService;
import com.example.rces.service.ImageService;
import com.example.rces.service.MachineService;
import com.example.rces.service.SubDivisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;

import static com.example.rces.utils.FilesUtil.addPdfFilesToDocument;
import static com.example.rces.utils.FilesUtil.addPhotosToDocument;
import static com.example.rces.utils.FilesUtil.determineFileType;

@Service
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;
    private final MachineMapper machineMapper;
    private final EmployeeService employeeService;
    private final EmployeeMapper employeeMapper;
    private final ImagesMapper imagesMapper;
    private final DocumentFileMapper documentFileMapper;
    private final SubDivisionService subDivisionService;
    private final DocumentService documentService;
    private final ImageService imageService;


    @Autowired
    public MachineServiceImpl(MachineRepository machineRepository, MachineMapper machineMapper, EmployeeService employeeService, EmployeeMapper employeeMapper, ImagesMapper imagesMapper, DocumentFileMapper documentFileMapper, SubDivisionService subDivisionService, DocumentService documentService, ImageService imageService) {
        this.machineRepository = machineRepository;
        this.machineMapper = machineMapper;
        this.employeeService = employeeService;
        this.employeeMapper = employeeMapper;
        this.imagesMapper = imagesMapper;
        this.documentFileMapper = documentFileMapper;
        this.subDivisionService = subDivisionService;
        this.documentService = documentService;
        this.imageService = imageService;
    }

    @Override
    public List<MachineDto> getAllMachine() {
        return machineMapper.toDTOList(machineRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public MachineDto findByNumber(Integer number) {

        Machine machine = machineRepository.findByNumber(number);

        if (machine == null) {
            throw new EntityNotFoundExceptionBormash("Станок с инвентарным номером " + number + " не найден", NotificationType.ERROR);
        }

        MachineDto dto = machineMapper.toDto(machine);

        dto.setAdmittedEmployeesList(machine.getAdmittedEmployees().stream()
                .map(employeeMapper::toDTO)
                .toList());

        dto.setResponsibleEmployeesList(machine.getResponsibleEmployees().stream()
                .map(employeeMapper::toDTO)
                .toList());

        dto.setImageUrls(machine.getDocument().getImages()
                .stream()
                .filter(Objects::nonNull)
                .map(imagesMapper::toDTO)
                .toList());

        dto.setPdfs(machine.getDocument().getFiles().stream()
                .filter(Objects::nonNull)
                .map(documentFileMapper::toDTO)
                .toList());

        Optional.ofNullable(machine.getOtherDocument())
                .map(Document::getFiles)
                .ifPresent(files -> dto.setOtherPdfs(files.stream()
                        .filter(Objects::nonNull)
                        .map(documentFileMapper::toDTO)
                        .toList()));

        Optional.ofNullable(machine.getPassport())
                .map(Document::getFiles)
                .stream()
                .flatMap(Collection::stream)
                .filter(Objects::nonNull)
                .findFirst()
                .ifPresent(file -> dto.setPassportId(file.getId()));

        return dto;
    }

    @Override
    @Transactional
    public MachineDto createMachine(MachineCreateDto dto) {
        if (dto.getNumber() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Заполните инвентарный номер");
        }
        if (machineRepository.existsByNumber(dto.getNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Станок с инвентарным номером " + dto.getNumber() + " уже существует");
        }

        Machine machine = machineMapper.toEntityFromCreateDto(dto);
        SubDivision subDivision = subDivisionService.findById(dto.getSubDivisionId());

        Document passportDocument = new Document();
        passportDocument.setName("Паспорт: станок № " + dto.getNumber());

        if (dto.getPassportFiles() != null) {
            for (MultipartFile file : dto.getPassportFiles()) {
                if (file.isEmpty()) continue;
                try {
                    DocumentFile documentFile = new DocumentFile();
                    documentFile.setContent(file.getBytes());
                    documentFile.setBaseFileName(file.getOriginalFilename());
                    documentFile.setType(determineFileType(file.getOriginalFilename()));

                    documentFile.setDocument(passportDocument);

                    passportDocument.getFiles().add(documentFile);
                } catch (IOException e) {
                    throw new RuntimeException("Document file not found");
                }
            }
        }

        Document document = new Document();
        document.setName("Документация для станка № " + dto.getNumber());

        if (dto.getDocumentFiles() != null && dto.getDocumentFiles().length > 0 && !dto.getDocumentFiles()[0].isEmpty()) {
            for (MultipartFile file : dto.getDocumentFiles()) {
                try {

                    DocumentFile documentFile = new DocumentFile();
                    documentFile.setContent(file.getBytes());
                    documentFile.setBaseFileName(file.getOriginalFilename());
                    documentFile.setType(determineFileType(file.getOriginalFilename()));

                    documentFile.setDocument(document);

                    document.getFiles().add(documentFile);
                } catch (Exception e) {
                    throw new RuntimeException("Document file not found");
                }
            }
        }

        if (dto.getAdmittedEmployeesList() != null) {
            dto.getAdmittedEmployeesList().stream()
                    .filter(Objects::nonNull)
                    .map(this::findEmployee)
                    .forEach(machine::addAdmittedEmployees);
        }

        if (dto.getResponsibleEmployeesList() != null) {
            dto.getResponsibleEmployeesList().stream()
                    .filter(Objects::nonNull)
                    .map(this::findEmployee)
                    .forEach(machine::addResponsibleEmployees);
        }

        if (dto.getAdditionalFiles() != null && dto.getAdditionalFiles().length > 0 && !dto.getAdditionalFiles()[0].isEmpty()) {
            for (MultipartFile imageFile : dto.getAdditionalFiles()) {
                try {
                    Images newImage = new Images();
                    newImage.setData(imageFile.getBytes());
                    newImage.setName(imageFile.getOriginalFilename());

                    newImage.setDocument(document);

                    document.getImages().add(newImage);
                } catch (IOException e) {
                    throw new RuntimeException("Не удалось обработать файл изображения", e);
                }
            }
        }
        machine.setDocument(document);
        if (!passportDocument.getFiles().isEmpty()) {
            machine.setPassport(passportDocument);
        }
        machine.setSubdivision(subDivision);

        Machine savedMachine = machineRepository.save(machine);

        return machineMapper.toDto(savedMachine);
    }

    @Override
    @Transactional
    public MachineDto updateMachine(MachineDto dto) {
        Machine machine = machineRepository.findByNumber(dto.getNumber());

        if (machine == null) {
            throw new EntityNotFoundExceptionBormash("Станок с инвентарным номером " + dto.getNumber() + " не найден", NotificationType.ERROR);
        }

        List<EmployeeDTO> employeeDto = dto.getAdmittedEmployeesList().stream()
                .map(employeeDTO -> employeeMapper.toDTO(findEmployee(employeeDTO.getName())))
                .toList();

        dto.setAdmittedEmployeesList(employeeDto);

        employeeDto = dto.getResponsibleEmployeesList().stream()
                .map(employeeDTO -> employeeMapper.toDTO(findEmployee(employeeDTO.getName())))
                .toList();

        dto.setResponsibleEmployeesList(employeeDto);

        Machine updatedMachine = machineMapper.updateEntity(machine, dto);

        if (dto.getSubDivisionId() != null) {
            updatedMachine.setSubdivision(subDivisionService.findById(dto.getSubDivisionId()));
        }

        return machineMapper.toDto(machineRepository.save(updatedMachine));
    }

    @Override
    @Transactional
    public void deleteMachineByNumber(Integer number) {

        Machine machine = machineRepository.findByNumber(number);

        if (machine != null) {
            machineRepository.delete(machine);
        }
    }

    @Override
    @Transactional
    public void addPdfToMachine(Integer machineNumber, MultipartFile[] files) {

        Machine machine = machineRepository.findByNumber(machineNumber);

        if (machine == null) {
            throw new EntityNotFoundExceptionBormash("Станок с инвентарным номером " + machineNumber + " не найден", NotificationType.ERROR);
        }

        Document document = machine.getDocument();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            try {
                DocumentFile documentFile = new DocumentFile();
                documentFile.setBaseFileName(file.getOriginalFilename());
                documentFile.setContent(file.getBytes());
                documentFile.setDocument(document);
                documentFile.setType(determineFileType(file.getOriginalFilename()));

                document.getFiles().add(documentFile);
            } catch (IOException e) {
                throw new RuntimeException("Document file not found");
            }
        }

        machineRepository.save(machine);
    }

    @Override
    @Transactional(readOnly = true)
    public DocumentFile getMachineFile(UUID fileId) {
        checkMachineFile(fileId);
        return documentService.getDocumentFileById(fileId);
    }

    @Override
    @Transactional
    public void deleteMachineFile(UUID fileId) {
        checkMachineFile(fileId);
        documentService.deleteFileFromDocument(fileId);
    }

    private void checkMachineFile(UUID fileId) {
        if (!machineRepository.existsMachineFile(fileId)) {
            throw new EntityNotFoundExceptionBormash("Файл станка не найден", NotificationType.ERROR);
        }
    }

    private Employee findEmployee(String name) {
        Employee employee = employeeService.loadUserByUsername(name);
        if (employee == null) {
            throw new EntityNotFoundExceptionBormash("Сотрудник «" + name + "» не найден", NotificationType.ERROR);
        }
        return employee;
    }

    @Override
    @Transactional
    public void updateOtherText(Integer number, String text) {
        Machine machine = getMachineByNumber(number);
        machine.setOtherText(text == null || text.isBlank() ? null : text.strip());
    }

    @Override
    @Transactional
    public void addOtherDocuments(Integer number, MultipartFile[] files) {
        Machine machine = getMachineByNumber(number);

        Document otherDocument = machine.getOtherDocument();
        if (otherDocument == null) {
            otherDocument = new Document();
            otherDocument.setName("Прочее: станок № " + machine.getNumber());
            machine.setOtherDocument(otherDocument);
        }

        addPdfFilesToDocument(otherDocument, files);
        machineRepository.save(machine);
    }

    private Machine getMachineByNumber(Integer number) {
        Machine machine = machineRepository.findByNumber(number);
        if (machine == null) {
            throw new EntityNotFoundExceptionBormash("Станок с инвентарным номером " + number + " не найден", NotificationType.ERROR);
        }
        return machine;
    }

    @Override
    @Transactional
    public void addPhotos(Integer number, MultipartFile[] photos) {
        Machine machine = getMachineByNumber(number);

        Document document = machine.getDocument();
        if (document == null) {
            document = new Document();
            document.setName("Документация для станка № " + machine.getNumber());
            machine.setDocument(document);
        }

        addPhotosToDocument(document, photos);
        machineRepository.save(machine);
    }

    @Override
    @Transactional
    public void deleteMachinePhoto(UUID imageId) {
        if (!machineRepository.existsMachinePhoto(imageId)) {
            throw new EntityNotFoundExceptionBormash("Фотография станка не найдена", NotificationType.ERROR);
        }
        imageService.deleteById(imageId);
    }
}
