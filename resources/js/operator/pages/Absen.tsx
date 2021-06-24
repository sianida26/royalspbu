import React from 'react'

import QRCode from 'react-qr-code'

export default function Absen() {

    // todo: add request qr code session

    return (
        <div>
            <QRCode value={"hei"}></QRCode>
            <span>Ini nanti text qr code nya</span>
        </div>
    )
}
