<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        //Primero los servicios (porque los usuarios los necesitan)
        $this->call(ServicioSeeder::class);

        //Luego los platos
        $this->call(PlatoSeeder::class);

        //Por último los usuarios (que se vinculan a los servicios creados)
        $this->call(UserSeeder::class);
    }
}
