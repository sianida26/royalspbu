@php
    $i = 0;
@endphp

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Laporan Totalisator {{$model->created_at->isoFormat('dddd, D MMMM Y')}}</title>
    @include('PDF.styles')
</head>
<body>
    <div class="main">
        {{-- header --}}
        <div class="header">
            <p>SPBU SEMATU JAYA 65.746.02</p>
            <p>PT. ROYAL KREASINDO JAYATAMA</p>
            <p>LAPORAN TOTALISATOR HARIAN</p>

            {{-- logo pertamina --}}
            <img src={{public_path('/storage/assets/logos/pertamina.png')}} class="logo-pertamina" width="100" height="100" />
        </div>

        {{-- tanggal --}}
        <p class="tanggal">Tanggal:&nbsp;&nbsp; {{$model->created_at->isoFormat('dddd, D MMMM Y')}}</p>

        {{-- table --}}
        <table class="tabel">
            {{-- BBM --}}
            <tr>
                <td colspan="4" class="tabel-subheader">BBM</td>
            </tr>
            @foreach($report['penerimaan'] as $penerimaan)
                <tr>
                    <td class="tank-name">{{$penerimaan['tankName']}}</td>
                    <td colspan="3">{{$penerimaan['volume']}}</td>
                </tr>
            @endforeach

            {{-- Penjualan --}}
            <tr>
                <td colspan="4" class="tabel-subheader">PENJUALAN</td>
            </tr>
            @foreach($report['penjualan'] as $penjualan)
                <tr>
                    <td class="tank-name">{{$penjualan['tankName']}}</td>
                    <td class="td-penjualan text-right">{{number_format($penjualan['volume'],0,',','.')}}</td>
                    <td class="td-penjualan relative">
                        <span>Rp</span>
                        <span class="self-end">{{number_format($penjualan['price'],0,',','.')}}</span>
                    </td>
                    <td class="relative">
                        <span>Rp</span>
                        <span class="self-end">{{number_format($penjualan['price']*$penjualan['volume'],0,',','.')}}</span>
                    </td>
                </tr>
            @endforeach
            
            <tr>
                <td colspan="3">TOTAL PENJUALAN KOTOR</td>
                <td class="total-penjualan">
                    <div class="relative inner">
                        <span>Rp</span>
                        <span class="self-end">{{number_format($model->getGrossIncome(),0,',','.')}}</span>
                    </div>
                </td>
            </tr>

            {{-- BIAYA --}}
            <tr>
                <td colspan="4" class="tabel-subheader">BIAYA</td>
            </tr>
            @foreach($report['pengeluaran'] as $pengeluaran)
                @php
                    $i++;    
                @endphp
                <tr>
                    <td class="text-center">{{$i}}</td>
                    <td class="text-center">{{$pengeluaran['name']}}</td>
                    <td class="relative" colspan="2">
                        <span>Rp</span>
                        <span class="self-end">{{number_format($pengeluaran['amount'], 0, ',', '.')}}</span>
                    </td>
                </tr>
            @endforeach
            <tr>
                <td colspan="3">TOTAL BIAYA</td>
                <td class="total-penjualan">
                    <div class="relative inner">
                        <span>Rp</span>
                        <span class="self-end">{{number_format($model->getTotalExpenses(), 0, ',', '.')}}</span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colspan="3">PENJUALAN BERSIH</td>
                <td class="relative">
                    <span>Rp</span>
                    <span class="self-end">{{number_format($model->getNEtIncome(), 0, ',', '.')}}</span>
                </td>
            </tr>
        </table>
        
        <div class="ttd-container">
            <div class="ttd-group">
                <p class="text-center">Yang bertugas,</p>
                <div class="ttd-blank"></div>
                <p class="text-center ttd-name">({{$report['reporter']}})</p>
            </div>
        </div>
    </div>
</body>
</html>