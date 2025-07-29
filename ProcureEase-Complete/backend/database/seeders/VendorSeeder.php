<?php

namespace Database\Seeders;

use App\Models\Vendor;
use Illuminate\Database\Seeder;

class VendorSeeder extends Seeder
{
    public function run(): void
    {
        Vendor::create([
            'name' => 'Tech Supplies Co.',
            'contact_person' => 'Sarah Wilson',
            'email' => 'sarah@techsupplies.com',
            'phone' => '+1-555-0101',
            'address' => '123 Tech Street, Silicon Valley, CA 94025',
            'status' => 'Active',
        ]);

        Vendor::create([
            'name' => 'Office Solutions Ltd.',
            'contact_person' => 'David Brown',
            'email' => 'david@officesolutions.com',
            'phone' => '+1-555-0102',
            'address' => '456 Business Ave, New York, NY 10001',
            'status' => 'Active',
        ]);

        Vendor::create([
            'name' => 'Global Equipment Inc.',
            'contact_person' => 'Lisa Chen',
            'email' => 'lisa@globalequipment.com',
            'phone' => '+1-555-0103',
            'address' => '789 Industrial Blvd, Chicago, IL 60601',
            'status' => 'Active',
        ]);

        Vendor::create([
            'name' => 'Quality Materials Corp.',
            'contact_person' => 'Robert Taylor',
            'email' => 'robert@qualitymaterials.com',
            'phone' => '+1-555-0104',
            'address' => '321 Quality Lane, Houston, TX 77001',
            'status' => 'Inactive',
        ]);
    }
}