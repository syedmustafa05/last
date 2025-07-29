<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Vendor;

class VendorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vendors = [
            [
                'name' => 'TechSupply Corp',
                'contact_person' => 'Robert Martinez',
                'email' => 'robert.martinez@techsupply.com',
                'phone' => '+1-555-0123',
                'address' => '123 Technology Ave, Silicon Valley, CA 94000',
                'status' => 'Active',
            ],
            [
                'name' => 'Office Solutions Ltd',
                'contact_person' => 'Jennifer Lee',
                'email' => 'jennifer.lee@officesolutions.com',
                'phone' => '+1-555-0456',
                'address' => '456 Business Park Dr, New York, NY 10001',
                'status' => 'Active',
            ],
            [
                'name' => 'Industrial Equipment Inc',
                'contact_person' => 'David Thompson',
                'email' => 'david.thompson@industrial-eq.com',
                'phone' => '+1-555-0789',
                'address' => '789 Industrial Blvd, Chicago, IL 60601',
                'status' => 'Active',
            ],
            [
                'name' => 'Global Supplies Co',
                'contact_person' => 'Maria Garcia',
                'email' => 'maria.garcia@globalsupplies.com',
                'phone' => '+1-555-0321',
                'address' => '321 Commerce St, Houston, TX 77001',
                'status' => 'Active',
            ],
            [
                'name' => 'Premium Parts LLC',
                'contact_person' => 'James Wilson',
                'email' => 'james.wilson@premiumparts.com',
                'phone' => '+1-555-0654',
                'address' => '654 Manufacturing Way, Detroit, MI 48201',
                'status' => 'Inactive',
            ]
        ];

        foreach ($vendors as $vendorData) {
            Vendor::create($vendorData);
        }
    }
}
