<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\GoodsReceiptController;
use App\Http\Controllers\Api\InvoiceController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Requisitions API Routes
Route::apiResource('requisitions', RequisitionController::class);

// Vendors API Routes
Route::apiResource('vendors', VendorController::class);

// Purchase Orders API Routes
Route::apiResource('purchase-orders', PurchaseOrderController::class);

// Goods Receipts API Routes
Route::apiResource('goods-receipts', GoodsReceiptController::class);

// Invoices API Routes
Route::apiResource('invoices', InvoiceController::class);