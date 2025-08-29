package com.example.rces.service.impl;

import com.example.rces.models.SGI;
import com.example.rces.service.ReportService;
import com.example.rces.service.SgiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.WordExporter.generateManyWordFile;

@Service
@Transactional(transactionManager = "primaryTransactionManager")
public class ReportServiceImpl implements ReportService {

    private final SgiService sgiService;

    @Autowired
    public ReportServiceImpl(SgiService sgiService) {
        this.sgiService = sgiService;
    }

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
}
