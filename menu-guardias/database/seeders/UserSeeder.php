<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
{
    // Creamos un Administrador
    \App\Models\User::create([
        'name' => 'Admin Guardias',
        'email' => 'admin@test.com',
        'password' => bcrypt('admin123'),
        'servicio_id' => 1, // Se vincula al primer servicio 
        'es_admin' => true,  // Tiene permisos para modificar menús 
    ]);

    // Creamos un Usuario normal
    \App\Models\User::create([
        'name' => 'Juan Empleado',
        'email' => 'user@test.com',
        'password' => bcrypt('user123'),
        'servicio_id' => 1,
        'es_admin' => false, // Solo puede solicitar, no modificar 
    ]);
}
}
