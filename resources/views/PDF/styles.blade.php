<style>
    body{
        /* letter-spacing: 0.075em; */
        letter-spacing: normal;
        text-size-adjust: 100%;
    }
    td{
        border: 1px solid rgba(0,0,0,1);
        padding: 2px 8px 2px 8px;
    }

    table.cell-border-0 td{
        border: 0px solid rgba(0,0,0,1);
    }

    table.cell-px-1 td{
        padding-left: 0.25rem;
        padding-right: 0.25rem;
    }

    tr.cell-py-0 td{
        padding-top: 0;
        padding-bottom: 0;
    }

    .absolute{
        position: absolute;
    }

    .bg-blue-500{
        background-color: #3B82F6;
    }

    .bg-blue-pertamina{
        background-color: #3952A4;
    }

    .bg-E5F0FA{
        background-color: #E5F0FA;
    }

    .bg-lime-500{
        background-color: #84CC16;
    }

    .bg-lime-pertamina{
        background-color: #98C93C;
    }

    .bg-red-500{
        background-color: #EF4444;
    }

    .bg-red-pertamina{
        background-color: #ED2024;
    }

    .bg-white {
        background-color: #FFFFFF;
    }

    .border{
        border-width: 4px;
    }

    .border-2{
        border: 2px solid;
    }

    .border-b{
        border-bottom: 1px solid;
    }

    .border-black{
        border-color: #000000;
    }

    .border-collapse{
        border-collapse: collapse;
    }

    .border-l-white{
        border-left-color: #FFFFFF;
    }

    .border-r-white{
        border-right-color: #FFFFFF;
    }

    .border-white{
        border-color: #FFFFFF;
    }

    .border-x-white{
        border-right-color: #FFFFFF;
        border-left-color: #FFFFFF;
    }

    .border-0{
        border-width: 0;
    }

    .cell-rupiah{
        text-align: right;
    }

    .cell-rupiah::before{
        content: "Rp";
        float: left;
        padding-right: 4px;
    }

    .flex{
        display: -webkit-box;
    }

    .flex-col{
        -webkit-box-orient: vertical;
    }

    .flex-row{
        -webkit-box-orient: horizontal;
    }

    .font-arial{
        font-family: Arial, Helvetica, sans-serif;
    }

    .font-medium{
        font-weight: 600;
    }

    .font-semibold{
        font-weight: 600;
    }

    .h-8{
        height: 2rem/* 32px */;
    }

    .h-96 {
        height: 24rem/* 384px */;
    }

    .header{
        position: relative;
    }

    .inline-block{
        display: inline-block;
    }

    .inner{
        padding: 0 0 0 8px;
    }

    .italic{
        font-style: italic;
    }

    .justify-between{
        -webkit-box-pack: justify;
    }

    .logo-pertamina{
        position: absolute;
        right: 0;
        top:0;
    }
    .main{
        /* border: 1px solid rgba(0,0,0,.5); */
        width: 100vh;
    }

    .my-0 {
        margin-bottom: 0;
        margin-top: 0;
    }

    .min-h-24{
        min-height: 6rem;
    }

    .min-h-200{
        min-height: 60rem;
    }

    .mt-1 {
        margin-top: 0.25rem /*4 px */;
    }

    .mt-2{
        margin-top: 0.5rem /*8px */;
    }

    .mt-3 {
        margin-top: 0.75rem/* 12px */;
    }

    .mt-4 {
        margin-top: 1rem/* 16px */;
    }

    .mt-5 {
        margin-top: 1.25rem/* 8px */;
    }
    .mt-8 {
        margin-top: 2rem/* 32px */;
    }
    .mt-10 {
        margin-top: 2.5rem/* 16px */;
    }

    .p-3 {
        padding: 0.75rem/* 12px */;
    }

    .pb-8 {
        padding-bottom: 2rem/* 32px */;
    }

    .pl-6 {
        padding-left: 1.5rem/* 24px */;
    }

    .pl-8 {
        padding-left: 2rem/* 32px */;
    }

    .px-0 {
        padding-left: 0;
        padding-right: 0;
    }

    .px-2 {
        padding-left: 0.25rem/* 8px */;
        padding-right: 0.25rem/* 8px */;
    }

    .px-4 {
        padding-left: 1rem/* 16px */;
        padding-right: 1rem/* 16px */;
    }

    .px-8 {
        padding-left: 2rem/* 32px */;
        padding-right: 2rem/* 32px */;
    }

    .px-16 {
        padding-left: 4rem/* 64px */;
        padding-right: 4rem/* 64px */;
    }

    .py-0{
        padding-bottom: 0;
        padding-top: 0;
    }

    .py-1 {
        padding-bottom: 0.25rem/* 8px */;
        padding-top: 0.25rem/* 8px */;
    }

    .py-3 {
        padding-top: 0.75rem/* 12px */;
        padding-bottom: 0.75rem/* 12px */;
    }
    .relative{
        position: relative;
    }

    .right-0{
        right: 0;
    }
    .self-end{
        position: absolute;
        right: 8px;
    }
    .tank-name{
        width: 25%;
        text-align: center;
    }
    .tabel{
        border: 1px solid rgba(0,0,0,1);
        border-collapse: collapse;
        width: 100%;
    }
    .tabel-subheader{
        text-align: center;
    }

    .table{
        display: table;
    }

    .table-border-white td{
        border-color: #FFFFFF !important;
    }
    .tanggal{
        margin-top: 36px;
    }
    .td-penjualan{
        width: 25%;
    }

    .text-base {
        font-size: 1rem;
        line-height: 1.5rem;
    }
    .text-center{
        text-align: center;
    }
    .text-left{
        text-align: left;
    }
    .text-right{
        text-align: right;
    }

    .text-sm {
        font-size: 0.875rem/* 14px */;
        line-height: 1.25rem/* 20px */;
    }

    .text-xs{
        font-size: 0.75rem;
        line-height: 1rem;
    }

    .text-2xs{
        font-size: 0.65rem;
        line-height: 0.85rem;
    }

    .text-3xs{
        font-size: 0.5rem;
        line-height: 0.7rem;
    }

    .text-4xs{
        font-size: 0.4rem;
        line-height: 0.6rem;
    }

    .text-5xs{
        font-size: 0.3rem;
        line-height: 0.5rem;
    }

    .text-1D2D5D{
        color: #1D2D5D;
    }

    .top-0{
        top: 0;
    }

    .top-4{
        top: 1rem;
    }


    .-top-11{
        top: -2.75rem;
    }
    .total-penjualan{
        background-color: yellow;
        background-clip: content-box;
        padding: 0;
    }
    .ttd-blank{
        height: 96px;
    }
    .ttd-container{
        margin-top: 4rem;
    }
    .ttd-group{
        width: 12rem;
        margin-left: auto;
        margin-right: 0;
    }
    .ttd-name{
        border-top: 1px solid rgba(0,0,0,1);
        padding-top: 0.5rem;
    }

    .underline{
        text-decoration: underline;
    }

    .w-third{
        width: 33%;
    }

    .w-full{
        width: 100%;
    }

    .w-1\/3{
        width: 33%;
    }

    .w-2\/3{
        width: 66%;
    }

    .w-4\/5{
        width: 80%;
    }
    .w-16{
        width: 4rem;
    }

    .table-dense td{
        padding-top: 0.085rem;
        padding-bottom: 0.085rem;
    }
</style>