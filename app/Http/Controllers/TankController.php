<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Tank;

use Carbon\Carbon;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


use Debugbar;

class TankController extends Controller
{
    //

    public function getAllTanks(Request $request){

        if ($request->onlyName){
            return Tank::select('id','name')->get();
        }

        $tanks = Tank::all()->map(function($tank){
            return [
                'id' => $tank->id,
                'name' => $tank->name,
                'stock' => $tank->stock,
                'product' => $tank->product->name,
                'productId' => $tank->product->id,
            ];
        });

        $products = Product::select('id','name')->get();

        return [
            'tanks' => $tanks,
            'products' => $products,
        ];
    }

    public function addTank(Request $request){
        $messages = [
            'required' => 'Harus diisi',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
            'exists' => 'Produk tidak valid',
        ];

        //Query parameters
        $request->validate([
            'name' => ['required'],
            'product' => ['required','exists:products,id'],
            'stock' => ['required','integer','min:0'],
        ], $messages);

        //todo: test if product unavailable
        $product = Product::findOrFail($request->product);

        $history = collect(
            [
                [
                    'timestamp' => Carbon::today(),
                    'name' => $request->name,
                    'productId' => $product->id,
                ]
            ]
        );

        $tank = new Tank;
        $tank->name = $request->name;
        $tank->stock = $request->stock;
        $tank->history = $history;
        $tank->product()->associate($product);
        $tank->save();
        return ['name' => $product->name];
    }

    public function editTank(Request $request){

        $attribute = [
            'id' => 'tangki',
            'product' => 'produk',
        ];

        $messages = [
            'required' => 'Harus diisi',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
            'exists' => ':attribute tidak valid',
        ];

        //Query parameters
        $request->validate([
            'id' => ['required', 'exists:tanks,id'],
            'name' => ['required'],
            'product' => ['required','exists:products,id'],
            'stock' => ['required','integer','min:0'],
        ], $messages, $attribute);

        //todo: test if product unavailable
        $product = Product::find($request->product);
        $tank = Tank::findOrFail($request->id);

        if (($tank->name !== $request->name) || ($tank->product_id !== $request->product)){
            Debugbar::info('terpanggil');
            $newHistory = $tank->history->push([
                'timestamp' => Carbon::today(),
                'name' => $request->name,
                'productId' => $product->id,
            ]);
        }

        $tank->name = $request->name;
        $tank->stock = $request->stock;

        $newHistory = $tank->history;

        Debugbar::info($newHistory);
        $tank->history = $newHistory;
        $tank->product()->associate($product);
        $tank->save();
        return ['name' => $product->name];
    }

    public function delete(Request $request){
        $deleter = Auth::user();
        $tank = Tank::findOrFail($request->id);
        if (Hash::check($request->password, $deleter->password)){
            abort_unless($tank->nozzles->isEmpty(), 403, 'Anda harus menghapus atau mengalihkan semua nozzle yang berkaitan dengan tangki ini sebelum menghapus');
            $tank->delete();
            return [
                'name' => $tank->name,
                'message' => 'Tangki berhasil dihapus',
            ];
        } else {
            abort(422, 'Password salah');
        }
    }
}
