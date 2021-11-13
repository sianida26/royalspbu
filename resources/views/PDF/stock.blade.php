<?php

$date = Carbon\Carbon::now();

// $stocks = [
//     'Premium' => [
//         'initialStock' => '-',
//         'penerimaan' => '-',
//         'subtotal' => '-',
//         'penjualan' => '-',
//         'theoriticalStock' => '-',
//         'actualStock' => '-',
//         'diff' => '-'
//     ],
//     'Solar / Biosolar' => [
//         'initialStock' => '-',
//         'penerimaan' => '-',
//         'subtotal' => '-',
//         'penjualan' => '-',
//         'theoriticalStock' => '-',
//         'actualStock' => '-',
//         'diff' => '-'
//     ],
//     'Pertalite' => [
//         'initialStock' => 4882,
//         'penerimaan' => 208000,
//         'subtotal' => 212882,
//         'penjualan' => 210630,
//         'theoriticalStock' => 2252,
//         'actualStock' => 1041,
//         'diff' => 1211
//     ],
//     'Pertamax' => [
//         'initialStock' => 763,
//         'penerimaan' => 56000,
//         'subtotal' => 56763,
//         'penjualan' => 53619,
//         'theoriticalStock' => 3144,
//         'actualStock' => 2712,
//         'diff' => 432
//     ],
//     'Pertamax Turbo' => [
//         'initialStock' => '-',
//         'penerimaan' => '-',
//         'subtotal' => '-',
//         'penjualan' => '-',
//         'theoriticalStock' => '-',
//         'actualStock' => '-',
//         'diff' => '-'
//     ],
//     'Dexlite' => [
//         'initialStock' => 7397,
//         'penerimaan' => 8000,
//         'subtotal' => 15397,
//         'penjualan' => 13753,
//         'theoriticalStock' => 1644,
//         'actualStock' => 1832,
//         'diff' => 188
//     ],
//     'Pertamina Dex' => [
//         'initialStock' => '-',
//         'penerimaan' => '-',
//         'subtotal' => '-',
//         'penjualan' => '-',
//         'theoriticalStock' => '-',
//         'actualStock' => '-',
//         'diff' => '-'
//     ],
// ];

// $dataPerProduct = [
//     'Premium' => [
//         //6 nozzles
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Solar / Biosolar' => [
//         //4 nozzles
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Pertalite' => [
//         //8 nozzles
//         ['awal' => 130230, 'akhir' => 132625, 'tera' => '', 'penjualan' => 2395],
//         ['awal' => 265499, 'akhir' => 269068, 'tera' => '', 'penjualan' => 3569],
//         ['awal' => 129284, 'akhir' => 151672, 'tera' => '', 'penjualan' => 22388],
//         ['awal' => 157788, 'akhir' => 182018, 'tera' => '', 'penjualan' => 24230],
//         ['awal' => 548448, 'akhir' => 629882, 'tera' => '', 'penjualan' => 81434],
//         ['awal' => 524027, 'akhir' => 600641, 'tera' => '', 'penjualan' => 76614],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Pertamax' => [
//         //8 nozzles
//         ['awal' => 46612, 'akhir' => 59620, 'tera' => '', 'penjualan' => 13008],
//         ['awal' => 45837, 'akhir' => 60445, 'tera' => '', 'penjualan' => 14608],
//         ['awal' => 42897, 'akhir' => 44849, 'tera' => '', 'penjualan' => 1952],
//         ['awal' => 50325, 'akhir' => 52338, 'tera' => '', 'penjualan' => 2013],
//         ['awal' => 42425, 'akhir' => 54557, 'tera' => '', 'penjualan' => 12132],
//         ['awal' => 45059, 'akhir' => 54965, 'tera' => '', 'penjualan' => 9906],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Pertamax Turbo' => [
//         //4 nozzles
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Dexlite' => [
//         //6 nozzles
//         ['awal' => 40151, 'akhir' => 47604, 'tera' => '', 'penjualan' => 7453],
//         ['awal' => 17785, 'akhir' => 21108, 'tera' => '', 'penjualan' => 3323],
//         ['awal' => 20500, 'akhir' => 20782, 'tera' => '', 'penjualan' => 282],
//         ['awal' => 29822, 'akhir' => 32517, 'tera' => '', 'penjualan' => 2695],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
//     'Pertamina Dex' => [
//         //4 nozzles
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//         ['awal' => '-', 'akhir' => '', 'tera' => '', 'penjualan' => '-'],
//     ],
// ];

$tankCapacities = [
    'Premium' => [15000],
    'Solar' => [20000],
    'Pertalite' => [20000],
    'Pertamax' => [20000],
    'Pertamax Turbo' => [20000],
    'Dexlite' => [20000],
    'Pertamina Dex' => [20000],
];
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan Stok</title>
    @include('PDF.styles')
</head>
<body class="text-2xs font-arial">
    {{-- header --}}
    <div class="relative font-medium">
        <p class="my-0">LAPORAN STOK, REALISASI PENERIMAAN DAN PENYALURAN BBM & BBK</p>
        <p class="my-0">SPBU No. {{App\Models\AppConfig::firstWhere('key','no_spbu')->value}}</p>
        <p class="my-0">{{App\Models\AppConfig::firstWhere('key','company_name')->value}}</p>
        <p class="my-0">{{App\Models\AppConfig::firstWhere('key','address')->value}}</p>

        {{-- month --}}
        <span class="absolute right-0 top-4 text-base">
            {{-- format date like Mei 2021 --}}
            {{strtoupper(date('F Y', strtotime($date)))}}
        </span>
    </div>
    {{-- main --}}
    <table class="table w-full text-center border-collapse mt-2 text-4xs">
        <thead>
            <tr class="font-medium">
                <td>NO</td>
                <td>MUTASI</td>
                @foreach ($stocks as $i => $product)
                    <td>{{strtoupper($i)}}</td>
                @endforeach
            </tr>
        </thead>
        <tbody>
            <?php 
                $items = [
                    ['initialStock','Stok Awal Aktual Hasil Dipping'],
                    ['penerimaan','Penerimaan BBM'],
                    ['subtotal','Sub Total (1 + 2)'],
                    ['penjualan','Penjualan Berdasar Totalisator'],
                    ['theoriticalStock','Stok Akhir Perhitungan (3-4)'],
                    ['actualStock','Stok Akhir Aktual Hasil Dipping'],
                    ['diff','Selisih'],
                ];
            ?>
            @foreach($items as $key => $item)
                <tr class="text-right @if ($key === 1 || $key === 5) bg-E5F0FA @endif">
                    <td class="text-center bg-white">{{$key+1}}</td>
                    <td class="text-left bg-white">{{$item[1]}}</td>
                    @foreach($stocks as $i => $product)
                        {{-- show product[item[0]] with thousand separator if it's a number --}}
                        <td class="text-right">
                            @if (is_numeric($product[$item[0]]))
                                {{number_format($product[$item[0]],0,',','.')}}
                            @else
                                {{$product[$item[0]]}}
                            @endif
                        </td>
                    @endforeach
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="flex flex-row w-full">
        <div class="w-2/3 pl-6 mt-1">
            @foreach($dataPerProduct as $productName => $nozzles)
                <table class="table w-full text-center border-collapse text-4xs border-black mt-1 table-dense">
                    <thead>
                        <tr class="font-medium">
                            <td rowspan="2">{{$productName}}</td>
                            <td class="w-16">Totalisator Awal</td>
                            <td class="w-16">Totalisator Akhir</td>
                            <td class="w-16">Tera</td>
                            <td class="w-16">Penjualan</td>
                        </tr>
                        <tr class="text-5xs italic">
                            <td class="py-0">1</td>
                            <td class="py-0">2</td>
                            <td class="py-0">3</td>
                            <td class="py-0">=(2-1)-3</td>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($nozzles as $i => $nozzle)
                            <?php 
                            $total = 0;
                            //increment total by penjualan if penjualan is numeric
                            if (is_numeric($nozzle['penjualan'])) {
                                $total += $nozzle['penjualan'];
                            }
                            ?>
                            <tr>
                                <td>Nozzle {{$i+1}}</td>
                                {{-- show awal, akhir, penjualan with thousand separator if it's a number --}}
                                <td class="text-right">
                                    @if (is_numeric($nozzle['awal']))
                                        {{number_format($nozzle['awal'],0,',','.')}}
                                    @else
                                        {{$nozzle['awal']}}
                                    @endif
                                </td>
                                <td class="text-right bg-E5F0FA">
                                    @if (is_numeric($nozzle['akhir']))
                                        {{number_format($nozzle['akhir'],0,',','.')}}
                                    @else
                                        {{$nozzle['akhir']}}
                                    @endif
                                </td>
                                <td class="text-right bg-E5F0FA">
                                    @if (is_numeric($nozzle['tera']))
                                        {{number_format($nozzle['tera'],0,',','.')}}
                                    @else
                                        {{$nozzle['tera']}}
                                    @endif
                                </td>
                                <td class="text-right">
                                    @if (is_numeric($nozzle['penjualan']))
                                        {{number_format($nozzle['penjualan'],0,',','.')}}
                                    @else
                                        {{$nozzle['penjualan']}}
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                        <tr>
                            <td colspan="4">TOTAL</td>
                            {{-- show total with thousand separator --}}
                            <td class="text-right">
                                @if (is_numeric($total))
                                    {{number_format($total,0,',','.')}}
                                @else
                                    {{$total}}
                                @endif
                            </td>
                        </tr>
                    </tbody>
                </table>
            @endforeach
        </div>

        {{-- kapasitas tangki pendam --}}
        <div class="w-1/3 px-8 mt-10">
            <p class="text-left font-semibold underline">KAPASITAS TANGKI PENDAM</p>
            @foreach($tankCapacities as $name => $capacities)
                <p class="text-3xs font-semibold underline">{{$name}}</p>
                <table class="table table-border-white text-3xs border-collapse">
                    <tr>
                        <td class="px-0 w-16">1. {{$capacities[0]}} Liter</td>
                        <td class="px-0 w-16">3. ... Liter</td>
                    </tr>
                    <tr>
                        <td class="px-0 w-16">2. ... Liter</td>
                        <td class="px-0 w-16">4. ... Liter</td>
                    </tr>
                </table>
            @endforeach
        </div>
    </div>
</body>
</html>