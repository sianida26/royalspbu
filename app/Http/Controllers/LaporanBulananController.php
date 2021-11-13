<?php

namespace App\Http\Controllers;

use App\Models\Product;

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

                $nozzleModels = $productModel->getNozzles();
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
            // ->setOrientation('landscape')
            // ->setOption('header-html', $header)
            // ->setOption('margin-top', 0);
        return $pdf->inline('Laporan Stok.pdf');

    }
}
