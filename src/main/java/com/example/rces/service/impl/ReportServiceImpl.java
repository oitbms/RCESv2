package com.example.rces.service.impl;

import com.example.rces.dto.report.SpeReportModel;
import com.example.rces.models.Employee;
import com.example.rces.models.Requests;
import com.example.rces.models.SGI;
import com.example.rces.models.SPE;
import com.example.rces.models.enums.Format;
import com.example.rces.models.enums.Status;
import com.example.rces.service.*;
import com.example.rces.utils.JasperReportExporter;
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
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.WordExporter.generateManyWordFile;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class ReportServiceImpl implements ReportService {

    private final JasperReportExporter jasperReportExporter;
    private final SgiService sgiService;
    private final RequestsService requestsService;
    private final EmployeeService employeeService;
    private final SpeService speService;

    @Autowired
    public ReportServiceImpl(JasperReportExporter jasperReportExporter, SgiService sgiService, RequestsService requestsService, EmployeeService employeeService, SpeService speService) {
        this.jasperReportExporter = jasperReportExporter;
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
                .filter(requests -> requests.getSubDivision().equals(user.getSubDivision()))
                .filter(requests -> requests.getStatus().equals(Status.Rejected))
                .toList();

        try (XSSFWorkbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            XSSFSheet sheet = workbook.createSheet("Rejected Bids");

            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(user.getSubDivision().getName() + " отчет о забракованной продукции");
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
    public byte[] createSpeReport(List<Integer> numberList) {
        List<SPE> speList = speService.findAllByIdList(numberList).stream().sorted(Comparator.comparing(SPE::getNumber)).toList();
        SpeReportModel model = new SpeReportModel(speList);
        return jasperReportExporter.generateJrxmlReport("Spe", null, List.of(model), Format.PDF);
    }

}
