<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RequisitionController extends Controller
{
    public function index(): JsonResponse
    {
        $requisitions = Requisition::with(['requestedBy'])->get();
        return response()->json([
            'success' => true,
            'data' => $requisitions
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'item' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'status' => 'required|in:Approved,Pending,Rejected',
                'requested_by' => 'required|exists:users,id',
                'date' => 'required|date',
            ]);

            $requisition = Requisition::create($validated);
            $requisition->load('requestedBy');

            return response()->json([
                'success' => true,
                'message' => 'Requisition created successfully',
                'data' => $requisition
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(Requisition $requisition): JsonResponse
    {
        $requisition->load(['requestedBy', 'purchaseOrders']);
        return response()->json([
            'success' => true,
            'data' => $requisition
        ]);
    }

    public function update(Request $request, Requisition $requisition): JsonResponse
    {
        try {
            $validated = $request->validate([
                'item' => 'sometimes|required|string|max:255',
                'quantity' => 'sometimes|required|integer|min:1',
                'status' => 'sometimes|required|in:Approved,Pending,Rejected',
                'requested_by' => 'sometimes|required|exists:users,id',
                'date' => 'sometimes|required|date',
            ]);

            $requisition->update($validated);
            $requisition->load('requestedBy');

            return response()->json([
                'success' => true,
                'message' => 'Requisition updated successfully',
                'data' => $requisition
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(Requisition $requisition): JsonResponse
    {
        $requisition->delete();
        return response()->json([
            'success' => true,
            'message' => 'Requisition deleted successfully'
        ]);
    }
}