<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class PurchaseOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $purchaseOrders = PurchaseOrder::with(['requisition', 'vendor', 'goodsReceipts', 'invoices'])->get();
            return response()->json([
                'success' => true,
                'data' => $purchaseOrders
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch purchase orders',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'requisition_id' => 'required|exists:requisitions,id',
                'vendor_id' => 'required|exists:vendors,id',
                'total_amount' => 'required|numeric|min:0',
                'status' => 'sometimes|in:Draft,Issued,Completed,Cancelled',
                'order_date' => 'required|date',
                'notes' => 'nullable|string'
            ]);

            $purchaseOrder = PurchaseOrder::create($validated);
            $purchaseOrder->load(['requisition', 'vendor', 'goodsReceipts', 'invoices']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order created successfully',
                'data' => $purchaseOrder
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $purchaseOrder = PurchaseOrder::with(['requisition', 'vendor', 'goodsReceipts', 'invoices'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $purchaseOrder
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Purchase order not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            
            $validated = $request->validate([
                'requisition_id' => 'sometimes|exists:requisitions,id',
                'vendor_id' => 'sometimes|exists:vendors,id',
                'total_amount' => 'sometimes|numeric|min:0',
                'status' => 'sometimes|in:Draft,Issued,Completed,Cancelled',
                'order_date' => 'sometimes|date',
                'notes' => 'nullable|string'
            ]);

            $purchaseOrder->update($validated);
            $purchaseOrder->load(['requisition', 'vendor', 'goodsReceipts', 'invoices']);

            return response()->json([
                'success' => true,
                'message' => 'Purchase order updated successfully',
                'data' => $purchaseOrder
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $purchaseOrder = PurchaseOrder::findOrFail($id);
            $purchaseOrder->delete();

            return response()->json([
                'success' => true,
                'message' => 'Purchase order deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete purchase order',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
