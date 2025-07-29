<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class GoodsReceiptController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $goodsReceipts = GoodsReceipt::with(['purchaseOrder'])->get();
            return response()->json([
                'success' => true,
                'data' => $goodsReceipts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch goods receipts',
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
                'purchase_order_id' => 'required|exists:purchase_orders,id',
                'item' => 'required|string|max:255',
                'quantity_received' => 'required|integer|min:1',
                'received_date' => 'required|date',
                'received_by' => 'required|string|max:255',
                'status' => 'sometimes|in:Received,Partial,Pending',
                'notes' => 'nullable|string'
            ]);

            $goodsReceipt = GoodsReceipt::create($validated);
            $goodsReceipt->load(['purchaseOrder']);

            return response()->json([
                'success' => true,
                'message' => 'Goods receipt created successfully',
                'data' => $goodsReceipt
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
                'message' => 'Failed to create goods receipt',
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
            $goodsReceipt = GoodsReceipt::with(['purchaseOrder'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $goodsReceipt
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Goods receipt not found',
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
            $goodsReceipt = GoodsReceipt::findOrFail($id);
            
            $validated = $request->validate([
                'purchase_order_id' => 'sometimes|exists:purchase_orders,id',
                'item' => 'sometimes|string|max:255',
                'quantity_received' => 'sometimes|integer|min:1',
                'received_date' => 'sometimes|date',
                'received_by' => 'sometimes|string|max:255',
                'status' => 'sometimes|in:Received,Partial,Pending',
                'notes' => 'nullable|string'
            ]);

            $goodsReceipt->update($validated);
            $goodsReceipt->load(['purchaseOrder']);

            return response()->json([
                'success' => true,
                'message' => 'Goods receipt updated successfully',
                'data' => $goodsReceipt
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
                'message' => 'Failed to update goods receipt',
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
            $goodsReceipt = GoodsReceipt::findOrFail($id);
            $goodsReceipt->delete();

            return response()->json([
                'success' => true,
                'message' => 'Goods receipt deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete goods receipt',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
