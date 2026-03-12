<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PlatoController;

// Ruta pública de login
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    
    // Solo accesible para usuarios con habilidad 'admin' 
    Route::middleware('ability:admin')->group(function () {
        Route::apiResource('usuarios', UserController::class);
        Route::apiResource('platos', PlatoController::class);
    });
    
});