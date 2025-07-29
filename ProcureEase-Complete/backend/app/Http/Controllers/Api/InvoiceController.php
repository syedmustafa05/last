<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;

class InvoiceController extends Controller
{
    public function index(): JsonResponse
    {
        $invoices = Invoice::with(['purchaseOrder'])->get();
        return response()->json([
            'success' => true,
            'data' => $invoices
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_id' => 'required|exists:purchase_orders,id',
                'invoice_number' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'invoice_date' => 'required|date',
                'due_date' => 'required|date|after_or_equal:invoice_date',
                'status' => 'required|in:Draft,Sent,Paid,Overdue',
                'description' => 'nullable|string',
            ]);

            $invoice = Invoice::create($validated);
            $invoice->load(['purchaseOrder']);

            return response()->json([
                'success' => true,
                'message' => 'Invoice created successfully',
                'data' => $invoice
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function show(Invoice $invoice): JsonResponse
    {
        $invoice->load(['purchaseOrder']);
        return response()->json([
            'success' => true,
            'data' => $invoice
        ]);
    }

    public function update(Request $request, Invoice $invoice): JsonResponse
    {
        try {
            $validated = $request->validate([
                'purchase_order_id' => 'sometimes|required|exists:purchase_orders,id',
                'invoice_number' => 'sometimes|required|string|max:255',
                'amount' => 'sometimes|required|numeric|min:0',
                'invoice_date' => 'sometimes|required|date',
                'due_date' => 'sometimes|required|date|after_or_equal:invoice_date',
                'status' => 'sometimes|required|in:Draft,Sent,Paid,Overdue',
                'description' => 'nullable|string',
            ]);

            $invoice->update($validated);
            $invoice->load(['purchaseOrder']);

            return response()->json([
                'success' => true,
                'message' => 'Invoice updated successfully',
                'data' => $invoice
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy(Invoice $invoice): JsonResponse
    {
        $invoice->delete();
        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully'
        ]);
    }
}