<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuDiario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MenuDiarioController extends Controller
{
    // Listar menú de una fecha (por defecto hoy)
    public function index(Request $request)
    {
        $fecha = $request->query('fecha', date('Y-m-d'));
        
        $menu = MenuDiario::with('plato')
            ->where('fecha', $fecha)
            ->get();

        return response()->json([
            'success' => true, 
            'data' => $menu
        ]);
    }

    // Añadir plato al menú
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'plato_id' => 'required|exists:platos,id',
            'fecha' => 'required|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $item = MenuDiario::create($request->all());
            return response()->json([
                'success' => true, 
                'message' => 'Plato añadido al menú',
                'data' => $item->load('plato')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false, 
                'message' => 'El plato ya existe en esta fecha'
            ], 400);
        }
    }

    // Quitar plato del menú
    public function destroy($id)
    {
        $item = MenuDiario::find($id);
        if (!$item) return response()->json(['success' => false, 'message' => 'No encontrado'], 404);
        
        $item->delete();
        return response()->json(['success' => true, 'message' => 'Plato quitado del menú']);
    }
}