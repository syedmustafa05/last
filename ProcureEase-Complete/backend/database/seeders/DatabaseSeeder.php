<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            VendorSeeder::class,
            RequisitionSeeder::class,
            PurchaseOrderSeeder::class,
            GoodsReceiptSeeder::class,
            InvoiceSeeder::class,
        ]);
    }
}