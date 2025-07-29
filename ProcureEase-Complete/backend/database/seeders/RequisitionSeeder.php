<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Requisition;
use App\Models\User;

class RequisitionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $userIds = User::pluck('id')->toArray();
        
        $requisitions = [
            [
                'item' => 'Laptop Computers',
                'quantity' => 10,
                'status' => 'Approved',
                'requested_by' => $userIds[0],
                'date' => now()->subDays(15),
            ],
            [
                'item' => 'Office Chairs',
                'quantity' => 25,
                'status' => 'Pending',
                'requested_by' => $userIds[1],
                'date' => now()->subDays(10),
            ],
            [
                'item' => 'Printer Paper',
                'quantity' => 100,
                'status' => 'Approved',
                'requested_by' => $userIds[2],
                'date' => now()->subDays(8),
            ],
            [
                'item' => 'Network Switches',
                'quantity' => 5,
                'status' => 'Rejected',
                'requested_by' => $userIds[3],
                'date' => now()->subDays(12),
            ],
            [
                'item' => 'Desk Monitors',
                'quantity' => 15,
                'status' => 'Approved',
                'requested_by' => $userIds[4],
                'date' => now()->subDays(6),
            ],
            [
                'item' => 'USB Cables',
                'quantity' => 50,
                'status' => 'Pending',
                'requested_by' => $userIds[0],
                'date' => now()->subDays(3),
            ]
        ];

        foreach ($requisitions as $requisitionData) {
            Requisition::create($requisitionData);
        }
    }
}
