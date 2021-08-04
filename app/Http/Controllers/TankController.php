<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

use App\Models\Tank;
use App\Models\Product;

use Debugbar;

class TankController extends Controller
{
    //

    public function getAllTanks(Request $request){

        if ($request->onlyName){
            return Tank::select('id','name')->get();
        }
        else return Tank::all()->map(function($tank){
            return [
                'id' => $tank->id,
                'name' => $tank->name,
                'stock' => $tank->stock,
                'product' => $tank->product->name,
                'productId' => $tank->product->id,
            ];
        });
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
            'productId' => ['required','exists:products,id'],
            'stock' => ['required','integer','min:0'],
        ], $messages);

        //todo: test if product unavailable
        $product = Product::find($request->productId);

        $history = collect(
            [
                [
                    'timestamp' => Carbon::today(),
                    'name' => $request->name,
                    'productId' => $request->productId,
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
            'productId' => 'produk',
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
            'productId' => ['required','exists:products,id'],
            'stock' => ['required','integer','min:0'],
        ], $messages, $attribute);

        //todo: test if product unavailable
        $product = Product::find($request->productId);
        $tank = Tank::findOrFail($request->id);

        if (($tank->name !== $request->name) || ($tank->product_id !== $request->productId)){
            Debugbar::info('terpanggil');
            $newHistory = $tank->history->push([
                'timestamp' => Carbon::today(),
                'name' => $request->name,
                'productId' => $request->productId,
            ]);
        }

        $tank->name = $request->name;
        $tank->stock = $request->stock;

        $newHistory = $tank->history;

        Debugbar::info($newHistory);
        $tank->history = $newHistory;
        $tank->save();
        $tank->product()->associate($product);
        return ['name' => $product->name];
    }

    public function delete(Request $request){
        $tank = Tank::findOrFail($request->id);
        abort_unless($tank->nozzles->isEmpty(), 403, 'Anda harus menghapus atau mengalihkan semua nozzle yang berkaitan dengan tangki ini sebelum menghapus');
        $tank->delete();
        return [
            'name' => $tank->name,
            'message' => 'Tangki berhasil dihapus',
        ];
    }
}
