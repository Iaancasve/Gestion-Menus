<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Plato;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class PlatoController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => Plato::all()]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:Primero,Segundo,Postre'
            
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $plato = Plato::create([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo
        ]);

        return response()->json(['success' => true, 'data' => $plato, 'message' => 'Plato creado'], 201);
    }

    public function update(Request $request, $id)
    {
        $plato = Plato::find($id);
        if (!$plato) return response()->json(['success' => false, 'message' => 'No encontrado'], 404);

        $plato->update([
            'nombre' => $request->nombre,
            'tipo' => $request->tipo
        ]);

        return response()->json(['success' => true, 'data' => $plato, 'message' => 'Plato actualizado']);
    }

    public function destroy($id)
    {
        $plato = Plato::find($id);
        if (!$plato) return response()->json(['success' => false, 'message' => 'No encontrado'], 404);
        $plato->delete();
        return response()->json(['success' => true, 'message' => 'Plato eliminado']);
    }
}