<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('requisitions', function (Blueprint $table) {
            $table->id();
            $table->string('item');
            $table->integer('quantity');
            $table->enum('status', ['Approved', 'Pending', 'Rejected'])->default('Pending');
            $table->unsignedBigInteger('requested_by');
            $table->date('date');
            $table->timestamps();

            $table->foreign('requested_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('requisitions');
    }
};