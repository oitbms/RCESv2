package com.example.rces.services;

import com.example.rces.controller.payload.ImagesPayload;
import com.example.rces.models.*;
import com.example.rces.models.enums.Inconsistency;
import com.example.rces.models.enums.Role;
import com.example.rces.models.enums.Status;
import com.example.rces.services.telegram.MessageType;
import com.example.rces.services.telegram.TelegramService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.Entity;
import org.apache.poi.xwpf.usermodel.*;
import org.openxmlformats.schemas.wordprocessingml.x2006.main.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.math.BigInteger;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static com.example.rces.services.ServiceUtil.*;

@Service
public class ApiServices {

    @Autowired
    private UniversalService service;

    @Autowired
    private TelegramService tgService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    Long chatId;

    public List<CustomerOrder> findAllCustomerOrder() {
        return service.findAll(CustomerOrder.class);
    }

    public List<Employee> findAllEmployees(Object role) {
        return service.findAllByField(Employee.class, "role", role);
    }

    public List<ImagesPayload> findImages(UUID param) {
        List<Images> images;
        Requests request = service.findById(Requests.class, param);
        if (request != null) {
            images = service.findAllByField(Images.class, "request", request);
        } else {
            FactExecutionSGI factExecutionSGI = service.findById(FactExecutionSGI.class, param);
            images = service.findAllByField(Images.class, "sgi", factExecutionSGI);
        }

        return images.stream()
                .map(image -> new ImagesPayload(
                        image.getId(),
                        image.getName(),
                        image.getBase64Data(),
                        request != null ? image.getRequest().getId() : image.getSgi().getId()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void update(UUID id, Boolean sendMessage, Map<String, Object> updatedFields, Principal principal) {
        Requests request = service.findById(Requests.class, id);
        Requests oldRequest;
        try {
            oldRequest = (Requests) request.clone();
        } catch (CloneNotSupportedException e) {
            throw new RuntimeException(e);
        }

        Employee updaterEmployee = getUpdater();

        List<Field> fields = List.of(request.getClass().getDeclaredFields());

        updatedFields.forEach((key, value) -> {
            if (!"id".equals(key)) {
                try {
                    String methodName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
                    Method method = request.getClass().getMethod(methodName, fields.stream()
                            .filter(f -> f.getName().equals(key))
                            .findFirst()
                            .orElseThrow(() -> new NoSuchFieldException("Поле " + key + " не найдено"))
                            .getType());

                    if (key.equals("customerOrder") && !isJson(value)) {
                        CustomerOrder customerOrder = service.createOrGetCustomerOrder(objectMapper, updaterEmployee, (String) value, null);
                        method.invoke(request, customerOrder);
                        return;
                    } else if (method.getParameterTypes()[0].isEnum() && value != null) {
                        Class<? extends Enum<?>> enumClass = (Class<? extends Enum<?>>) method.getParameterTypes()[0];
                        value = enumClass.getMethod("fromField", Object.class).invoke(null, value.toString());
                    } else if (method.getParameterTypes()[0].isAnnotationPresent(Entity.class) && value != null) {
                        value = objectMapper.readValue((String) value, method.getParameterTypes()[0]);
                    } else if (key.equals("images") && value != null) {
                        if (!((ArrayList<?>) value).isEmpty()) {
                            List<UUID> imageIds = ((ArrayList<?>) value).stream()
                                    .filter(LinkedHashMap.class::isInstance)
                                    .map(img -> UUID.fromString((String) ((LinkedHashMap<?, ?>) img).get("id")))
                                    .toList();
                            List<Images> images = service.findAllByField(Images.class, "id", imageIds);
                            ((ArrayList<?>) value).stream()
                                    .filter(String.class::isInstance)
                                    .map(String.class::cast)
                                    .forEach(imgStr -> {
                                        Images newImage = new Images(imgStr, request);
                                        images.add(newImage);
                                        service.save(newImage);
                                    });
                            handleImageCollection(request, images);
                            return;
                        }
                        handleImageCollection(request, (List<?>) value);
                        return;
                    } else if (key.equals("inconsistency")) {
                        value = Inconsistency.fromField(value);
                    }

                    method.invoke(request, value);
                } catch (NoSuchMethodException e) {
                    throw new RuntimeException("Метод " + key + " не найден", e);
                } catch (Exception e) {
                    throw new RuntimeException("Ошибка при обновлении поля " + key, e);
                }
            }
        });
        request.setUpdateBy(updaterEmployee);
        request.setUpdateDate(LocalDateTime.now());
        request.setDateWork(LocalDateTime.now());
        request.setVersion(request.getVersion() + 1);
        createLog(oldRequest, request, updaterEmployee, service);
        service.save(request);
        //Если нажали галку отправить в ТГ и поменяли статус
        if (sendMessage) {
//            Employee employee = service.findById(Employee.class, request.getEmployee().getId());
            Employee employee = service.findSingleByField(Employee.class, "name",principal.getName());
            if (request.getStatus().equals(Status.Closed) || request.getStatus().equals(Status.Cancel)) {
                tgService.closeOrCanceledRequestMessage(request, updaterEmployee);
            } else if (request.getStatus() != oldRequest.getStatus()) {
                if (request.getStatus().equals(Status.Completed)) {
                    tgService.sendCompleted(request);
//                } else if (request.getTypeRequest().equals(Requests.Type.constructor)) {
//                    tgService.sendUpdateMessageToGroup(request);
                } else {
                    //если поменяли ответственного -> редирект сообщения иначе заявка обновлена
                    tgService.sendUpdateMessageToGroup(request);
                }
            } else {
                //если поменяли ответственного -> редирект сообщения иначе заявка обновлена

                if (employee.getRole().equals(String.valueOf(Role.MASTER))){
                    Employee empl = service.findById(Employee.class, request.getEmployee().getId());
                    chatId = empl.getChatId();
                } else {
                    chatId = request.getCreatedBy().getChatId();
                }
                tgService.sendMessageToUser(request, chatId,
                        !Objects.equals(request.getEmployee().getId(), oldRequest.getEmployee().getId()) ? MessageType.REDIRECT : MessageType.UPDATE);
            }
            //если закрыли или отменили заявку
        } else if (request.getStatus().equals(Status.Closed) || request.getStatus().equals(Status.Cancel)) {
            tgService.closeOrCanceledRequestMessage(request, updaterEmployee);
        }
    }

    public String getTypeRequest(UUID id) {
        return service.findById(Requests.class, id).getTypeRequest().name();
    }

    public Employee getUpdater() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return userDetailsService.loadUserByUsername(authentication.getName());
    }

    public List<RequestLog> getLogs(UUID id) {
        return service.findAllByField(RequestLog.class, "request", service.findById(Requests.class, id));
    }

    public List<FactExecutionSGI> getExecutions(UUID id) {
        return service.findAllByField(FactExecutionSGI.class, "sgi", service.findById(SGI.class, id));
    }

    public SGI getSgi(UUID id) {
        return service.findById(SGI.class, id);
    }

    public List<SGI> getSgiList(List<UUID> ids) {
        return service.findAllByField(SGI.class, "id", ids);
    }

    public ByteArrayResource generateManyWordFile(List<SGI> sgiList) throws Exception {
        try (XWPFDocument document = new XWPFDocument()) {

            CTSectPr sectPr = document.getDocument().getBody().addNewSectPr();
            CTPageSz pageSz = sectPr.addNewPgSz();
            pageSz.setOrient(STPageOrientation.LANDSCAPE);
            pageSz.setW(BigInteger.valueOf(15840));
            pageSz.setH(BigInteger.valueOf(12240));

            XWPFParagraph title = document.createParagraph();
            title.setAlignment(ParagraphAlignment.CENTER);
            XWPFRun titleRun = title.createRun();
            titleRun.setText("Список мероприятий (" + sgiList.size() + ")");
            titleRun.setBold(true);
            titleRun.setFontSize(20);

            XWPFTable table = document.createTable(1, 11);
            table.setWidth("100%");

            CTTblPr tblPr = table.getCTTbl().getTblPr();
            CTTblBorders borders = tblPr.addNewTblBorders();

            borders.addNewBottom().setVal(STBorder.SINGLE);
            borders.addNewLeft().setVal(STBorder.SINGLE);
            borders.addNewRight().setVal(STBorder.SINGLE);
            borders.addNewTop().setVal(STBorder.SINGLE);
            borders.addNewInsideH().setVal(STBorder.SINGLE);
            borders.addNewInsideV().setVal(STBorder.SINGLE);
            borders.getBottom().setSz(BigInteger.valueOf(8));
            borders.getLeft().setSz(BigInteger.valueOf(8));
            borders.getRight().setSz(BigInteger.valueOf(8));
            borders.getTop().setSz(BigInteger.valueOf(8));
            borders.getInsideH().setSz(BigInteger.valueOf(8));
            borders.getInsideV().setSz(BigInteger.valueOf(8));

            XWPFTableRow headerRow = table.getRow(0);

            String[] headers = {
                    "№ п/п", "№ цеха", "Мероприятие", "Сопутствующие действия",
                    "Ответственный отдел", "Ответственное лицо", "Желаемый срок",
                    "Примечание", "Планируемый срок", "Комментарий", "Статус"
            };

            for (int i = 0; i < headers.length; i++) {
                XWPFTableCell cell = headerRow.getCell(i);
                setCellText(cell, headers[i], true);
                cell.setColor("007bff"); // Синий фон

                setCellBorders(cell);
            }

            for (SGI sgi : sgiList) {
                XWPFTableRow row = table.createRow();

                setCellText(row.getCell(0), String.valueOf(sgi.getRequestNumber()), false);
                setCellText(row.getCell(1), sgi.getWorkShop() != null ? sgi.getWorkShop() : "", false);
                setCellText(row.getCell(2), sgi.getEvent() != null ? sgi.getEvent() : "", false);
                setCellText(row.getCell(3), sgi.getActions() != null ? sgi.getActions() : "", false);
                setCellText(row.getCell(4), sgi.getDepartment() != null ? sgi.getDepartment().getName() : "", false);
                setCellText(row.getCell(5), sgi.getEmployee() != null ? sgi.getEmployee().getName() : "", false);
                setCellText(row.getCell(6), sgi.getDesiredDate() != null ? formatedDate(sgi.getDesiredDate()) : "", false);
                setCellText(row.getCell(7), sgi.getNote() != null ? sgi.getNote() : "", false);
                setCellText(row.getCell(8), sgi.getPlanDate() != null ? formatedDate(sgi.getPlanDate()) : "", false);
                setCellText(row.getCell(9), sgi.getComment() != null ? sgi.getComment() : "", false);
                setCellText(row.getCell(10), sgi.getAgreed() ? "Выполнено" : "Не выполнено", false);

                String colorHex = getColorHex(sgi.getColor().name());
                for (XWPFTableCell cell : row.getTableCells()) {
                    cell.setColor(colorHex);
                    setCellBorders(cell);
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.write(out);
            return new ByteArrayResource(out.toByteArray());
        }
    }

    private void setCellBorders(XWPFTableCell cell) {
        CTTcPr tcPr = cell.getCTTc().addNewTcPr();
        CTTcBorders borders = tcPr.addNewTcBorders();

        borders.addNewBottom().setVal(STBorder.SINGLE);
        borders.addNewLeft().setVal(STBorder.SINGLE);
        borders.addNewRight().setVal(STBorder.SINGLE);
        borders.addNewTop().setVal(STBorder.SINGLE);

        // Устанавливаем толщину границ (1pt)
        borders.getBottom().setSz(BigInteger.valueOf(8));
        borders.getLeft().setSz(BigInteger.valueOf(8));
        borders.getRight().setSz(BigInteger.valueOf(8));
        borders.getTop().setSz(BigInteger.valueOf(8));
    }

    private String getColorHex(String color) {
        if (color == null) return "FFFFFF";
        return switch (color) {
            case "RED" -> "FFC7CE";
            case "GREEN" -> "C6EFCE";
            case "YELLOW" -> "FFEB9C";
            case "GREY" -> "D9D9D9";
            default -> "FFFFFF";
        };
    }

    private void setCellText(XWPFTableCell cell, String text, boolean isHeader) {
        if (cell == null) return;
        cell.removeParagraph(0);
        XWPFParagraph paragraph = cell.addParagraph();
        paragraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun run = paragraph.createRun();
        run.setText(text != null ? text : "");
        if (isHeader) {
            run.setColor("FFFFFF");
            run.setBold(true);
        }
    }

}
