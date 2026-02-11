import * as cheerio from 'cheerio';

export interface Contract {
    id: string;
    type: string;
    status: string;
    package: string;
    startDate: string;
    endDate: string;
    invoice: string;
}

export interface CheckResult {
    success: boolean;
    dealer: {
        name: string;
        balance: string;
    };
    card: {
        serial: string;
        stb: string;
        valid: boolean;
        expiry: string;
        wallet_balance: string;
        premium: boolean;
    };
    contracts: Contract[];
    raw?: string;
    error?: string;
}

export function parseCheckResponse(html: string): CheckResult {
    const $ = cheerio.load(html);

    // Extract Serial and STB
    // Format: "Smart Card Serial: 751165462 ... Is paired to STB(s): 947242535445836"
    const serialText = $('#ContentPlaceHolder1_lblSerial').text().trim();
    const serialMatch = serialText.match(/Smart Card Serial:\s*(\d+)/);
    const stbMatch = serialText.match(/Is paired to STB\(s\):\s*([\d,]+)/); // Can be comma separated if multiple? Assuming digits for now

    // Extract Expiry
    // Format: "This  still Valid and will be Expired on 02/03/2026"
    const expiryText = $('#ContentPlaceHolder1_lblCardMsg').text().trim();
    const expiryMatch = expiryText.match(/Expired on\s*(\d{2}\/\d{2}\/\d{4})/);
    const valid = !expiryText.toLowerCase().includes('expired') || expiryText.toLowerCase().includes('still valid');

    // Extract Wallet Balance
    // Format: "Available Wallet balance : $0"
    const walletText = $('#ContentPlaceHolder1_lblVodbalance').text().trim();
    const walletMatch = walletText.match(/balance\s*:\s*\$?([\d.]+)/);

    // Extract Premium Status
    const premium = $('#ContentPlaceHolder1_PremiumFlag').length > 0;

    // Extract Contracts
    const contracts: Contract[] = [];
    $('#ContentPlaceHolder1_TabContainer1_TabPanel1_ctrlContracts_GridView1 tr:not(.GridHeader)').each((_, el) => {
        const cols = $(el).find('td');
        if (cols.length >= 7) {
            // Index 1: Type
            // Index 2: Status
            // Index 3: Package
            // Index 4: Start Date
            // Index 5: Expiry Date
            // Index 6: Invoice No
            const type = $(cols[1]).text().trim();
            const status = $(cols[2]).text().trim();
            const pkg = $(cols[3]).text().trim();
            const startDate = $(cols[4]).text().trim();
            const endDate = $(cols[5]).text().trim();
            const invoice = $(cols[6]).text().trim();

            if (type) { // Ensure row is valid
                contracts.push({
                    id: invoice || Math.random().toString(36).substr(2, 9), // Use invoice as ID or fallback
                    type,
                    status,
                    package: pkg,
                    startDate,
                    endDate,
                    invoice
                });
            }
        }
    });

    return {
        success: true, // Assuming parsing succeeded
        dealer: {
            name: "Unknown Dealer", // Not in the check_mobile fragment usually, strictly on dashboard
            balance: "0.00"
        },
        card: {
            serial: serialMatch ? serialMatch[1] : "Unknown",
            stb: stbMatch ? stbMatch[1] : "None",
            valid: valid,
            expiry: expiryMatch ? expiryMatch[1] : "Unknown",
            wallet_balance: walletMatch ? walletMatch[1] : "0",
            premium: premium
        },
        contracts: contracts
    };
}
