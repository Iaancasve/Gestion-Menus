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
    Schema::create('menu_diario', function (Blueprint $table) {
        $table->id();
        $table->foreignId('plato_id')->constrained('platos')->onDelete('cascade');
        $table->date('fecha');
        $table->timestamps();
        
        // Un plato no puede estar dos veces el mismo día
        $table->unique(['plato_id', 'fecha']);
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_diario');
    }
};
