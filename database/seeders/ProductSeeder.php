<?php

namespace Database\Seeders;

use App\Models\Product;

use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $products = [
            [
                'name' => 'Pertalite',
                'price' => 7850,
                'penerimaanPrice' => 7536.7,
            ],
            [
                'name' => 'Pertamax',
                'price' => 9200,
                'penerimaanPrice' => 8784.57,
            ],
            [
                'name' => 'Dexlite',
                'price' => 9700,
                'penerimaanPrice' => 9335.64,
            ]
        ];

        collect($products)->map(function($product){

            $productModel = new Product;
            $productModel->name = $product['name'];
            $productModel->price = $product['price'];
            $productModel->penerimaan_price = $product['penerimaanPrice'];
            $productModel->recordedSave();
        });
    }
}
