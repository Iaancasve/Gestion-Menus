<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solicitud extends Model
{
    // Indica el nombre de la tabla si es distinto al plural en inglés
    protected $table = 'solicitudes';

    // Estos campos son obligatorios para que el controlador pueda guardar
    protected $fillable = [
        'user_id',
        'fecha_para_la_comida',
        'primero_id',
        'segundo_id',
        'postre_id',
    ];
}