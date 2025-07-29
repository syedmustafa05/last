<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\GoodsReceipt;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class GoodsReceiptController extends Controller
{
    public function index(): JsonResponse
    {
        $goodsReceipts = GoodsReceipt::with(['purchaseOrder', 'receivedBy'])->get();
        return response()->json([
            'success' => true,
            'data' => $goodsReceipts
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_id' => 'required|exists:purchase_orders,id',
                'item' => 'required|string|max:255',
                'quantity_received' => 'required|integer|min:1',
                'received_date' => 'required|date',
                'received_by' => 'required|exists:users,id',
                'status' => 'required|in:Received,Partial,Pending',
                'notes' => 'nullable|string',
            ]);

            $goodsReceipt = GoodsReceipt::create($validated);
            $goodsReceipt->load(['purchaseOrder', 'receivedBy']);

            return response()->json([
                'success' => true,
                'message' => 'Goods Receipt created successfully',
                'data' => $goodsReceipt
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(GoodsReceipt $goodsReceipt): JsonResponse
    {
        $goodsReceipt->load(['purchaseOrder', 'receivedBy']);
        return response()->json([
            'success' => true,
            'data' => $goodsReceipt
        ]);
    }

    public function update(Request $request, GoodsReceipt $goodsReceipt): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_id' => 'sometimes|required|exists:purchase_orders,id',
                'item' => 'sometimes|required|string|max:255',
                'quantity_received' => 'sometimes|required|integer|min:1',
                'received_date' => 'sometimes|required|date',
                'received_by' => 'sometimes|required|exists:users,id',
                'status' => 'sometimes|required|in:Received,Partial,Pending',
                'notes' => 'nullable|string',
            ]);

            $goodsReceipt->update($validated);
            $goodsReceipt->load(['purchaseOrder', 'receivedBy']);

            return response()->json([
                'success' => true,
                'message' => 'Goods Receipt updated successfully',
                'data' => $goodsReceipt
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(GoodsReceipt $goodsReceipt): JsonResponse
    {
        $goodsReceipt->delete();
        return response()->json([
            'success' => true,
            'message' => 'Goods Receipt deleted successfully'
        ]);
    }
}