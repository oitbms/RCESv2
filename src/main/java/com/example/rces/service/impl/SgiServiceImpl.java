package com.example.rces.service.impl;

import com.example.rces.controller.payload.SGIPayload;
import com.example.rces.models.Employee;
import com.example.rces.models.FactExecutionSGI;
import com.example.rces.models.Images;
import com.example.rces.models.SGI;
import com.example.rces.models.enums.Color;
import com.example.rces.repository.SgiRepository;
import com.example.rces.service.*;
import com.example.rces.service.impl.telegram.MessageType;
import com.example.rces.service.impl.telegram.event.TelegramRegularEvent;
import com.example.rces.service.impl.telegram.event.TelegramSgiEvent;
import com.example.rces.utils.FilesUtil;
import jakarta.persistence.NoResultException;
import jakarta.ws.rs.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContextException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static com.example.rces.utils.FilesUtil.addImages;
import static com.example.rces.utils.ServiceUtil.buildExpiredRequestsString;
import static com.example.rces.utils.ServiceUtil.colorCalculate;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class SgiServiceImpl implements SgiService {

    private final SgiRepository repository;

    private final EmployeeService employeeService;
    private final ImageService imageService;
    private final FactExecutionSgiService factExecutionSgiService;
    private final TelegramService telegramService;

    private final String controlChatId;
    private final String testChatId;

    @Autowired
    public SgiServiceImpl(SgiRepository repository, EmployeeService employeeService, ImageService imageService,
                          FactExecutionSgiService factExecutionSgiService, TelegramService telegramService,
                          @Value("${telegram.chat.control.id}") String controlChatId, @Value("${telegram.chat.test.id}") String testChatId) {
        this.repository = repository;
        this.employeeService = employeeService;
        this.imageService = imageService;
        this.factExecutionSgiService = factExecutionSgiService;
        this.telegramService = telegramService;
        this.controlChatId = controlChatId;
        this.testChatId = testChatId;
    }

    public synchronized SGIPayload createSGI(String workShop, String event, String actions, String department,
                                             LocalDate desiredDate, String note, String employee,
                                             MultipartFile[] additionalFiles, String parentId) {
        if (!employeeService.currentUserHaveControlRoles()) {
            throw new ForbiddenException("Создавать заявки могут только управление");
        }

        SGI sgi = new SGI();
        sgi.setWorkShop(workShop);
        sgi.setColor(Color.NONE);
        sgi.setEvent(event);
        sgi.setActions(actions);
        sgi.setDepartment(SGI.Department.valueOf(department));
        sgi.setNote(note);
        sgi.setDesiredDate(desiredDate);
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
        telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.CREATE, this.controlChatId));
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
        telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.DELETE, this.controlChatId));
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
                sgi.setAgreed(agreed);
                sgi.setColor(colorCalculate(sgi, LocalDate.now()));
                repository.save(sgi);
                telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.CLOSE, this.controlChatId));
                return sgi;
            }
            throw new ApplicationContextException("Все подзадачи должны быть согласованы");
        }
        throw new ApplicationContextException("Согласовывать задачу может только");
    }

    @Override
    public SGIPayload save(SGI sgi, String workcenter, String event, String actions,
                           String department, LocalDate desiredDate, LocalDate planDate, String employee, String note, LocalDate executionDate,
                           Boolean factExecutionSGIBool, LocalDate executionDate2, String report,
                           MultipartFile[] imagesSGI, MultipartFile[] imagesFactSGI) throws CloneNotSupportedException {
        if (!factExecutionSGIBool) {
            SGI oldSgi = (SGI) sgi.clone();
            boolean planDateExist = !(oldSgi.getPlanDate() == null);
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
            sgi.setPlanDate(planDate);
            sgi.setNote(note);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            if (imagesSGI != null) {
                List<Images> newImages = addImages(imagesSGI, sgi);
                sgi.getImages().clear();
                sgi.getImages().addAll(newImages);
            } else {
                sgi.getImages().clear();
            }
            repository.save(sgi);
            if (!planDateExist && executionDate != null) {
                telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.WORK, this.controlChatId));
            } else {
                telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.UPDATE, this.controlChatId));
            }
        } else {
            if (!employeeService.isResponsible(sgi.getEmployee()) & !employeeService.currentUserHaveControlRoles()) {
                throw new ForbiddenException("Создавать факт выполнения может только ответственный за мероприятие сотрудник");
            }
            FactExecutionSGI factExecutionSGI = sgi.getExecution();
            boolean planDateExist = !(factExecutionSGI.getExecutionDate() == null);
            factExecutionSGI.setExecutionDate(executionDate);
            factExecutionSGI.setReport(report);
            if (imagesFactSGI != null) {
                List<Images> newImages = FilesUtil.addImages(imagesFactSGI, factExecutionSGI);
                factExecutionSGI.getImages().clear();
                factExecutionSGI.getImages().addAll(newImages);
            } else {
                factExecutionSGI.getImages().clear();
            }
            sgi.setExecution(factExecutionSGI);
            sgi.setColor(colorCalculate(sgi, LocalDate.now()));
            if (!planDateExist && executionDate != null) {
                telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.COMPLETED, this.controlChatId));
            } else {
                telegramService.sendMessageForSGI(new TelegramSgiEvent(this, sgi, null, MessageType.UPDATE, this.controlChatId));
            }
            repository.save(sgi);
        }
        return new SGIPayload(sgi);
    }

    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyExpiredDeviations() {
        LocalDate today = LocalDate.now();
        List<SGI> sgiList = repository.findAll();
        String requestsNumbers = buildExpiredRequestsString(sgiList, today);
        if (!requestsNumbers.isEmpty()) {
            telegramService.sendRegularMessage(new TelegramRegularEvent("Просрочен срок выполнения мероприятий: №%s", requestsNumbers, this.controlChatId));
        }
    }

}
