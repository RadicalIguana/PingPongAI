<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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

}
