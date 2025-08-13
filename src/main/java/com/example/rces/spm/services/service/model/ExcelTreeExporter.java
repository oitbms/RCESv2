package com.example.rces.spm.services.service.model;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.util.*;

public class ExcelTreeExporter {

    // Колонки и ширины (в единицах POI: 1 = 1/256th of a character)
    private static final String[] HEADERS = {
            "Строка ЗК/Спрос", // primaryDemand
            "ДСЕ",             // item
            "Узел ПЛМ",        // mlmNode
            "Описание(заход)", // description
            "План брутто",     // qty
            "Выполнено",       // qtyFinished
            "Трудоемкость",    // resourceTime
            "Дата начала",     // dateStart
            "Дата завершения", // dateEnd
            "РД начала",       // dateCalcStart
            "РД завершения"    // dateCalcEnd
    };

    private static final int[] WIDTHS = {
            70 * 256,
            60 * 256,
            35 * 256,
            40 * 256,
            12 * 256,
            14 * 256,
            14 * 256,
            12 * 256,
            16 * 256,
            14 * 256,
            15 * 256
    };

    public void exportToExcel(List<TreeNode> rootNodes, String fileName) throws Exception {
        Objects.requireNonNull(rootNodes, "rootNodes is null");
        if (fileName == null || fileName.isEmpty()) throw new IllegalArgumentException("fileName required");

        try (Workbook wb = new XSSFWorkbook()) {
            Sheet sheet = wb.createSheet("Tree");

            // Установим ширины колонок
            for (int i = 0; i < WIDTHS.length; i++) sheet.setColumnWidth(i, WIDTHS[i]);

            // Стили
            CellStyle headerStyle = wb.createCellStyle();
            Font hFont = wb.createFont();
            hFont.setBold(true);
            headerStyle.setFont(hFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // кэш стилей с отступами (indentation) для уровней вложенности
            Map<Integer, CellStyle> indentStyles = new HashMap<>();

            // стиль по умолчанию для текстовых ячеек
            CellStyle defaultStyle = wb.createCellStyle();
            defaultStyle.setWrapText(false);

            // Заголовок
            int rowIndex = 0;
            Row headerRow = sheet.createRow(rowIndex++);
            for (int c = 0; c < HEADERS.length; c++) {
                Cell cell = headerRow.createCell(c);
                cell.setCellValue(HEADERS[c]);
                cell.setCellStyle(headerStyle);
            }
            // Freeze header
            sheet.createFreezePane(0, 1);

            // Рекурсивный обход — depth-first
            // Нам нужно знать для каждого родителя диапазон строк его детей -> делаем DFS, и после возврата группируем.
            RowRangeCounter counter = new RowRangeCounter(rowIndex); // wrapper для текущего индекса
            for (TreeNode root : rootNodes) {
                writeNode(wb, sheet, root, 0, counter, indentStyles, defaultStyle);
            }

            // Параметры отображения outline
            sheet.setRowSumsBelow(false);
            sheet.setRowSumsRight(false);

            // Запись в файл
            try (FileOutputStream fos = new FileOutputStream(fileName)) {
                wb.write(fos);
            }
        }
    }

    // Вспомогательный класс для передачи и изменения текущего индекса строки
    private static class RowRangeCounter {
        int currentRow;
        RowRangeCounter(int startRow) { this.currentRow = startRow; }
    }

    /**
     * Записывает узел и всех его детей (DFS).
     * Возвращает индекс последней строки, занятой этим узлом и его потомками.
     */
    private int writeNode(Workbook wb,
                          Sheet sheet,
                          TreeNode node,
                          int depth,
                          RowRangeCounter counter,
                          Map<Integer, CellStyle> indentStyles,
                          CellStyle defaultStyle) {

        int myRowIdx = counter.currentRow;
        Row row = sheet.createRow(myRowIdx);
// создаём/получаем стиль с отступом для depth
        CellStyle indentStyle = indentStyles.get(depth);
        if (indentStyle == null) {
            CellStyle s = wb.createCellStyle();
            s.cloneStyleFrom(defaultStyle);
            // отступ (indent) — short
            short indent = (short) Math.min(depth, 8); // Excel поддерживает ограничение отступа; обрежем >8
            s.setIndention(indent);
            indentStyles.put(depth, s);
            indentStyle = s;
        }

        // Заполняем колонки
        // 0 - primaryDemand
        Cell c0 = row.createCell(0);
        c0.setCellValue(nullSafe(node.primaryDemand));
        c0.setCellStyle(indentStyle);

        // 1 - item
        Cell c1 = row.createCell(1);
        c1.setCellValue(nullSafe(node.item));

        // 2 - mlmNode
        Cell c2 = row.createCell(2);
        c2.setCellValue(nullSafe(node.mlmNode));

        // 3 - description
        Cell c3 = row.createCell(3);
        c3.setCellValue(nullSafe(node.description));

        // 4 - qty
        Cell c4 = row.createCell(4);
        c4.setCellValue(nullSafe(node.qty));

        // 5 - qtyFinished
        Cell c5 = row.createCell(5);
        c5.setCellValue(nullSafe(node.qtyFinished));

        // 6 - resourceTime
        Cell c6 = row.createCell(6);
        c6.setCellValue(nullSafe(node.resourceTime));

        // 7 - dateStart
        Cell c7 = row.createCell(7);
        c7.setCellValue(nullSafe(node.dateStart));

        // 8 - dateEnd
        Cell c8 = row.createCell(8);
        c8.setCellValue(nullSafe(node.dateEnd));

        // 9 - dateCalcStart
        Cell c9 = row.createCell(9);
        c9.setCellValue(nullSafe(node.dateCalcStart));

        // 10 - dateCalcEnd
        Cell c10 = row.createCell(10);
        c10.setCellValue(nullSafe(node.dateCalcEnd));

        counter.currentRow++; // следующий свободный индекс

        int lastRowUsed = myRowIdx;

        // Если есть дети — рекурсивно написать их. После этого сгруппировать диапазон (children rows).
        if (node.children != null && !node.children.isEmpty()) {
            int firstChildRow = counter.currentRow;
            for (TreeNode child : node.children) {
                lastRowUsed = writeNode(wb, sheet, child, depth + 1, counter, indentStyles, defaultStyle);
            }
            int lastChildRow = counter.currentRow - 1;
            if (lastChildRow >= firstChildRow) {
                // групируем дочерние строки под этим родителем
                // groupRow(from, to) использует индексы строк (0-based)
                sheet.groupRow(firstChildRow, lastChildRow);

                // Скрыть (свернуть) группу по умолчанию: collapse на первую строку группы
                // По опыту: setRowGroupCollapsed(firstChildRow, true) скрывает указанный диапазон.
                try {
                    sheet.setRowGroupCollapsed(firstChildRow, true);
                } catch (Exception ex) {
                    // Иногда при глубокой вложенности/старых версиях POI может быть исключение.
                    // В таком случае игнорируем — группа всё равно создана.
                }
            }
            // последний используемый — последний ребёнок
            lastRowUsed = Math.max(lastRowUsed, lastChildRow);
        }

        return lastRowUsed;
    }

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }
}