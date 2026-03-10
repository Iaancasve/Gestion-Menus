<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // 1. LISTAR TODOS LOS USUARIOS (GET /api/usuarios)
    public function index()
    {
        $users = User::with('servicio')->get(); // Traemos también los datos de su servicio
        return response()->json(['success' => true, 'data' => $users]);
    }

    // 2. CREAR USUARIO (POST /api/usuarios)
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
            'servicio_id' => 'required|exists:servicios,id',
            'es_admin' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'servicio_id' => $request->servicio_id,
            'es_admin' => $request->es_admin,
        ]);

        return response()->json(['success' => true, 'data' => $user, 'message' => 'Creado con éxito'], 201);
    }

    // 3. VER UN USUARIO (GET /api/usuarios/{id})
    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Usuario no encontrado'], 404);
        }
        return response()->json(['success' => true, 'data' => $user]);
    }

    // 4. ACTUALIZAR USUARIO (PUT /api/usuarios/{id})
    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['success' => false, 'message' => 'No encontrado'], 404);

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'email' => 'email|unique:users,email,' . $id,
            'servicio_id' => 'exists:servicios,id',
            'es_admin' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $user->update($request->only(['name', 'email', 'servicio_id', 'es_admin']));
        
        if ($request->password) {
            $user->password = Hash::make($request->password);
            $user->save();
        }

        return response()->json(['success' => true, 'data' => $user, 'message' => 'Actualizado']);
    }

    // 5. BORRAR USUARIO (DELETE /api/usuarios/{id})
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) return response()->json(['success' => false, 'message' => 'No encontrado'], 404);

        $user->delete();
        return response()->json(['success' => true, 'message' => 'Usuario eliminado correctamente']);
    }
}