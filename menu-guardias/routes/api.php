<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

// Ruta pública
Route::post('/login', [AuthController::class, 'login']);

// Grupo de rutas protegidas por Token 
Route::middleware('auth:sanctum')->group(function () {
    
    
    
});