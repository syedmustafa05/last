<?php

namespace Database\Seeders;

use App\Models\GoodsReceipt;
use App\Models\PurchaseOrder;
use App\Models\User;
use Illuminate\Database\Seeder;

class GoodsReceiptSeeder extends Seeder
{
    public function run(): void
    {
        $purchaseOrders = PurchaseOrder::where('status', '!=', 'Draft')->get();
        $users = User::all();

        GoodsReceipt::create([
            'purchase_order_id' => $purchaseOrders->first()->id,
            'item' => 'Laptop Computers',
            'quantity_received' => 8,
            'received_date' => now()->subDays(20),
            'received_by' => $users->first()->id,
            'status' => 'Partial',
            'notes' => '2 laptops still pending delivery',
        ]);

        GoodsReceipt::create([
            'purchase_order_id' => $purchaseOrders->get(1)->id,
            'item' => 'Office Chairs',
            'quantity_received' => 25,
            'received_date' => now()->subDays(5),
            'received_by' => $users->get(1)->id,
            'status' => 'Received',
            'notes' => 'All chairs received in good condition',
        ]);

        GoodsReceipt::create([
            'purchase_order_id' => $purchaseOrders->first()->id,
            'item' => 'Laptop Computers',
            'quantity_received' => 2,
            'received_date' => now()->subDays(2),
            'received_by' => $users->get(2)->id,
            'status' => 'Received',
            'notes' => 'Remaining laptops received',
        ]);
    }
}