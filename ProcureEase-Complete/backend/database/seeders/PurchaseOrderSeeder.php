<?php

namespace Database\Seeders;

use App\Models\PurchaseOrder;
use App\Models\Requisition;
use App\Models\Vendor;
use Illuminate\Database\Seeder;

class PurchaseOrderSeeder extends Seeder
{
    public function run(): void
    {
        $requisitions = Requisition::where('status', 'Approved')->get();
        $vendors = Vendor::where('status', 'Active')->get();

        PurchaseOrder::create([
            'requisition_id' => $requisitions->first()->id,
            'vendor_id' => $vendors->first()->id,
            'total_amount' => 15000.00,
            'status' => 'Issued',
            'order_date' => now()->subDays(25),
            'notes' => 'High priority order for IT department',
        ]);

        PurchaseOrder::create([
            'requisition_id' => $requisitions->get(1)->id,
            'vendor_id' => $vendors->get(1)->id,
            'total_amount' => 8750.00,
            'status' => 'Completed',
            'order_date' => now()->subDays(8),
            'notes' => 'Standard office equipment order',
        ]);

        PurchaseOrder::create([
            'requisition_id' => $requisitions->first()->id,
            'vendor_id' => $vendors->get(2)->id,
            'total_amount' => 12000.00,
            'status' => 'Draft',
            'order_date' => now()->subDays(3),
            'notes' => 'Additional laptops for new employees',
        ]);
    }
}