<?php

namespace Database\Seeders;

use App\Models\Requisition;
use App\Models\User;
use Illuminate\Database\Seeder;

class RequisitionSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();

        Requisition::create([
            'item' => 'Laptop Computers',
            'quantity' => 10,
            'status' => 'Approved',
            'requested_by' => $users->first()->id,
            'date' => now()->subDays(30),
        ]);

        Requisition::create([
            'item' => 'Office Chairs',
            'quantity' => 25,
            'status' => 'Pending',
            'requested_by' => $users->get(1)->id,
            'date' => now()->subDays(15),
        ]);

        Requisition::create([
            'item' => 'Printers',
            'quantity' => 5,
            'status' => 'Approved',
            'requested_by' => $users->get(2)->id,
            'date' => now()->subDays(10),
        ]);

        Requisition::create([
            'item' => 'Desk Supplies',
            'quantity' => 100,
            'status' => 'Rejected',
            'requested_by' => $users->first()->id,
            'date' => now()->subDays(5),
        ]);

        Requisition::create([
            'item' => 'Network Equipment',
            'quantity' => 8,
            'status' => 'Pending',
            'requested_by' => $users->get(1)->id,
            'date' => now()->subDays(2),
        ]);
    }
}