<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Ruta pública
Route::post('/login', [AuthController::class, 'login']);

// Grupo de rutas protegidas por Token 
Route::middleware('auth:sanctum')->group(function () {
    
    Route::middleware('ability:admin')->group(function () {
        Route::apiResource('usuarios', UserController::class);
    });
    
});