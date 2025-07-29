<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\PurchaseOrder;
use App\Models\Requisition;
use App\Models\Vendor;

class PurchaseOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $approvedRequisitions = Requisition::where('status', 'Approved')->get();
        $vendorIds = Vendor::where('status', 'Active')->pluck('id')->toArray();
        
        $purchaseOrders = [
            [
                'requisition_id' => $approvedRequisitions[0]->id,
                'vendor_id' => $vendorIds[0],
                'total_amount' => 15000.00,
                'status' => 'Issued',
                'order_date' => now()->subDays(12),
                'notes' => 'High-performance laptops for development team',
            ],
            [
                'requisition_id' => $approvedRequisitions[1]->id,
                'vendor_id' => $vendorIds[1],
                'total_amount' => 2500.00,
                'status' => 'Completed',
                'order_date' => now()->subDays(5),
                'notes' => 'A4 paper for office printers - bulk order',
            ],
            [
                'requisition_id' => $approvedRequisitions[2]->id,
                'vendor_id' => $vendorIds[0],
                'total_amount' => 4500.00,
                'status' => 'Draft',
                'order_date' => now()->subDays(2),
                'notes' => '24-inch monitors for workstations',
            ]
        ];

        foreach ($purchaseOrders as $purchaseOrderData) {
            PurchaseOrder::create($purchaseOrderData);
        }
    }
}
