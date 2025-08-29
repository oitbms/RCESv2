package com.example.rces.service.impl;

import com.example.rces.controller.payload.SGIPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.SGI;
import com.example.rces.repository.SgiRepository;
import com.example.rces.service.*;
import com.example.rces.service.impl.telegram.MessageType;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.rces.utils.ServiceUtil.colorCalculate;
import static com.example.rces.utils.ServiceUtil.saveFiles;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SgiServiceImpl implements SgiService {

    private final SgiRepository repository;

    private final EmployeeService employeeService;
    private final ImageService imageService;
    private final FactExecutionSgiService factExecutionSgiService;
    private final SgiLogService sgiLogService;
    private final TelegramService telegramService;

    @Autowired
    public SgiServiceImpl(SgiRepository repository, EmployeeService employeeService, ImageService imageService, FactExecutionSgiService factExecutionSgiService, SgiLogService sgiLogService, TelegramService telegramService) {
        this.repository = repository;
        this.employeeService = employeeService;
        this.imageService = imageService;
        this.factExecutionSgiService = factExecutionSgiService;
        this.sgiLogService = sgiLogService;
        this.telegramService = telegramService;
    }

    public SGIPayload createSGI(String workShop, String event, String actions, String department,
                                LocalDate desiredDate, String note, String employee,
                                MultipartFile[] additionalFiles, String parentId) {
        if (!employeeService.currentUserHaveControlRoles()) {
            throw new ForbiddenException("Создавать заявки могут только управление");
        }

        SGI sgi = new SGI();
        sgi.setWorkShop(workShop);
        sgi.setColor(SGI.ColorSGI.NONE);
        sgi.setEvent(event);
        sgi.setActions(actions);
        sgi.setDepartment(SGI.Department.valueOf(department));
        sgi.setNote(note);
        sgi.setDesiredDate(desiredDate);
        sgi.setCreateDate(LocalDate.now());
        sgi.setEmployee(employeeService.loadUserByUsername(employee));
        sgi.setAgreed(false);
        if (!parentId.isEmpty()) {
            SGI parentSGi = repository.findById(UUID.fromString(parentId)).orElseThrow(() -> new NoResultException("Родительская задача не найдена"));
            sgi.setParentSGI(parentSGi);
            sgi.setRequestNumber(0);
        } else {
            sgi.setRequestNumber(repository.findNextRequestNumber());
        }
        sgi.setExecution(factExecutionSgiService.createFactExecutionSGI(sgi));
        if (additionalFiles != null) {
            sgi.setImages(imageService.createImages(additionalFiles, sgi, false));
        }
        sgi.setColor(colorCalculate(sgi, LocalDate.now()));
        repository.save(sgi);
        telegramService.sendMessage(sgi, null, MessageType.CREATE);
        return new SGIPayload(sgi);
    }

    @Override
    public Page<SGIPayload> getPage(int page, int size) {
        Page<SGI> sgiPage = repository.findAllWithAssociations(PageRequest.of(page, size));
        return sgiPage.map(SGIPayload::new);
    }

    @Override
    public Optional<SGI> findById(UUID id) {
        return repository.findById(id);
    }

    @Override
    public List<SGI> findAll() {
        return repository.findAll();
    }

    @Override
    public List<SGI> findAllByIds(List<UUID> ids) {
        return repository.findAllById(ids);
    }

    @Override
    public void delete(SGI sgi) {
        telegramService.sendMessage(sgi, null, MessageType.DELETE);
        repository.delete(sgi);
    }

    @Override
    public void save(SGI sgi) {
        repository.save(sgi);
    }

    @Override
    public void saveAll(List<SGI> sgiList) {
        repository.saveAll(sgiList);
    }

    @Override
    public SGI save(SGI sgi, Boolean agreed) throws ApplicationContextException, CloneNotSupportedException {
        if (employeeService.currentUserHaveControlRoles()) {
            if (sgi.getSubSGI().stream().allMatch(SGI::getAgreed)) {
                SGI oldSgi = (SGI) sgi.clone();
                sgi.setAgreed(agreed);
                sgi.setColor(colorCalculate(sgi, LocalDate.now()));
                sgi.getLog().addAll(sgiLogService.createLog(oldSgi, sgi, employeeService.getCurrentUser()));
                repository.save(sgi);
                telegramService.sendMessage(sgi, null, MessageType.CLOSE);
                return sgi;
            }
            throw new ApplicationContextException("Все подзадачи должны быть согласованы");
        }
        throw new ApplicationContextException("Согласовывать задачу может только");
    }

    @Override
    public SGIPayload save(SGI sgi, String workcenter, String event, String actions,
                           String department, LocalDate desiredDate, String employee, String note, LocalDate executionDate,
                           Boolean factExecutionSGIBool, LocalDate executionDate2, String report,
                           MultipartFile[] imagesSGI, MultipartFile[] imagesFactSGI) throws CloneNotSupportedException {
        if (!factExecutionSGIBool) {
            SGI oldSgi = (SGI) sgi.clone();
            if (!employeeService.currentUserHaveControlRoles()) {
                throw new ForbiddenException("Редактировать может только создатель задачи");
            }
            try {
                Employee newEmployee = employeeService.loadUserByUsername(employee);
                sgi.setEmployee(newEmployee);
            } catch (Exception e) {
                throw new NoResultException();
            }
            sgi.setWorkShop(workcenter);
            sgi.setEvent(event);
            sgi.setActions(actions);
            sgi.setDepartment(SGI.Department.valueOf(department));
            sgi.setDesiredDate(desiredDate);
            sgi.setNote(note);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            if (imagesSGI != null) {
                List<Images> newImages = saveFiles(imagesSGI, sgi);
                sgi.getImages().clear();
                sgi.getImages().addAll(newImages);
            } else {
                sgi.getImages().clear();
            }
            sgi.getLog().addAll(sgiLogService.createLog(oldSgi, sgi, employeeService.getCurrentUser()));
            repository.save(sgi);
            boolean planDateExist = !(sgi.getPlanDate() == null);
            if (!planDateExist && executionDate != null) {
                telegramService.sendMessage(sgi, null, MessageType.WORK);
            } else {
                telegramService.sendMessage(sgi, null, MessageType.UPDATE);
            }
        } else {
            if (!employeeService.isResponsible(sgi.getEmployee()) & !employeeService.currentUserHaveControlRoles()) {
                throw new ForbiddenException("Создавать факт выполнения может только ответственный за мероприятие сотрудник");
            }
            FactExecutionSGI factExecutionSGI = sgi.getExecution();
            factExecutionSGI.setExecutionDate(executionDate);
            factExecutionSGI.setReport(report);
            if (imagesFactSGI != null) {
                for (MultipartFile file : imagesFactSGI) {
                    if (!file.isEmpty()) {
                        List<Images> newImages = saveFiles(imagesFactSGI, factExecutionSGI);
                        factExecutionSGI.getImages().clear();
                        factExecutionSGI.getImages().addAll(newImages);
                    }
                }
            } else {
                factExecutionSGI.getImages().clear();
            }
            sgi.setPlanDate(executionDate);
            sgi.setExecution(factExecutionSGI);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            repository.save(sgi);
        }
        return new SGIPayload(sgi);
    }

}
