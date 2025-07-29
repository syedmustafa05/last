<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GoodsReceipt;
use App\Models\PurchaseOrder;

class GoodsReceiptSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $purchaseOrders = PurchaseOrder::whereIn('status', ['Issued', 'Completed'])->get();
        
        $goodsReceipts = [
            [
                'purchase_order_id' => $purchaseOrders[0]->id,
                'item' => 'Laptop Computers',
                'quantity_received' => 8,
                'received_date' => now()->subDays(8),
                'received_by' => 'John Smith',
                'status' => 'Partial',
                'notes' => 'First batch of laptops received, 2 more pending',
            ],
            [
                'purchase_order_id' => $purchaseOrders[1]->id,
                'item' => 'Printer Paper',
                'quantity_received' => 100,
                'received_date' => now()->subDays(3),
                'received_by' => 'Sarah Johnson',
                'status' => 'Received',
                'notes' => 'All paper boxes received in good condition',
            ]
        ];

        foreach ($goodsReceipts as $goodsReceiptData) {
            GoodsReceipt::create($goodsReceiptData);
        }
    }
}
