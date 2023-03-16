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
            ->select('users.id', 'users.name', 'users.email', 'users_friends.friendship_status')
            ->join('users', 'users_friends.friend_id', '=', 'users.id')
            ->where('user_id', '=', $currentUserId)
            ->get();

        return response()->json([
        'data' => $users
        ], 200);
    }

    public function find(Request $request): JsonResponse 
    {
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


    // Adding a friendship entry
    public function add(Request $request): Response
    {
        $id = $request['id'];

        DB::table('users_friends')->insert([
            'user_id' => Auth::user()->id,
            'friend_id' => $id,
            'friendship_status' => 0 // 0 -> Send, 1 -> Accept, -1 -> Denied
        ]);

        return response('', 204);
    }

    public function cancel(Request $request)
    {
        $id = $request['id'];

        DB::table('users_friends')
            ->where('friend_id', $id)
            ->update(['friendship_status' => -1]);

        return response('', 200);
    }

    // Updating friendship_status to 1 or -1.
    // Запрос на обновление статус отправляется со стороны приглашенного в друзья клиента.
    // 
    public function update(Request $request): Response
    {
        $id = $request['id'];
        $status = $request['status'];

        DB::table('users_friends')
            ->where('friend_id', Auth::user()->id)
            ->update(['friendship_status' => $status]);

        return response('', 200);
    }

    public function delete(Request $request) {
        $id = $request['id'];

        DB::table('users_friends')
            ->where('user_id', '=', Auth::user()->id)
            ->where('friend_id', '=', $id)
            ->delete();

        return response('', 204);
    }
}
