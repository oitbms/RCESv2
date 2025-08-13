package com.example.rces.spm.services.service.model;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.util.*;

public class ExcelTreeExporter {

    private static final String[] HEADERS = {
            "Строка ЗК/Спрос",
            "ДСЕ",
            "Узел ПЛМ",
            "Описание(заход)",
            "План брутто",
            "Выполнено",
            "Трудоемкость",
            "Дата начала",
            "Дата завершения",
            "РД начала",
            "РД завершения"
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
            CellStyle headerStyle = createHeaderStyle(wb);
            CellStyle defaultStyle = createDefaultStyle(wb);
            Map<Integer, CellStyle> indentStyles = new HashMap<>();

            // Заголовок
            int rowIndex = 0;
            Row headerRow = sheet.createRow(rowIndex++);
            for (int c = 0; c < HEADERS.length; c++) {
                Cell cell = headerRow.createCell(c);
                cell.setCellValue(HEADERS[c]);
                cell.setCellStyle(headerStyle);
            }
            sheet.createFreezePane(0, 1);

            // Рекурсивная запись с группировкой
            RowRangeCounter counter = new RowRangeCounter(rowIndex);
            for (TreeNode root : rootNodes) {
                writeNode(wb, sheet, root, 0, counter, indentStyles, defaultStyle);
            }

            // Настройки outline
            sheet.setRowSumsBelow(false);
            sheet.setRowSumsRight(false);

            try (FileOutputStream fos = new FileOutputStream(fileName)) {
                wb.write(fos);
            }
        }
    }

    private static class RowRangeCounter {
        int currentRow;
        RowRangeCounter(int startRow) { this.currentRow = startRow; }
    }

    private int writeNode(Workbook wb,
                          Sheet sheet,
                          TreeNode node,
                          int depth,
                          RowRangeCounter counter,
                          Map<Integer, CellStyle> indentStyles,
                          CellStyle defaultStyle) {

        int myRowIdx = counter.currentRow;
        Row row = sheet.createRow(myRowIdx);

        // Стиль с отступом
        CellStyle indentStyle = indentStyles.get(depth);
        if (indentStyle == null) {
            CellStyle s = wb.createCellStyle();
            s.cloneStyleFrom(defaultStyle);
            short indent = (short) Math.min(depth, 8); // Excel max indent = 8
            s.setIndention(indent);
            indentStyles.put(depth, s);
            indentStyle = s;
        }

        // Заполнение колонок
        row.createCell(0).setCellValue(nullSafe(node.primaryDemand));
        row.getCell(0).setCellStyle(indentStyle);

        row.createCell(1).setCellValue(nullSafe(node.item));
        row.getCell(1).setCellStyle(defaultStyle);

        row.createCell(2).setCellValue(nullSafe(node.mlmNode));
        row.getCell(2).setCellStyle(defaultStyle);

        row.createCell(3).setCellValue(nullSafe(node.description));
        row.getCell(3).setCellStyle(defaultStyle);

        row.createCell(4).setCellValue(nullSafe(node.qty));
        row.getCell(4).setCellStyle(defaultStyle);

        row.
                createCell(5).setCellValue(nullSafe(node.qtyFinished));
        row.getCell(5).setCellStyle(defaultStyle);

        row.createCell(6).setCellValue(nullSafe(node.resourceTime));
        row.getCell(6).setCellStyle(defaultStyle);

        row.createCell(7).setCellValue(nullSafe(node.dateStart));
        row.getCell(7).setCellStyle(defaultStyle);

        row.createCell(8).setCellValue(nullSafe(node.dateEnd));
        row.getCell(8).setCellStyle(defaultStyle);

        row.createCell(9).setCellValue(nullSafe(node.dateCalcStart));
        row.getCell(9).setCellStyle(defaultStyle);

        row.createCell(10).setCellValue(nullSafe(node.dateCalcEnd));
        row.getCell(10).setCellStyle(defaultStyle);

        counter.currentRow++;

        int lastRowUsed = myRowIdx;

        // Если есть дети — пишем их и группируем
        if (node.children != null && !node.children.isEmpty()) {
            int firstChildRow = counter.currentRow;
            for (TreeNode child : node.children) {
                lastRowUsed = writeNode(wb, sheet, child, depth + 1, counter, indentStyles, defaultStyle);
            }
            int lastChildRow = counter.currentRow - 1;
            if (lastChildRow >= firstChildRow) {
                sheet.groupRow(firstChildRow, lastChildRow);
                sheet.setRowGroupCollapsed(firstChildRow, true);
            }
            lastRowUsed = Math.max(lastRowUsed, lastChildRow);
        }

        return lastRowUsed;
    }

    private static String nullSafe(String s) {
        return s == null ? "" : s;
    }

    private CellStyle createHeaderStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        Font font = wb.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setBorderTop(BorderStyle.THICK);
        style.setBorderBottom(BorderStyle.THICK);
        style.setBorderLeft(BorderStyle.THICK);
        style.setBorderRight(BorderStyle.THICK);
        return style;
    }

    private CellStyle createDefaultStyle(Workbook wb) {
        CellStyle style = wb.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        return style;
    }
}