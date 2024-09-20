package com.jayanth.ecommerce.dto;

import com.jayanth.ecommerce.entity.Address;
import com.jayanth.ecommerce.entity.Customer;
import com.jayanth.ecommerce.entity.Order;
import com.jayanth.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;

}
