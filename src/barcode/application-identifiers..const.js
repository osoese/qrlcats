const BARCODE = {
    APPLICATION_IDENTIFIER: 'APPLICATION_IDENTIFIER',
    NAME: 'NAME',
    FORMAT: 'FORMAT',
    DATE_TITLE: 'DATE_TITLE',
}

const APPLICATION_IDENTIFIERS = {
    21:{
        [BARCODE.APPLICATION_IDENTIFIER]:21,
        [BARCODE.NAME]:'Serial',
        [BARCODE.FORMAT]:'n2+an..20',
        [BARCODE.DATE_TITLE]:'SERIAL',
    },
    241:{
        [BARCODE.APPLICATION_IDENTIFIER]:241,
        [BARCODE.NAME]:'Customer Part Number',
        [BARCODE.FORMAT]:'n3+an..30',
        [BARCODE.DATE_TITLE]:'CUST. PART NO.',
    },
    412:{
        [BARCODE.APPLICATION_IDENTIFIER]:412,
        [BARCODE.NAME]:'Purchased from Global Location Number',
        [BARCODE.FORMAT]:'n3+n13',
        [BARCODE.DATE_TITLE]:'PURCHASE FROM',
    },
    414:{
        [BARCODE.APPLICATION_IDENTIFIER]:414,
        [BARCODE.NAME]:'Identification of a physical location Global Location Number',
        [BARCODE.FORMAT]:'n3+n13',
        [BARCODE.DATE_TITLE]:'LOC No',
    },
}

export const barcodeStyleOne = '(21) 00000001 (241) FAKE-0001 (412) 0x000000000000000000000000000000000000dead (414) EGEM';

