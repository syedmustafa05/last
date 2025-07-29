<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Invoice;
use App\Models\PurchaseOrder;

class InvoiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchaseOrders = PurchaseOrder::whereIn('status', ['Issued', 'Completed'])->get();
        
        $invoices = [
            [
                'purchase_order_id' => $purchaseOrders[0]->id,
                'invoice_number' => 'INV-2024-001',
                'amount' => 12000.00,
                'invoice_date' => now()->subDays(7),
                'due_date' => now()->addDays(23),
                'status' => 'Sent',
                'description' => 'Payment for 8 laptop computers delivered',
            ],
            [
                'purchase_order_id' => $purchaseOrders[1]->id,
                'invoice_number' => 'INV-2024-002',
                'amount' => 2500.00,
                'invoice_date' => now()->subDays(2),
                'due_date' => now()->addDays(28),
                'status' => 'Paid',
                'description' => 'Office paper supplies - bulk order',
            ]
        ];

        foreach ($invoices as $invoiceData) {
            Invoice::create($invoiceData);
        }
    }
}
