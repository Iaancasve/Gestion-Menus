<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuDiario extends Model
{
    protected $table = 'menu_diario';
    protected $fillable = ['plato_id', 'fecha'];

    public function plato(): BelongsTo
    {
        return $this->belongsTo(Plato::class);
    }
}