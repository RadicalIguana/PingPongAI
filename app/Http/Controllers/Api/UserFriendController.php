<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserFriendController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {

        $currentUserId = Auth::user()->id;

        $users = DB::table('users_friends')
            ->select('users.id', 'users.name', 'users.email')
            ->join('users', 'users_friends.friend_id', '=', 'users.id')
            ->where('user_id', '=', $currentUserId)
            ->get();

        return response()->json([
            'data' => $users,
        ], 200);
    }

    public function find(Request $request) {
        $username = $request->validate([
            'username' => 'required|exists:users,name'
        ]);

        $foundUser = $username['username'];

        $users = DB::table('users')
            ->select('users.id', 'users.name', 'users.email')
            ->where('users.name', 'like', $foundUser)
            ->get();

        return response()->json([
            'data' => $users
        ], 200);
    }

    public function add(Request $request) {
        $id = $request['id'];

        DB::table('users_friends')->insert([
            'user_id' => Auth::user()->id,
            'friend_id' => $id,
        ]);
        DB::table('users_friends')->insert([
            'user_id' => $id,
            'friend_id' => Auth::user()->id,
        ]);

        return response('', 204);
    }

    public function delete(Request $request) {
        $id = $request['id'];

        DB::table('users_friends')
            ->where('user_id', '=', Auth::user()->id)
            ->where('friend_id', '=', $id)
            ->delete();

        DB::table('users_friends')
            ->where('user_id', '=', $id)
            ->where('friend_id', '=', Auth::user()->id)
            ->delete();

        return response('', 204);
    }
}
