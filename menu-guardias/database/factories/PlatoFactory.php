<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Plato>
 */
class PlatoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
        'nombre' => fake()->words(3, true), // Genera un nombre de plato (ej: "Arroz con verduras")
        'tipo' => fake()->randomElement(['primero', 'segundo', 'postre']), 
        'menu' => fake()->randomElement(['normal', 'vegano', 'bocadillo']), 
    ];
    }
}
