<?php

$date = Carbon\Carbon::now();

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