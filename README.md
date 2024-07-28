# E-Commerce Application Backend API Documentation

Welcome to the documentation for the E-Commerce Application Backend API. This document provides an overview of the available endpoints, their functionalities, and usage instructions.

## Introduction

This API serves as the backend for our E-Commerce Application, providing various endpoints to manage products, orders, users, and authentication.

**Base URL:** `https://ecommerce-backend-gs1q.onrender.com`

## Endpoints

### Authentication

- **`POST /api/v1/user/login`**: Log in with a username and password to obtain an access token.
- **`POST /api/v1/user/signup`**: Register a new user account.
- **`POST /api/v1/user/logout`**: Log out a user.

### Wishlist

- **`POST /api/v1/wishlist/add`**: Users can add products to their wishlist.
- **`POST /api/v1/wishlist/remove`**: Users can remove products from their wishlist.
- **`GET /api/v1/wishlist`**: Retrieve the whole wishlist.

### Products

- **`POST /api/v1/product/create`**: Create a new product.
- **`PUT /api/v1/product/edit/{productId}`**: Update a product.
- **`GET /api/v1/product/list/?pageSize{}&pageNumber={}&minPrice={}&sort={}`**: Retrieve details of products.
- **`DELETE /api/v1/product/delete/{productId}`**: Delete a product by ID.

### Coupon

- **`POST /api/v1/coupon/create`**: Post a coupon with a discount.
- **`POST /api/v1/coupon/validate`**: Get the list of validate coupons.

### Cart

- **`POST /api/v1/cart/add`**: Add items to the cart.
- **`POST /api/v1/cart/remove`**: To remove items from cart.
- **`POST /api/v1/cart`**: get items details in the cart..

### Orders

- **`POST /api/v1/order`**: Place a new order.

## Error Handling

Errors are returned in JSON format with appropriate status codes and messages. Refer to the API documentation for specific error responses.

## Rate Limiting

To ensure fair usage and prevent abuse, API requests are rate-limited. The rate limits are subject to change based on usage patterns and server load.

## Authentication

Most endpoints require authentication using an API key. Include the API key in the request headers as follows: `Authorization: Bearer <API_KEY>`
