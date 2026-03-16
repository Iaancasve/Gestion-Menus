<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuDiario;
use App\Models\Plato; 
use Illuminate\Http\Request;

class MenuDiarioController extends Controller 
{
    public function index(Request $request)
    {
        // Capturamos la fecha de la URL o usamos la de hoy
        $fecha = $request->query('fecha', date('Y-m-d'));

        // Cargamos los registros con su plato asociado
        $menu = MenuDiario::with('plato')
                ->where('fecha', $fecha)
                ->get();

        return response()->json([
            'success' => true,
            'data' => $menu
        ]);
    }

    public function store(Request $request)
    {
        // Validamos que el plato exista
        $request->validate([
            'plato_id' => 'required|exists:platos,id',
            'fecha' => 'required|date'
        ]);

        $item = MenuDiario::create($request->all());
        
        return response()->json([
            'success' => true, 
            'data' => $item->load('plato')
        ]);
    }

    public function destroy($id)
    {
        $item = MenuDiario::find($id);
        if ($item) {
            $item->delete();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false], 404);
    }
}