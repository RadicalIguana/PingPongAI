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
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class UserFriendController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {

        $currentUserId = Auth::user()->id;

        $friend_id = DB::table('users')
            ->select('users.id', 'users.name', 'users.email', 'users_friends.friendship_status', 'users_friends.user_id')
            ->join('users_friends', function ($join) {
                $join->on('users.id', '=', 'users_friends.friend_id')
                    ->orOn('users.id', '=', 'users_friends.user_id');
            })
            ->where('users_friends.user_id', '=', $currentUserId)
            ->orWhere('users_friends.friend_id', '=', $currentUserId)
            ->get();

        return response()->json([
            'data' => $friend_id
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

        // $data = $users->get(0);
        // $friend_id = $data->id; 

        // $friends = DB::table('users_friends')
        //     ->where('user_id', '=', Auth::user()->id)
        //     ->where('friend_id', '=', $friend_id)
        //     ->orWhere('friend_id', '=', Auth::user()->id)
        //     ->where('user_id', '=', $friend_id)
        //     ->count();

        // if ($friends != 0) {
        //     $friendship = true;
        // } else {
        //     $friendship = false;
        // }
        
        // $users->put('friedship', $friendship);

        return response()->json([
            'data' => $users
        ], 200);
    }


    // Adding a friendship entry
    public function add(Request $request): Response
    {
        $id = $request['id'];

        $exist = DB::table('users_friends')
            ->where('user_id', '=', Auth::user()->id)
            ->where('friend_id', '=', $id)
            ->first();
        
        if ($exist != null) {
            return response('', 200);
        }

        DB::table('users_friends')->insert([
            'user_id' => Auth::user()->id,
            'friend_id' => $id,
            'friendship_status' => 0
        ]);
        
        return response('', 200);
    }

    // public function cancel(Request $request)
    // {
    //     $id = $request['id'];

    //     DB::table('users_friends')
    //         ->where('friend_id', $id)
    //         ->update(['friendship_status' => -1]);

    //     return response('', 200);
    // }

    // Updating friendship_status to 1 or -1.
    // Запрос на обновление статус отправляется со стороны приглашенного в друзья клиента.
    // 
    public function accept(Request $request): Response
    {
        $id = $request['id'];
        $status = 1;

        DB::table('users_friends')
            ->where('user_id', $id)
            ->where('friend_id', Auth::user()->id)
            ->update(['friendship_status' => $status]);

        return response('', 200);
    }

    public function denied(Request $request): Response
    {
        $id = $request['id'];

        DB::table('users_friends')
            ->where('user_id', '=', $id)
            ->where('friend_id', '=', Auth::user()->id)
            ->delete();

        return response('', 204);
    }

    public function check(Request $request): Response
    {
        $users = DB::table('users_friends')
            ->select('friend_id')
            ->where('friend_id', '=', Auth::user()->id)
            ->where('friendship_status', '=', 0)
            ->get();
        
        return response($users, 200);
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
