<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\PurchaseOrder;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $purchaseOrders = PurchaseOrder::where('status', '!=', 'Draft')->get();

        Invoice::create([
            'purchase_order_id' => $purchaseOrders->first()->id,
            'invoice_number' => 'INV-2024-001',
            'amount' => 15000.00,
            'invoice_date' => now()->subDays(22),
            'due_date' => now()->addDays(8),
            'status' => 'Sent',
            'description' => 'Invoice for laptop computers order',
        ]);

        Invoice::create([
            'purchase_order_id' => $purchaseOrders->get(1)->id,
            'invoice_number' => 'INV-2024-002',
            'amount' => 8750.00,
            'invoice_date' => now()->subDays(5),
            'due_date' => now()->addDays(25),
            'status' => 'Paid',
            'description' => 'Invoice for office chairs order',
        ]);

        Invoice::create([
            'purchase_order_id' => $purchaseOrders->first()->id,
            'invoice_number' => 'INV-2024-003',
            'amount' => 12000.00,
            'invoice_date' => now()->subDays(1),
            'due_date' => now()->addDays(29),
            'status' => 'Draft',
            'description' => 'Invoice for additional laptops',
        ]);
    }
}