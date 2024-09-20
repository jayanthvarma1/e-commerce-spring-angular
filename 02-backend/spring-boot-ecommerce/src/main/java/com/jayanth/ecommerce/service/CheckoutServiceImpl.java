package com.jayanth.ecommerce.service;

import com.jayanth.ecommerce.dao.CustomerRepository;
import com.jayanth.ecommerce.dto.Purchase;
import com.jayanth.ecommerce.dto.PurchaseResponse;
import com.jayanth.ecommerce.entity.Customer;
import com.jayanth.ecommerce.entity.Order;
import com.jayanth.ecommerce.entity.OrderItem;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
public class CheckoutServiceImpl implements CheckoutService {


    private CustomerRepository customerRepository;

    @Autowired
    public CheckoutServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public PurchaseResponse placeOrder(Purchase purchase) {

        //        retrieve the order info from dto
        Order order = purchase.getOrder();

//        generate tracking number
        String orderTrackingNumber = generateOrderTrackingNumber();

//        populate order with orderItems
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item -> order.add(item));

//        pupulate order with billingAddress and shippingAddress
        order.setBillingAddress(purchase.getBillingAddress());
        order.setShippingAddress(purchase.getShippingAddress());

//        Ppopulate customer with order
        Customer customer = purchase.getCustomer();
        customer.add(order);

//        save to the database
        customerRepository.save(customer);

//        return the response
        return new PurchaseResponse(orderTrackingNumber);

    }

    private String generateOrderTrackingNumber() {
//        generate a random uuid number
        return UUID.randomUUID().toString();
    }
}
