<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solicitud;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SolicitudController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha_para_la_comida' => 'required|date',
            'primero_id' => 'required|exists:platos,id',
            'segundo_id' => 'required|exists:platos,id',
            'postre_id' => 'required|exists:platos,id',
        ]);

        $solicitud = Solicitud::create([
            'user_id' => Auth::id(), // Obtiene el ID del usuario autenticado
            'fecha_para_la_comida' => $validated['fecha_para_la_comida'],
            'primero_id' => $validated['primero_id'],
            'segundo_id' => $validated['segundo_id'],
            'postre_id' => $validated['postre_id'],
        ]);

        return response()->json($solicitud, 201);
    }

    public function index()
    {
    // Obtenemos las solicitudes del usuario actual con sus platos relacionados
    return Solicitud::where('user_id', auth()->id())
        ->with(['primero', 'segundo', 'postre'])
        ->orderBy('fecha_para_la_comida', 'desc')
        ->get();
    }

    public function update(Request $request, $id)
    {
    $solicitud = Solicitud::where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    $validated = $request->validate([
        'primero_id' => 'required|exists:platos,id',
        'segundo_id' => 'required|exists:platos,id',
        'postre_id' => 'required|exists:platos,id',
    ]);

    $solicitud->update($validated);

    return response()->json($solicitud);
    }
    
    public function destroy($id)
{
    $solicitud = Solicitud::where('id', $id)
        ->where('user_id', auth()->id())
        ->firstOrFail();

    $solicitud->delete();

    return response()->json(['message' => 'Pedido cancelado correctamente'], 200);
}

public function pedidosHoy()
{
    try {
        return Solicitud::whereDate('fecha_para_la_comida', now()->toDateString())
            ->with(['user', 'primero', 'segundo', 'postre'])
            ->get();
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}
}