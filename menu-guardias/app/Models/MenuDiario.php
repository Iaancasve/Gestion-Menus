<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MenuDiario extends Model
{
    // Obligatorio: Tu tabla se llama 'menu_diario' (en singular)
    protected $table = 'menu_diario'; 

    protected $fillable = ['plato_id', 'fecha'];

    
    public function plato(): BelongsTo
    {
        // Indicamos que plato_id es la clave ajena
        return $this->belongsTo(Plato::class, 'plato_id');
    }
}