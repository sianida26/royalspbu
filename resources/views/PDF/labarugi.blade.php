<?php

    //an array with var name hargaPokokPenjualan
    // $hargaPokokPenjualan = [
    //     //item key is 'stokAwal'
    //     'stokAwal' => [
    //         'products' => [
    //             'Pertalite' => [
    //                 'volume' => 4882,
    //                 'price' => 7850,
    //                 'total' => 38323700,
    //             ],
    //             'Pertamax' => [
    //                 'volume' => 763,
    //                 'price' => 9200,
    //                 'total' => 7019600,
    //             ],
    //             'Dexlite' => [
    //                 'volume' => 7397,
    //                 'price' => 9700,
    //                 'total' => 71750900,
    //             ],
    //         ],
    //         'total' => 117094200,
    //     ],
    //     'pembelian' => [
    //         'products' => [
    //             'Pertalite' => [
    //                 'volume' => 208000,
    //                 'price' => 7536.7,
    //                 'total' => 1567633600,
    //             ],
    //             'Pertamax' => [
    //                 'volume' => 56000,
    //                 'price' => 8784.57,
    //                 'total' => 491935920,
    //             ],
    //             'Dexlite' => [
    //                 'volume' => 8000,
    //                 'price' => 9335.64,
    //                 'total' => 74685120,
    //             ],
    //         ],
    //         'total' => 2134254640,
    //     ],
    //     'stokAkhir' => [
    //         'products' => [
    //             'Pertalite' => [
    //                 'volume' => 1041,
    //                 'price' => 7850,
    //                 'total' => 8171850,
    //             ],
    //             'Pertamax' => [
    //                 'volume' => 2712,
    //                 'price' => 9200,
    //                 'total' => 24950400,
    //             ],
    //             'Dexlite' => [
    //                 'volume' => 1832,
    //                 'price' => 9700,
    //                 'total' => 17770400,
    //             ],
    //         ],
    //         'total' => 50892650,
    //     ],
    //     'total' => 2200456190
    // ];

    // $labaKotor = 79688210;

    // $biayaDanPengeluaran = [
    //     'biayas' => [
    //         [
    //             'name' => 'Biaya Belanja Harian',
    //             'price' => 3200000,
    //         ], 
    //         [
    //             'name' => 'Biaya Listrik dan Air',
    //             'price' => 5200000,
    //         ], 
    //         [
    //             'name' => 'Biaya Akomodasi Supir Tangki',
    //             'price' => 3200000,
    //         ], 
    //         [
    //             'name' => 'Perawatan Mobil dan Motor Oprasional',
    //             'price' => 315000,
    //         ], 
    //         [
    //             'name' => 'Gaji Karyawan',
    //             'price' => 17500000,
    //         ], 
    //         [
    //             'name' => 'Bensin Oprasional',
    //             'price' => 2830304,
    //         ],
    //         [
    //             'name' => 'Biaya Perawatan, Peralatan dan Perlengkapan Genset',
    //             'price' => 898000,
    //         ], 
    //         [
    //             'name' => 'Lain-Lain',
    //             'price' => 1415000,
    //         ], 
    //         [
    //             'name' => 'Sumbangan',
    //             'price' => 2714000,
    //         ], 
    //         [
    //             'name' => 'akomodasi bensin operator',
    //             'price' => 588500,
    //         ], 
    //         [
    //             'name' => 'Tunjangan Hari Raya',
    //             'price' => 8500000,
    //         ], 
            
    //         [
    //             'name' => 'Parsel Lebaran',
    //             'price' => 1916000,
    //         ], 
    //     ],
    //     'total' => 48276804
    // ];

    // $laba = 31411406;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>LR {{$date->format('F Y')}}</title>
    @include('PDF.styles')
</head>
<body class="">

    <div class="min-h-200 border-2 border-black px-4">
        
        {{-- header --}}
        <table class="table w-full cell-border-0 text-sm mt-4">
            <tr>
                <td class="pl-8">
                    <img src={{public_path('/storage/assets/logoroyalspbu.png')}} class="" width="60" height="50" />
                </td>
                <td>
                    <p class="text-center my-0">SPBU PT ROYAL KREASINDO JAYATAMA 65.746.02</p>
                    <p class="text-center text-2xs my-0">Jl. Trans Kalimantan Purwareja, Kec. Sematu Jaya Lamandau - Kalteng</p>
                </td>
                <td>
                    <img src={{public_path('/storage/assets/pertamina-always-there.png')}} class="" width="100" />
                </td>
            </tr>
        </table>

        {{-- main data --}}
        <table class="tabel w-full mt-4 text-2xs cell-px-1">
            <tr>
                <td colspan="7" class="text-center py-1">
                    PERHITUNGAN LABA RUGI {{strtoupper($date->format('F Y'))}}
                </td>
            </tr>
            <tr>
                <td class="py-0" colspan="7">PENJUALAN BBM</td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td>Volume</td>
                <td>Satuan Rp.</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            @foreach($penjualan['products'] as $productname => $product)
                <tr>
                    <td>{{$productname}}</td>
                    <td>{{$product['rangetime']}}</td>
                    <td class="text-right">{{number_format($product['volume'],0,',','.')}}</td>
                    <td>
                       <div class="cell-rupiah">{{number_format($product['price'],2,',','.')}}</div> 
                    </td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['total'],2,',','.')}}</div> 
                    </td>
                    <td></td>
                    <td></td>
                </tr>
            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="cell-rupiah border-b">{{number_format($penjualan['total'],2,',','.')}}</div> 
                </td>
            </tr>

            {{-- Harga pokok penjualan --}}
            <tr>
                <td colspan="7">HARGA POKOK PENJUALAN</td>
            </tr>
            <?php $i = 0; ?>
            @foreach($hargaPokokPenjualan['stokAwal']['products'] as $productname => $product)
                <tr>
                    <td>@if ($i == 0)Stok Awal @endif</td>
                    <td>{{$productname}}</td>
                    <td class="text-right">{{number_format($product['volume'],0,',','.')}}</td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['price'],2,',','.')}}</div>
                    </td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['total'],2,',','.')}}</div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <?php $i++; ?>
            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="cell-rupiah">{{number_format($hargaPokokPenjualan['stokAwal']['total'],2,',','.')}}</div>
                </td>
                <td></td>
            </tr>

            <?php $i = 0; ?>
            @foreach($hargaPokokPenjualan['pembelian']['products'] as $productname => $product)
                <tr>
                    <td>@if ($i == 0)Pembelian @endif</td>
                    <td>{{$productname}}</td>
                    <td class="text-right">{{number_format($product['volume'],0,',','.')}}</td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['price'],2,',','.')}}</div>
                    </td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['total'],2,',','.')}}</div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <?php $i++; ?>
            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="cell-rupiah">{{number_format($hargaPokokPenjualan['pembelian']['total'],2,',','.')}}</div>
                </td>
                <td></td>
            </tr>

            <tr>
                <td>Dikurangi:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <?php $i = 0; ?>
            @foreach($hargaPokokPenjualan['stokAkhir']['products'] as $productname => $product)
                <tr>
                    <td>@if ($i == 0)Stok Akhir @endif</td>
                    <td>{{$productname}}</td>
                    <td class="text-right">{{number_format($product['volume'],0,',','.')}}</td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['price'],2,',','.')}}</div>
                    </td>
                    <td>
                        <div class="cell-rupiah">{{number_format($product['total'],2,',','.')}}</div>
                    </td>
                    <td></td>
                    <td></td>
                </tr>
                <?php $i++; ?>
            @endforeach
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="cell-rupiah">{{number_format($hargaPokokPenjualan['stokAkhir']['total'],2,',','.')}}</div>
                </td>
                <td></td>
            </tr>

            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="cell-rupiah border-b">{{number_format($hargaPokokPenjualan['total'],2,',','.')}}</div> 
                </td>
            </tr>

            {{-- LABA KOTOR --}}
            <tr>
                <td colspan="6">LABA KOTOR</td>
                <td>
                    <div class="cell-rupiah">{{number_format($labaKotor,2,',','.')}}</div>
                </td>
            </tr>

            {{-- BIAYA DAN PENGELUARAN --}}
            <tr>
                <td colspan="7">BIAYA DAN PENGELUARAN</td>                
            </tr>

            @foreach($biayaDanPengeluaran['biayas'] as $biaya)
                <tr class="cell-py-0">
                    <td></td>
                    <td colspan="4">{{$biaya['name']}}</td>
                    <td>
                        <div class="cell-rupiah">{{number_format($biaya['price'],2,',','.')}}</div>
                    </td>
                    <td></td>
                </tr>
            @endforeach
            <tr>
                <td colspan="6">TOTAL BIAYA DAN PENGELUARAN</td>
                <td class="">
                    <div class="cell-rupiah border-b">{{number_format($biayaDanPengeluaran['total'],2,',','.')}}</div> 
                </td>
            </tr>

            <tr>
                <td colspan="6">LABA</td>
                <td>
                    <div class="cell-rupiah">{{number_format($laba,2,',','.')}}</div>
                </td>
            </tr>
            <tr></tr>
        </table>

    </div>
    
</body>
</html>