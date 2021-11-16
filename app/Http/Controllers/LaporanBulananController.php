<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Pengeluaran;

use Carbon\Carbon;

use Illuminate\Http\Request;

use PDF;

class LaporanBulananController extends Controller
{
    //
    public function downloadStockReport(Request $request){

        //validate request
        // d = date in m-Y
        $this->validate($request, [
            'm' => 'required|date_format:m-Y'
        ]);

        $date = Carbon::createFromFormat('m-Y',$request->m);

        $products = collect(['Premium', 'Solar / Biosolar', 'Pertalite', 'Pertamax', 'Pertamax Turbo', 'Dexlite', 'Pertamina Dex']);

        //products as key
        $stocks = $products->mapWithKeys(function ($item) use ($date) {
            $productModel = Product::where('name', $item)->first();

            if($productModel === null){
                return [
                    $item => [
                        'initialStock' => '-',
                        'penerimaan' => '-',
                        'subtotal' => '-',
                        'penjualan' => '-',
                        'theoriticalStock' => '-',
                        'actualStock' => '-',
                        'diff' => '-'
                    ]
                ];
            } else {
                $initialStock = $productModel->getInitialStockOnBeginningOfMonth($date);
                $penerimaan = $productModel->getTotalPenerimaanOfMonth($date);
                $subtotal = $initialStock + $penerimaan;
                $penjualan = $productModel->getVolumeOutFromNozzlesOnMonth($date);
                $theoriticalStock = $subtotal - $penjualan;
                $actualStock = $productModel->getActualStockOnEndOfMonth($date);
                $diff = $theoriticalStock - $actualStock;

                return [
                    $item => [
                        'initialStock' => $initialStock,
                        'penerimaan' => $penerimaan,
                        'subtotal' => $subtotal,
                        'penjualan' => $penjualan,
                        'theoriticalStock' => $theoriticalStock,
                        'actualStock' => $actualStock,
                        'diff' => $diff,
                    ]
                ];
            }
        });

        $dataPerProduct = $products->mapWithKeys(function ($item) use ($date) {

            $productModel = Product::where('name', $item)->first();

            if ($productModel === null) {
                return [
                    $item => [
                        ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
                        ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
                        ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
                        ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
                    ]
                ];
            } else {

                $nozzleModels = $productModel->getNozzles(); //FIXME: Harusnya get nozzle on month
                $nozzlesData = $nozzleModels->map(function ($nozzle) use ($date) {

                    $awal = $nozzle->getTotalizatorOnBeginningOfMonth($date);
                    $akhir = $nozzle->getTotalizatorOnEndOfMonth($date);
                    $penjualan = 0;
                    if ($akhir - $awal < 0) {
                        $penjualan = $akhir + 100000 - $awal;
                    } else {
                        $penjualan = $akhir - $awal;
                    }

                    return [
                        'awal' => $awal,
                        'akhir' => $akhir,
                        'tera' => '',
                        'penjualan' => $penjualan,
                    ];
                });

                return [
                    $item => $nozzlesData,
                ];
            }
        });

        $pdf = PDF::loadView('PDF.stock',
            [
                'date' => $date,
                'stocks' => $stocks,
                'dataPerProduct' => $dataPerProduct,
            ]
        )
            ->setOption('dpi', 300)
            ->setOption('disable-smart-shrinking', true);
        return $pdf->inline('Laporan Stok.pdf');

    }

    public function downloadLRReport(Request $request){

        //validate request
        // d = date in m-Y
        $this->validate($request, [
            'm' => 'required|date_format:m-Y'
        ]);

        $date = Carbon::createFromFormat('m-Y',$request->m);
        $products = Product::getProductsOnDate($date);

        //PENJUALAN BBM
        $totalPenjualan = 0;
        $penjualanProducts = $products->mapWithKeys(function ($product) use ($date, &$totalPenjualan) {

            $volume = $product->getVolumeOutFromNozzlesOnMonth($date);
            $total = $product->price*$volume;
            $totalPenjualan += $total;
            return [
                $product->name => [
                    'rangetime' => '01/12/20; pk 08.00 s/d 31/12/20; pk 16.00',
                    'volume' => $volume,
                    'price' => $product->price,
                    'total' => $total,
                ]
            ];
        });

        $penjualan = [
            'products' => $penjualanProducts,
            'total' => $totalPenjualan,
        ];

        //HARGA POKOK PENJUALAN
        $totalHargaPokokPenjualan = 0;

        $productStokAwal = collect([]);
        $productPembelian = collect([]);
        $productStokAkhir = collect([]);
        $totalStokAwal = 0;
        $totalPembelian = 0;
        $totalStokAkhir = 0;
        foreach ($products as $product) {

            //Stok Awal
            $initialStock = $product->getInitialStockOnBeginningOfMonth($date);
            $totalStokAwalProduk = $product->price*$initialStock;
            $totalStokAwal += $totalStokAwalProduk;
            
            $productStokAwal->put($product->name, [
                'volume' => $initialStock,
                'price' => $product->price,
                'total' => $totalStokAwalProduk,
            ]);

            //Pembelian
            $pembelianVolume = $product->getTotalVolumePenerimaanPNBPOfMonth($date);
            $totalPembelianProduk = $product->penerimaan_price*$pembelianVolume;
            $totalPembelian += $totalPembelianProduk;

            $productPembelian->put($product->name, [
                'volume' => $pembelianVolume,
                'price' => $product->penerimaan_price,
                'total' => $totalPembelianProduk,
            ]);

            //Stok Akhir
            $stockAkhir = $product->getActualStockOnEndOfMonth($date);
            $totalStokAkhirProduk = $product->price*$stockAkhir;
            $totalStokAkhir += $totalStokAkhirProduk;

            $productStokAkhir->put($product->name, [
                'volume' => $stockAkhir,
                'price' => $product->price,
                'total' => $totalStokAkhirProduk,
            ]);
        }

        $totalHargaPokokPenjualan = $totalStokAwal + $totalPembelian - $totalStokAkhir;

        $hargaPokokPenjualan = [
            'stokAwal' => [
                'products' => $productStokAwal,
                'total' => $totalStokAwal,
            ],
            'pembelian' => [
                'products' => $productPembelian,
                'total' => $totalPembelian,
            ],
            'stokAkhir' => [
                'products' => $productStokAkhir,
                'total' => $totalStokAkhir,
            ],
            'total' => $totalHargaPokokPenjualan,
        ];

        //LABA KOTOR
        $labaKotor = $totalPenjualan - $totalHargaPokokPenjualan;

        //BIAYA DAN PENGELUARAN
        $pengeluarans = Pengeluaran::getPengeluaransOnMonth($date);
        $totalPengeluaran = 0;
        $biayas = $pengeluarans->groupBy(function($item){
                return $item->type->name;
            })
            ->sort()
            // ->values()
            ->map(function($pengeluaran, $pengeluaranName) use (&$totalPengeluaran){

                $total = $pengeluaran->reduce(function($carry, $item){
                    return $carry + $item->amount;
                });

                $totalPengeluaran += $total;

                return [
                    'name' => $pengeluaranName,
                    'price' => $total,
                ];
            });

        $biayaDanPengeluaran = [
            'biayas' => $biayas,
            'total' => $totalPengeluaran,
        ];

        //LABA
        $laba = $labaKotor - $totalPengeluaran;

        $pdf = PDF::loadView('PDF.labarugi', ['date' => $date, 'penjualan' => $penjualan, 'hargaPokokPenjualan' => $hargaPokokPenjualan, 'labaKotor' => $labaKotor, 'biayaDanPengeluaran' => $biayaDanPengeluaran, 'laba' => $laba])
            ->setOption('dpi', 300)
            ->setOption('disable-smart-shrinking', true);

        return $pdf->inline('LR '.$date->format('F Y').'.pdf');

    }
}
