package com.example.rces.service.impl;

import com.example.rces.dto.report.SpeReportModel;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.models.SPE;
import com.example.rces.models.enums.FileType;
import com.example.rces.models.enums.Status;
import com.example.rces.service.*;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static com.example.rces.utils.FilesUtil.exportReport;
import static com.example.rces.utils.WordExporter.generateManyWordFile;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class ReportServiceImpl implements ReportService {

    private final SgiService sgiService;
    private final RequestsService requestsService;
    private final EmployeeService employeeService;
    private final SpeService speService;

    @Autowired
    public ReportServiceImpl(SgiService sgiService, RequestsService requestsService, EmployeeService employeeService, SpeService speService) {
        this.sgiService = sgiService;
        this.requestsService = requestsService;
        this.employeeService = employeeService;
        this.speService = speService;
    }

    //TODO переделать под JasperReports
    @Override
    public List<SGI> getSgiList(List<UUID> ids, String department) {
        if (department != null) {
            return sgiService.findAll()
                    .stream().filter(sgi -> sgi.getDepartment().getName().equals(department))
                    .sorted(Comparator.comparing(SGI::getRequestNumber))
                    .toList();
        } else {
            return sgiService.findAllByIds(ids);
        }
    }

    //TODO переделать под JasperReports
    @Override
    public ByteArrayResource getExcelFile(List<SGI> sgiList) {
        try {
            return generateManyWordFile(sgiList, List.of(
                    "№ п/п", "№ цеха", "Мероприятие", "Сопутствующие действия",
                    "Ответственный отдел", "Ответственное лицо", "Желаемый срок",
                    "Примечание", "Планируемый срок", "Комментарий", "Статус"));
        } catch (Exception e) {
            throw new ApplicationContextException("Ошибка при создании отчета СГИ", e);
        }
    }

    //TODO переделать под JasperReports
    @Override
    public byte[] reportBid() throws IOException {
        Employee user = employeeService.getCurrentUser();
        List<Requests> rejectedBid = requestsService.findAll().stream()
                .filter(requests -> requests.getMlmNode().equals(user.getMlmNode()))
                .filter(requests -> requests.getStatus().equals(Status.Rejected))
                .toList();

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Rejected Bids");

            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(user.getMlmNode().getName() + " отчет о забракованной продукции");
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, 3));

            CellStyle titleStyle = workbook.createCellStyle();
            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);
            titleCell.setCellStyle(titleStyle);

            Row headerRow = sheet.createRow(1);
            headerRow.createCell(0).setCellValue("№");
            headerRow.createCell(1).setCellValue("Обозначение/Наименование");
            headerRow.createCell(2).setCellValue("ЗК");
            headerRow.createCell(3).setCellValue("Дата");

            int rowNum = 2;
            for (Requests reject : rejectedBid) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(reject.getRequestNumber());
                row.createCell(1).setCellValue(reject.getTitle() != null ? reject.getTitle() : "");
                row.createCell(2).setCellValue(reject.getCustomerOrder().getName());
                row.createCell(3).setCellValue(reject.getUpdatedDate() != null ? LocalDateTime.from(reject.getUpdatedDate()).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) : "");
            }

            for (int i = 0; i < 4; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    @Override
    public ByteArrayResource createSpeReport(List<Integer> numberList) {
        List<SPE> speList = speService.findAllByIdList(numberList).stream().sorted(Comparator.comparing(SPE::getNumber)).toList();
        SpeReportModel model = new SpeReportModel(speList);
        return generateJrxmlReport("Spe", null, List.of(model), FileType.PDF);
    }

    private <T> ByteArrayResource generateJrxmlReport(String reportName,
                                                      Map<String, Object> parameters,
                                                      List<T> data,
                                                      FileType type) {
        try (InputStream reportStream = getClass().getResourceAsStream(String.format("/reports/%s.jrxml", reportName))) {
            JasperReport jasperReport = JasperCompileManager.compileReport(reportStream);
            JRDataSource dataSource = new JRBeanCollectionDataSource(data);
            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
            return new ByteArrayResource(exportReport(jasperPrint, type));
        } catch (Exception e) {
            throw new ApplicationContextException(String.format("Ошибка при генерации отчета %s", reportName), e);
        }
    }

}
