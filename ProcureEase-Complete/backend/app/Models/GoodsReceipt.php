<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GoodsReceipt extends Model
{
    protected $fillable = [
        'purchase_order_id',
        'item',
        'quantity_received',
        'received_date',
        'received_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'received_date' => 'date',
    ];

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
