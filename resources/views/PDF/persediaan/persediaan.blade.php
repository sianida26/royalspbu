<?php
    // $tank = App\Models\Tank::find();
    //get PersediaanReports on specified tank id and selected month
    $reports = App\Models\PersediaanReport::where('tank_id', $tank->id)->whereMonth('created_at', $date)->get();
    // $reports = App\Models\PersediaanReport::where('tank_id',$tank->id)->get();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    @include('PDF.styles')
</head>
<body class="font-arial">
    {{-- page 1 --}}
    <div> 
        {{-- header ornament --}}
        <div class="w-full">
            <div class="w-third inline-block">
                <div class="h-8 bg-red-pertamina w-full">&nbsp;</div>
            </div>
            <div class="w-third inline-block">
                <div class="h-8 bg-lime-pertamina w-full">&nbsp;</div>
            </div>
            <div class="w-third inline-block">
                <div class="h-8 bg-blue-pertamina w-full">&nbsp;</div>
            </div>
        </div>

        <div class="mt-10 relative">
            <h2 class="text-1D2D5D">CATATAN PERSEDIAAN BBM</h2>
            {{-- logo pertamina --}}
            <img src={{public_path('/storage/assets/pertamina-always-there.png')}} class="absolute right-0 top-0" width="125" />
        </div>

        {{-- header form --}}
        <table class="table w-full bg-E5F0FA">
            <tr>
                <td class="border-0 w-third py-3">
                    <span class="font-semibold text-sm">No. SPBU:</span>
                    <span class="border border-black inline-block text-sm">
                        {{App\Models\AppConfig::firstWhere('key','no_spbu')->value}}
                    </span>
                </td>
                <td class="border-0 w-third py-3">
                    <span class="font-semibold text-sm">Produk:</span>
                    <span class="border border-black inline-block text-sm">
                        {{$tank->product->name}}
                    </span>
                </td>
                <td class="border-0 w-third py-3">
                    <span class="font-semibold text-sm">No. Tangki Pendam:</span>
                    <span class="border border-black inline-block"></span>
                </td>
            </tr>
        </table>


        {{-- main data --}}
        <table class="table w-full text-center border-collapse mt-5 text-xs">
            <tr class="font-semibold">
                <td colspan="2" class="border-0 border-white"></td>
                <td class="">Awal</td>
                <td colspan="6">Penerimaan</td>
                <td colspan="5">Pengeluaran</td>
            </tr>
            <tr class="font-semibold">
                <td colspan="2" class="border-0 border-white"></td>
                <td>a</td>
                <td class="border-x-white" colspan="3"></td>
                <td class="border-x-white">b</td>
                <td class="border-x-white">c</td>
                <td class="border-l-white">d=c-b</td>
                <td class="border-x-white">e</td>
                <td class="border-x-white">f=a+c-e</td>
                <td class="border-x-white">g</td>
                <td class="border-x-white">h=g-f</td>
                <td class="border-l-white"></td>
            </tr>
            <tr class="text-2xs">
                <td style="">
                    <b>Tanggal</b>
                </td>
                <td>
                    <b>Shift</b>
                </td>
                <td>
                    <b>Stok awal</b> (L)
                </td>
                <td>
                    <b>No. mobil tangki</b>
                </td>
                <td>
                    <b>No. PNBP</b> (DO)
                </td>
                <td>
                    <b>Volume sebelum penerimaan</b> (L)
                </td>
                <td>
                    <b>Volume penerimaan PNBP</b> (L)
                </td>
                <td>
                    <b>Volume penerimaan aktual</b> (L)
                </td>
                <td>
                    <b>Selisih volume -R/L</b> (L)
                </td>
                <td>
                    <b>Pengeluaran Dispenser</b> (L)
                </td>
                <td>
                    <b>Stock akhir teoritis</b> (L)
                </td>
                <td>
                    <b>Stock akhir aktual</b> (L)
                </td>
                <td>
                    <b>Selisih total pengeluaran</b> (L)
                </td>
                <td>
                    <b>Paraf Spv</b>
                </td>
            </tr>

            {{-- main data --}}
            @for ($i = 0; $i < ($reports->count() > 16 ? 16 : $reports->count()); $i++)

                <?php 
                    $report = $reports[$i];
                    $penerimaan = $report->getPenerimaan();
                ?>
                
                <tr class="text-sm @if ($i%2 === 1) bg-E5F0FA @endif">
                    <td>{{$report->created_at->format('d/m/y')}}</td> {{-- tanggal --}}
                    <td>1</td> {{-- shift --}}
                    <td>{{$report->initial_stock}}</td> {{-- stok awal --}}
                    <td>{{$penerimaan ? str_replace(' ','',$penerimaan->truck_id) : ''}}</td> {{-- No Mobil tangki --}}
                    <td>{{$penerimaan ? 88888888 : ''}}</td> {{-- No PNBP --}}
                    <td>{{$penerimaan ? $penerimaan->initial_volume : ''}}</td> {{-- Volume sebelum penerimaan --}}
                    <td>{{$penerimaan ? $penerimaan->pnbp_volume : ''}}</td> {{-- Volume penerimaan pnbp --}}
                    <td>{{$penerimaan ? $penerimaan->getActualPenerimaanVolume() : ''}}</td> {{-- Volume penerimaan aktual --}}
                    <td>{{$penerimaan ? $penerimaan->getVolumeDiff() : ''}}</td>
                    <td>{{$report->getVolumeOutDispenser()}}</td> {{-- Pengeluaran dispenser --}}
                    <td>{{$report->getTheoriticalFinalStock()}}</td> {{-- Stock akhir teoritis --}}
                    <td>{{$report->actual_stock}}</td> {{-- Stock akhir aktual --}}
                    <td>{{$report->getOutVolumeDiff()}}</td>
                    <td></td>
                </tr>

            @endfor
        </table>

        {{-- footer --}}
        <table class="w-full border-collapse mt-3">
            <tr>
                <td class="w-third border-white">
                    <p class="font-semibold text-3xs my-0">Catatan:</p>
                    <p class="font-semibold text-3xs my-0"><i>Volume (angka) diambil dari jumlah pengeluaran totalizer nozzle yang terhubung pada tangki pendam
                        diisi setiap shift</i></p>
                    <p class="text-3xs my-0">Nilai diambil dari total pengeluaran dispenser per produk (Catatan Penjualan Shift)
                    </p>
                </td>
                <td class="w-third border-white">
                    <div class="w-full flex flex-row text-3xs">
                        <img src={{public_path('/storage/assets/stop.jpeg')}} class="" width="50" height="50" />
                        <div class="px-4 mt-3">
                            <p class="my-0"><b>Tolak pengiriman, jika:</b></p>
                            <p class="my-0"><i>Pengiriman tidak dilakukan oleh truk yang berwenang</i></p>
                            <p class="my-0"><i>Selisih volume lebih dari 0.15%</i></p>
                        </div>
                    </div>
                </td>
                <td class="w-third border-white">
                    <div class="w-full flex flex-row text-3xs">
                        <img src={{public_path('/storage/assets/warning.jpeg')}} class="" width="50" height="50" />
                        <div class="px-4 mt-1">
                            <p class="my-0">Jangan lupa untuk :</p>
                            <p class="my-0"><i><b>1. Uji Kualitas</b></i></p>
                            <p class="my-0"><i>2. Periksa kualitas</i></p>
                            <p class="my-0"><i>3. Simpan Sample</i></p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    @if ($reports->count() > 16)

        {{-- page 2 --}}
        <div> 
            {{-- header ornament --}}
            <div class="w-full">
                <div class="w-third inline-block">
                    <div class="h-8 bg-red-pertamina w-full">&nbsp;</div>
                </div>
                <div class="w-third inline-block">
                    <div class="h-8 bg-lime-pertamina w-full">&nbsp;</div>
                </div>
                <div class="w-third inline-block">
                    <div class="h-8 bg-blue-pertamina w-full">&nbsp;</div>
                </div>
            </div>

            <div class="mt-10 relative">
                <h2 class="text-1D2D5D">CATATAN PERSEDIAAN BBM</h2>
                {{-- logo pertamina --}}
                <img src={{public_path('/storage/assets/pertamina-always-there.png')}} class="absolute right-0 -top-11" width="125" height="125" />
            </div>

            {{-- header form --}}
            <table class="table w-full bg-E5F0FA">
                <tr>
                    <td class="border-0 w-third py-3">
                        <span class="font-semibold text-sm">No. SPBU:</span>
                        <span class="border border-black inline-block text-sm">
                            65.xxxx.xxxx
                        </span>
                    </td>
                    <td class="border-0 w-third py-3">
                        <span class="font-semibold text-sm">Produk:</span>
                        <span class="border border-black inline-block text-sm">
                            {{$tank->product->name}}
                        </span>
                    </td>
                    <td class="border-0 w-third py-3">
                        <span class="font-semibold text-sm">No. Tangki Pendam:</span>
                        <span class="border border-black inline-block"></span>
                    </td>
                </tr>
            </table>


            {{-- main data --}}
            <table class="table w-full text-center border-collapse mt-5 text-xs">
                <tr class="font-semibold">
                    <td colspan="2" class="border-0 border-white"></td>
                    <td class="">Awal</td>
                    <td colspan="6">Penerimaan</td>
                    <td colspan="5">Pengeluaran</td>
                </tr>
                <tr class="font-semibold">
                    <td colspan="2" class="border-0 border-white"></td>
                    <td>a</td>
                    <td class="border-x-white" colspan="3"></td>
                    <td class="border-x-white">b</td>
                    <td class="border-x-white">c</td>
                    <td class="border-l-white">d=c-b</td>
                    <td class="border-x-white">e</td>
                    <td class="border-x-white">f=a+c-e</td>
                    <td class="border-x-white">g</td>
                    <td class="border-x-white">h=g-f</td>
                    <td class="border-l-white"></td>
                </tr>
                <tr class="text-2xs">
                    <td style="">
                        <b>Tanggal</b>
                    </td>
                    <td>
                        <b>Shift</b>
                    </td>
                    <td>
                        <b>Stok awal</b> (L)
                    </td>
                    <td>
                        <b>No. mobil tangki</b>
                    </td>
                    <td>
                        <b>No. PNBP</b> (DO)
                    </td>
                    <td>
                        <b>Volume sebelum penerimaan</b> (L)
                    </td>
                    <td>
                        <b>Volume penerimaan PNBP</b> (L)
                    </td>
                    <td>
                        <b>Volume penerimaan aktual</b> (L)
                    </td>
                    <td>
                        <b>Selisih volume -R/L</b> (L)
                    </td>
                    <td>
                        <b>Pengeluaran Dispenser</b> (L)
                    </td>
                    <td>
                        <b>Stock akhir teoritis</b> (L)
                    </td>
                    <td>
                        <b>Stock akhir aktual</b> (L)
                    </td>
                    <td>
                        <b>Selisih total pengeluaran</b> (L)
                    </td>
                    <td>
                        <b>Paraf Spv</b>
                    </td>
                </tr>

                {{-- main data --}}
                @for ($i = 16; $i < $reports->count(); $i++)

                    <?php 
                        $report = $reports[$i];
                        $penerimaan = $report->getPenerimaan();
                    ?>
                    
                    <tr class="text-sm @if ($i%2 === 1) bg-E5F0FA @endif">
                        <td>{{$report->created_at->format('d/m/y')}}</td> {{-- tanggal --}}
                        <td>1</td> {{-- shift --}}
                        <td>{{$report->initial_stock}}</td> {{-- stok awal --}}
                        <td>{{$penerimaan ? str_replace(' ','',$penerimaan->truck_id) : ''}}</td> {{-- No Mobil tangki --}}
                        <td>{{$penerimaan ? 88888888 : ''}}</td> {{-- No PNBP --}}
                        <td>{{$penerimaan ? $penerimaan->initial_volume : ''}}</td> {{-- Volume sebelum penerimaan --}}
                        <td>{{$penerimaan ? $penerimaan->pnbp_volume : ''}}</td> {{-- Volume penerimaan pnbp --}}
                        <td>{{$penerimaan ? $penerimaan->getActualPenerimaanVolume() : ''}}</td> {{-- Volume penerimaan aktual --}}
                        <td>{{$penerimaan ? $penerimaan->getVolumeDiff() : ''}}</td>
                        <td>{{$report->getVolumeOutDispenser()}}</td> {{-- Pengeluaran dispenser --}}
                        <td>{{$report->getTheoriticalFinalStock()}}</td> {{-- Stock akhir teoritis --}}
                        <td>{{$report->actual_stock}}</td> {{-- Stock akhir aktual --}}
                        <td>{{$report->getOutVolumeDiff()}}</td>
                        <td></td>
                    </tr>

                @endfor
            </table>

            {{-- footer --}}
            <table class="w-full border-collapse mt-3">
                <tr>
                    <td class="w-third border-white">
                        <p class="font-semibold text-3xs my-0">Catatan:</p>
                        <p class="font-semibold text-3xs my-0"><i>Volume (angka) diambil dari jumlah pengeluaran totalizer nozzle yang terhubung pada tangki pendam
                            diisi setiap shift</i></p>
                        <p class="text-3xs my-0">Nilai diambil dari total pengeluaran dispenser per produk (Catatan Penjualan Shift)
                        </p>
                    </td>
                    <td class="w-third border-white">
                        <div class="w-full flex flex-row text-3xs">
                            <img src={{public_path('/storage/assets/stop.jpeg')}} class="" width="50" height="50" />
                            <div class="px-4 mt-3">
                                <p class="my-0"><b>Tolak pengiriman, jika:</b></p>
                                <p class="my-0"><i>Pengiriman tidak dilakukan oleh truk yang berwenang</i></p>
                                <p class="my-0"><i>Selisih volume lebih dari 0.15%</i></p>
                            </div>
                        </div>
                    </td>
                    <td class="w-third border-white">
                        <div class="w-full flex flex-row text-3xs">
                            <img src={{public_path('/storage/assets/warning.jpeg')}} class="" width="50" height="50" />
                            <div class="px-4 mt-1">
                                <p class="my-0">Jangan lupa untuk :</p>
                                <p class="my-0"><i><b>1. Uji Kualitas</b></i></p>
                                <p class="my-0"><i>2. Periksa kualitas</i></p>
                                <p class="my-0"><i>3. Simpan Sample</i></p>
                            </div>
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    @endif
</body>
</html>