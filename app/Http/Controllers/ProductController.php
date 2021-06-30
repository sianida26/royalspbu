<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Carbon\Carbon;

class ProductController extends Controller
{
    //

    function getAllProducts(Request $request){
        return Product::all();
    }

    /**
     * Add Product
     * 
     * Menambahkan produk baru
     * 
     * @queryParam name string required Nama produk
     * @queryParam price integer required Harga produk per liter
     * @bodyParam name string
     * @bodyParam price integer
     */
    function addProduct(Request $request){
        $messages = [
            'required' => 'Harus diisi',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
        ];

        //Query parameters
        $request->validate([
            'name' => ['required'],
            'price' => ['required','integer','min:0'],
        ], $messages);

        $history = collect([
            [
                'timestamp' => Carbon::now(),
                'name' => $request->name,
                'price' => $request->price,
            ]
        ]);

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'history' => $history,
        ]);
        return ['name' => $product->name, 'price' => $product->price];
    }

    function editProduct(Request $request){

        $messages = [
            'required' => 'Harus diisi',
            'integer' => 'Harus berupa angka',
            'min' => 'Harus lebih dari :min',
        ];

        //Query parameters
        $request->validate([
            'id' => ['required', 'integer'],
            'name' => ['required'],
            'price' => ['required', 'integer', 'min:0']
        ], $messages);

        $product = Product::findOrFail($request->id);

        $product->name = $request->name;
        $product->price = $request->price;
        $product->history = $product->history->push([
            'timestamp' => Carbon::now(),
            'name' => $request->name,
            'price' => $request->price,
        ]);
        $product->save();
        return $product;
    }

    public function deleteProduct(Request $request){
        $product = Product::findOrFail($request->id);
        $product->delete();
        return [
            'name' => $product->name,
            'price' => $product->price,
            'message' => 'Produk berhasil dihapus',
        ];
    }
}
