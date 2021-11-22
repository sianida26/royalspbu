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

    <div class="min-h-200 border-2 border-black px-4 pb-8">
        
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