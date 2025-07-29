<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Requisition;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class RequisitionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $requisitions = Requisition::with(['user', 'purchaseOrders'])->get();
            return response()->json([
                'success' => true,
                'data' => $requisitions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch requisitions',
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
                'item' => 'required|string|max:255',
                'quantity' => 'required|integer|min:1',
                'status' => 'sometimes|in:Approved,Pending,Rejected',
                'requested_by' => 'required|exists:users,id',
                'date' => 'required|date'
            ]);

            $requisition = Requisition::create($validated);
            $requisition->load(['user', 'purchaseOrders']);

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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create requisition',
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
            $requisition = Requisition::with(['user', 'purchaseOrders'])->findOrFail($id);
            return response()->json([
                'success' => true,
                'data' => $requisition
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Requisition not found',
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
            $requisition = Requisition::findOrFail($id);
            
            $validated = $request->validate([
                'item' => 'sometimes|string|max:255',
                'quantity' => 'sometimes|integer|min:1',
                'status' => 'sometimes|in:Approved,Pending,Rejected',
                'requested_by' => 'sometimes|exists:users,id',
                'date' => 'sometimes|date'
            ]);

            $requisition->update($validated);
            $requisition->load(['user', 'purchaseOrders']);

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
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update requisition',
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
            $requisition = Requisition::findOrFail($id);
            $requisition->delete();

            return response()->json([
                'success' => true,
                'message' => 'Requisition deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete requisition',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
