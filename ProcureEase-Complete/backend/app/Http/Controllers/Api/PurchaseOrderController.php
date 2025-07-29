<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PurchaseOrderController extends Controller
{
    public function index(): JsonResponse
    {
        $purchaseOrders = PurchaseOrder::with(['requisition', 'vendor'])->get();
        return response()->json([
            'success' => true,
            'data' => $purchaseOrders
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requisition_id' => 'required|exists:requisitions,id',
                'vendor_id' => 'required|exists:vendors,id',
                'total_amount' => 'required|numeric|min:0',
                'status' => 'required|in:Draft,Issued,Completed,Cancelled',
                'order_date' => 'required|date',
                'notes' => 'nullable|string',
            ]);

            $purchaseOrder = PurchaseOrder::create($validated);
            $purchaseOrder->load(['requisition', 'vendor']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase Order created successfully',
                'data' => $purchaseOrder
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(PurchaseOrder $purchaseOrder): JsonResponse
    {
        $purchaseOrder->load(['requisition', 'vendor', 'goodsReceipts', 'invoices']);
        return response()->json([
            'success' => true,
            'data' => $purchaseOrder
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requisition_id' => 'sometimes|required|exists:requisitions,id',
                'vendor_id' => 'sometimes|required|exists:vendors,id',
                'total_amount' => 'sometimes|required|numeric|min:0',
                'status' => 'sometimes|required|in:Draft,Issued,Completed,Cancelled',
                'order_date' => 'sometimes|required|date',
                'notes' => 'nullable|string',
            ]);

            $purchaseOrder->update($validated);
            $purchaseOrder->load(['requisition', 'vendor']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase Order updated successfully',
                'data' => $purchaseOrder
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(PurchaseOrder $purchaseOrder): JsonResponse
    {
        $purchaseOrder->delete();
        return response()->json([
            'success' => true,
            'message' => 'Purchase Order deleted successfully'
        ]);
    }
}