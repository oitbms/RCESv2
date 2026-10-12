package com.example.rces.dto;

import com.example.rces.models.enums.NotificationApp;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeCreateDTO {

    @NotBlank(message = "Имя сотрудника не может быть пустым")
    @Size(min = 4, max = 100, message = "Имя сотрудника должно содержать от 4 до 100 символов")
    private String name;

    @NotBlank(message = "Пароль не может быть пустым")
    @Size(min = 6, max = 100, message = "Пароль должен содержать от 6 до 100 символов")
    private String password;

    @NotBlank(message = "Роль не может быть пустой")
    private String role;

    @NotNull(message = "Подразделение не может быть пустым")
    private Long subDivisionId;

    @NotNull(message = "Идентификатор чата не может быть пустым")
    private Long chatId;

    @NotNull(message = "Приложение для отправки уведомлений не может быть пустым")
    private NotificationApp notificationApp;

    @NotNull(message = "Статус не может быть пустым")
    @Builder.Default
    private Boolean active = true;
}
