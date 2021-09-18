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
            ],
            [
                'name' => 'Pertamax',
                'price' => 9200,
            ],
            [
                'name' => 'Dexlite',
                'price' => 9700,
            ]
        ];

        collect($products)->map(function($product){

            $productModel = new Product;
            $productModel->name = $product['name'];
            $productModel->price = $product['price'];
            $productModel->recordedSave();
        });
    }
}
