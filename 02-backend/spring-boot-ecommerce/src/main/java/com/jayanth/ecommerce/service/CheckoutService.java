package com.jayanth.ecommerce.service;

import com.jayanth.ecommerce.dto.Purchase;
import com.jayanth.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
