package com.example.rces.service;

import com.example.rces.models.SGI;
import com.example.rces.service.impl.ReportServiceImpl;
import com.example.rces.utils.WordExporter;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationContextException;
import org.springframework.core.io.ByteArrayResource;

import java.util.List;
import java.util.UUID;

import static com.example.rces.testData.createTestSgiList;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReportServiceImplTest {

    @Mock
    private SgiService sgiService;

    @InjectMocks
    private ReportServiceImpl reportService;

    @Test
    void getSgiList_whenDepartmentProvided_ShouldReturnFilteredAndSortedList() {

        // ОГМ
        SGI sgi1 = new SGI();
        sgi1.setRequestNumber(1);
        sgi1.setDepartment(SGI.Department.mechanic);
        // ОРС
        SGI sgi2 = new SGI();
        sgi2.setRequestNumber(2);
        sgi2.setDepartment(SGI.Department.builder);
        // ОГМ
        SGI sgi3 = new SGI();
        sgi3.setRequestNumber(3);
        sgi3.setDepartment(SGI.Department.mechanic);


        when(sgiService.findAll()).thenReturn(List.of(sgi1, sgi2, sgi3));


        List<SGI> result = reportService.getSgiList(
                List.of(UUID.randomUUID()),
                "ОГМ"
        );


        assertEquals(2, result.size());
        assertEquals(1, result.get(0).getRequestNumber()); // sgi3 должен быть первым после сортировки
        assertEquals(3, result.get(1).getRequestNumber()); // sgi1 должен быть вторым
    }

    @Test
    void getSgiList_WithoutDepartment_ShouldReturnListByIds() {

        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();
        List<UUID> targetIds = List.of(id1, id2);
        SGI sgi1 = new SGI();
        SGI sgi2 = new SGI();


        when(sgiService.findAllByIds(targetIds)).thenReturn(List.of(sgi1, sgi2));


        List<SGI> result = reportService.getSgiList(targetIds, null);


        assertEquals(2, result.size());
        assertEquals(List.of(sgi1, sgi2), result);
    }

    @Test
    void getExcelFile_ShouldReturnByteArrayResource_WhenValidInput() {
        try (MockedStatic<WordExporter> wordExporterMock = Mockito.mockStatic(WordExporter.class)) {

            ByteArrayResource expectedResource = new ByteArrayResource(new byte[10]);
            List<SGI> sgiList = createTestSgiList();
            List<String> expectedHeaders = List.of(
                    "№ п/п", "№ цеха", "Мероприятие", "Сопутствующие действия",
                    "Ответственный отдел", "Ответственное лицо", "Желаемый срок",
                    "Примечание", "Планируемый срок", "Комментарий", "Статус"
            );


            wordExporterMock.when(() -> WordExporter.generateManyWordFile(sgiList, expectedHeaders))
                    .thenReturn(expectedResource);


            ByteArrayResource result = reportService.getExcelFile(sgiList);


            assertNotNull(result);
            assertEquals(expectedResource, result);
            wordExporterMock.verify(() -> WordExporter.generateManyWordFile(eq(sgiList), eq(expectedHeaders)));
        }
    }

    @Test
    void getExcelFile_ShouldThrowException_WhenWordExporterFails() {
        try (MockedStatic<WordExporter> wordExporterMock = Mockito.mockStatic(WordExporter.class)) {

            List<SGI> sgiList = createTestSgiList();


            wordExporterMock.when(() -> WordExporter.generateManyWordFile(anyList(), anyList()))
                    .thenThrow(new RuntimeException("Ошибка при генерации Word файла СГИ"));


            assertThrows(ApplicationContextException.class, () -> reportService.getExcelFile(sgiList));
        }
    }


}
