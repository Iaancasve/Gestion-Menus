<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\PlatoController;
use App\Http\Controllers\Api\MenuDiarioController;
use App\Http\Controllers\Api\SolicitudController;

// Ruta pública de login
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas por Sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/solicitudes', [SolicitudController::class, 'store']);
    
    // Solo accesible para usuarios con habilidad 'admin' 
    Route::middleware('ability:admin')->group(function () {
        Route::apiResource('usuarios', UserController::class);
        Route::apiResource('platos', PlatoController::class);
        
        // Rutas para el Menú Diario
        Route::get('menu-hoy', [MenuDiarioController::class, 'index']);
        Route::post('menu-hoy', [MenuDiarioController::class, 'store']);
        Route::delete('menu-hoy/{id}', [MenuDiarioController::class, 'destroy']);
    });
    
});