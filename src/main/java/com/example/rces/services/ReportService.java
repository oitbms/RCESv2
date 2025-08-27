package com.example.rces.services;

import com.example.rces.models.SGI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContextException;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import static com.example.rces.utils.WordExporter.generateManyWordFile;

@Service
public class ReportService {

    private final UniversalService service;

    @Autowired
    public ReportService(UniversalService service) {
        this.service = service;
    }

    public List<SGI> getSgiList(List<UUID> ids, String department) {
        if (department != null) {
            return service.findAll(SGI.class)
                    .stream().filter(sgi -> sgi.getDepartment().getName().equals(department))
                    .sorted(Comparator.comparing(SGI::getRequestNumber))
                    .toList();
        } else {
            return service.findAllByField(SGI.class, "id", ids);
        }
    }

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
