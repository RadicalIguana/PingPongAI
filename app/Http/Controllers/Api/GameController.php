<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return response('Index works!', 200);
    }

    public function storeResult(Request $request): Response
    {
        $winner = $request['winner'];
        $loser = $request['loser'];
        $game_result = $request['game_result'];

        DB::table('games')->insert([
            'winner_id' => $winner,
            'loser_id' => $loser,
            'game_result' => $game_result
        ]);

        return response('Result added', 200);
    }

    public function storeResult(Request $request): JsonResponse
    {
        $id = $request['id'];

        $results = DB::table('users');

        return response()->json([
            'data' => ''
        ], 200);
    }

    public function winners(Request $request): JsonResponse
    {
        $id = $request['id'];

        $winners = DB::table('users')
            ->select('users.name')
            ->join('games', 'users.id', '=', 'games.winner_id')
            ->where('winner_id', '=', $id)
            ->get();

        return response()->json([
            'data' => $winners
        ], 200);
    }

    public function losers(Request $request): JsonResponse
    {
        $id = $request['id'];

        $losers = DB::table('games')
            ->select('users.name')
            ->join('users', 'users.id', '=', 'games.loser_id')
            ->where('loser_id', '=', $id)
            ->get();

        return response()->json([
            'data' => $losers
        ], 200);
    }

    public function scores(Request $request): JsonResponse
    {
        $id = $request['id'];

        $scores = DB::table('games')
            ->select('game_result')
            ->where('winner_id', '=', $id)
            ->orWhere('loser_id', '=', $id)
            ->get();

        return response()->json([
            'data' => $scores
        ], 200);
    }

}