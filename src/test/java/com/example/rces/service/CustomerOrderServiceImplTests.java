package com.example.rces.service;

import com.example.rces.models.CustomerOrder;
import com.example.rces.models.Employee;
import com.example.rces.repository.CustomerOrderRepository;
import com.example.rces.service.impl.CustomerOrderServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.example.rces.testData.createCustomerOrder;
import static com.example.rces.testData.createEmployee;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CustomerOrderServiceImplTests {

    @Mock
    private CustomerOrderRepository customerOrderRepository;
    @Mock
    private ObjectMapper objectMapper;
    @InjectMocks
    private CustomerOrderServiceImpl customerOrderService;

    @Test
    void createOrGetCustomerOrder_WhenNameExistsAndJsonMatches_ShouldReturnJsonOrder() throws JsonProcessingException {

        Employee employee = createEmployee();
        CustomerOrder customerOrder = createCustomerOrder();
        String customerOrderName = "TestCustomerOrderName";
        String json = "{\"id\":\"" + customerOrder.getId() +
                "\",\"name\":\"" + customerOrder.getName() +
                "\",\"createDate\":\"" + customerOrder.getCreateDate() +
                "\",\"employee\":{\"id\":\"" + customerOrder.getEmployee().getId() +
                "\",\"name\":\"" + customerOrder.getEmployee().getName() + "\"}}";


        when(customerOrderRepository.findByName(customerOrderName)).thenReturn(customerOrder);
        when(objectMapper.readValue(json, CustomerOrder.class)).thenReturn(customerOrder);

        CustomerOrder result = customerOrderService.createOrGetCustomerOrder(employee, customerOrderName, json);


        assertEquals(customerOrder, result);
        verify(customerOrderRepository, never()).save(any());
    }

    @Test
    void createOrGetCustomerOrder_WhenNameExistsAndJsonNull_ShouldReturnExistingOrder() {

        Employee employee = createEmployee();
        String customerOrderName = "TestCustomerOrderName";
        CustomerOrder customerOrder = createCustomerOrder();


        when(customerOrderRepository.findByName(customerOrderName)).thenReturn(customerOrder);


        CustomerOrder result = customerOrderService.createOrGetCustomerOrder(employee, customerOrderName, null);


        assertEquals(customerOrder, result);
        verify(customerOrderRepository, never()).save(any());
    }

    @Test
    void createOrGetCustomerOrder_WhenNameNotExists_ShouldCreateNewOrder() {

        Employee employee = createEmployee();
        String customerOrderName = "TestCustomerOrderNameNotExists";
        CustomerOrder customerOrder = createCustomerOrder();


        when(customerOrderRepository.findByName(customerOrderName)).thenReturn(null);
        when(customerOrderRepository.save(any(CustomerOrder.class))).thenReturn(customerOrder);

        CustomerOrder result = customerOrderService.createOrGetCustomerOrder(employee, customerOrderName, null);

        assertNotNull(result);
        assertEquals(customerOrderName, result.getName());
        assertEquals(employee, result.getEmployee());
        verify(customerOrderRepository.save(any(CustomerOrder.class)));
    }

    @Test
    void createOrGetCustomerOrder_WhenJsonProcessingFails_ShouldThrowException() throws Exception {

        Employee employee = createEmployee();
        String customerOrderName = "TestCustomerOrderName";
        String json = "TestInvalidJson";


        when(objectMapper.readValue(json, CustomerOrder.class))
                .thenThrow(new JsonProcessingException("Ошибка при десериализации JSON тестового заказа") {
                });


        assertThrows(RuntimeException.class, () -> customerOrderService.createOrGetCustomerOrder(employee, customerOrderName, json));
    }

    @Test
    void createOrGetCustomerOrder_WhenNameBlankButJsonProvided_ShouldCreateNewOrder() throws Exception {

        Employee employee = createEmployee();
        String customerOrderName = "";
        CustomerOrder customerOrder = createCustomerOrder();
        String json = "{\"id\":\"" + customerOrder.getId() +
                "\",\"name\":\"" + customerOrder.getName() +
                "\",\"createDate\":\"" + customerOrder.getCreateDate() +
                "\",\"employee\":{\"id\":\"" + customerOrder.getEmployee().getId() +
                "\",\"name\":\"" + customerOrder.getEmployee().getName() + "\"}}";


        when(customerOrderRepository.save(any(CustomerOrder.class))).thenReturn(customerOrder);

        CustomerOrder result = customerOrderService.createOrGetCustomerOrder(employee, customerOrderName, json);

        assertNotNull(result, "Заказ клиента не может быть null");
        assertEquals(customerOrder, result);
        verify(customerOrderRepository, never()).findByName(any());
        verify(customerOrderRepository, never()).save(any());
    }

    @Test
    void findAll_ShouldReturnAllOrders() {

        List<CustomerOrder> customerOrders = List.of(createCustomerOrder());


        when(customerOrderRepository.findAll()).thenReturn(customerOrders);


        List<CustomerOrder> result = customerOrderService.findAll();


        assertEquals(1, result.size());
        verify(customerOrderRepository).findAll();
    }

}
