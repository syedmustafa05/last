<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RequisitionController;
use App\Http\Controllers\Api\VendorController;
use App\Http\Controllers\Api\PurchaseOrderController;
use App\Http\Controllers\Api\GoodsReceiptController;
use App\Http\Controllers\Api\InvoiceController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Requisitions API routes
Route::apiResource('requisitions', RequisitionController::class);

// Vendors API routes
Route::apiResource('vendors', VendorController::class);

// Purchase Orders API routes
Route::apiResource('purchase-orders', PurchaseOrderController::class);

// Goods Receipts API routes
Route::apiResource('goods-receipts', GoodsReceiptController::class);

// Invoices API routes
Route::apiResource('invoices', InvoiceController::class);