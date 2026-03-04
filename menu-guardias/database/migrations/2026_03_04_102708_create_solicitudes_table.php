<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitudes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            $table->date('fecha_para_la_comida'); // Para los próximos 7 días 
            // Guardamos los IDs de los platos elegidos 
            $table->foreignId('primero_id')->constrained('platos');
            $table->foreignId('segundo_id')->constrained('platos');
            $table->foreignId('postre_id')->constrained('platos');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitudes');
    }
};
