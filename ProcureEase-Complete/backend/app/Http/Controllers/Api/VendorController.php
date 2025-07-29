<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class VendorController extends Controller
{
    public function index(): JsonResponse
    {
        $vendors = Vendor::all();
        return response()->json([
            'success' => true,
            'data' => $vendors
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'contact_person' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'address' => 'required|string',
                'status' => 'required|in:Active,Inactive',
            ]);

            $vendor = Vendor::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Vendor created successfully',
                'data' => $vendor
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(Vendor $vendor): JsonResponse
    {
        $vendor->load('purchaseOrders');
        return response()->json([
            'success' => true,
            'data' => $vendor
        ]);
    }

    public function update(Request $request, Vendor $vendor): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'contact_person' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255',
                'phone' => 'sometimes|required|string|max:20',
                'address' => 'sometimes|required|string',
                'status' => 'sometimes|required|in:Active,Inactive',
            ]);

            $vendor->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Vendor updated successfully',
                'data' => $vendor
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(Vendor $vendor): JsonResponse
    {
        $vendor->delete();
        return response()->json([
            'success' => true,
            'message' => 'Vendor deleted successfully'
        ]);
    }
}