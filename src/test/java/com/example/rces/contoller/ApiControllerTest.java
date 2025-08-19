//package com.example.rces.contoller;
//
//import com.example.rces.controller.ApiController;
//import com.example.rces.models.Employee;
//import com.example.rces.services.ApiServices;
//import org.junit.jupiter.api.Test;
//import org.junit.jupiter.api.extension.ExtendWith;
//import org.mockito.InjectMocks;
//import org.mockito.Mock;
//import org.mockito.junit.jupiter.MockitoExtension;
//
//import java.util.List;
//
//import static com.example.rces.testData.getListEmployees;
//import static org.junit.jupiter.api.Assertions.assertEquals;
//import static org.mockito.Mockito.*;
//
//@ExtendWith(MockitoExtension.class)
//class ApiControllerTest {
//
//    @Mock
//    private ApiServices service;
//
//    @InjectMocks
//    private ApiController controller;
//
//    @Test
//    void getEmployees_ShouldReturnListOfEmployees() {
//        // Arrange
//        Object testParam = new Object();
//        List<Employee> expectedEmployees = getListEmployees();
//
//        when(service.findAllEmployees(testParam)).thenReturn(expectedEmployees);
//
//        // Act
//        List<Employee> actualEmployees = controller.getEmployees(testParam);
//
//        // Assert
//        assertEquals(expectedEmployees, actualEmployees);
//        verify(service, times(1)).findAllEmployees(testParam);
//    }
//    @Test
//    void getEmployees_ShouldReturnEmptyListWhenNoEmployees() {
//        // Arrange
//        Object testParam = new Object();
//        when(service.findAllEmployees(testParam)).thenReturn(List.of());
//
//        // Act
//        List<Employee> actualEmployees = controller.getEmployees(testParam);
//
//        // Assert
//        assertEquals(0, actualEmployees.size());
//        verify(service, times(1)).findAllEmployees(testParam);
//    }
//
//
//
//}
