import * as cheerio from 'cheerio';

const SBS_BASE_URL = "https://sbs.beinsports.net/Dealers/Pages";

interface SBSCookies {
    sessionId: string;
    authCookie: string;
    ticket: string;
}

interface Contract {
    id: string;
    type: string;
    status: string;
    package: string;
    startDate: string;
    endDate: string;
    invoice: string;
}

interface CheckCardResult {
    success: boolean;
    card: {
        serial: string;
        stb: string;
        valid: boolean;
        expiry: string;
        wallet_balance: string;
        premium: boolean;
    };
    contracts: Contract[];
    raw_html?: string;
    error?: string;
}

export class SBSClient {
    private cookies: string;

    constructor(cookies: SBSCookies) {
        this.cookies = `ASP.NET_SessionId=${cookies.sessionId}; SBSDealerAuthCookieD8=${cookies.authCookie}; SBSDealerAuthCookieD8Ticket=${cookies.ticket};`;
    }

    private getHeaders() {
        return {
            "Cookie": this.cookies,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
        };
    }

    async getDashboardStats() {
        try {
            const res = await fetch(`${SBS_BASE_URL}/frmHome.aspx`, {
                headers: this.getHeaders()
            });
            const html = await res.text();
            const $ = cheerio.load(html);

            const dealerName = $("#ctl00_lblDealerName").text().trim() || "Unknown Dealer";
            const balance = $("#ctl00_ContentPlaceHolder1_lblBalance").text().trim() || "0.00 $";

            return {
                name: dealerName,
                balance: balance
            };
        } catch (error) {
            console.error("SBS Dashboard Error:", error);
            return null;
        }
    }

    async checkCard(serial: string): Promise<CheckCardResult> {
        try {
            // 1. GET the page first to extract ViewState
            const getRes = await fetch(`${SBS_BASE_URL}/frmCheck.aspx`, {
                headers: this.getHeaders()
            });
            const getHtml = await getRes.text();
            const $get = cheerio.load(getHtml);

            const viewState = $get('#__VIEWSTATE').val() as string;
            const viewStateGenerator = $get('#__VIEWSTATEGENERATOR').val() as string;
            const eventValidation = $get('#__EVENTVALIDATION').val() as string;

            if (!viewState) {
                return {
                    success: false,
                    card: { serial, stb: '', valid: false, expiry: '', wallet_balance: '0', premium: false },
                    contracts: [],
                    error: 'Session expired or invalid. Could not get ViewState from SBS.'
                };
            }

            // 2. POST the check request
            const formParams = new URLSearchParams();
            formParams.append('__VIEWSTATE', viewState);
            formParams.append('__VIEWSTATEGENERATOR', viewStateGenerator);
            if (eventValidation) formParams.append('__EVENTVALIDATION', eventValidation);
            formParams.append('ctl00$ContentPlaceHolder1$tbSerial', serial);
            formParams.append('ctl00$ContentPlaceHolder1$btnCheck', 'Check');

            const postRes = await fetch(`${SBS_BASE_URL}/frmCheck.aspx`, {
                method: "POST",
                headers: this.getHeaders(),
                body: formParams
            });

            const postHtml = await postRes.text();
            const $ = cheerio.load(postHtml);

            // 3. Parse the result HTML

            // Serial & STB info
            const serialText = $('#ctl00_ContentPlaceHolder1_lblSerial').text().trim()
                || $('#ContentPlaceHolder1_lblSerial').text().trim();
            const serialMatch = serialText.match(/Smart Card Serial:\s*(\d+)/);
            const stbMatch = serialText.match(/Is paired to STB\(s\):\s*([\d,\s]+)/);

            // Expiry info
            const expiryText = $('#ctl00_ContentPlaceHolder1_lblCardMsg').text().trim()
                || $('#ContentPlaceHolder1_lblCardMsg').text().trim();
            const expiryMatch = expiryText.match(/Expired on\s*(\d{2}\/\d{2}\/\d{4})/);
            const valid = expiryText.toLowerCase().includes('still valid');

            // Wallet balance
            const walletText = $('#ctl00_ContentPlaceHolder1_lblVodbalance').text().trim()
                || $('#ContentPlaceHolder1_lblVodbalance').text().trim();
            const walletMatch = walletText.match(/balance\s*:\s*\$?([\d.]+)/);

            // Premium status
            const premium = $('#ctl00_ContentPlaceHolder1_PremiumFlag').length > 0
                || $('#ContentPlaceHolder1_PremiumFlag').length > 0
                || postHtml.includes('PremiumFlag');

            // Contracts table
            const contracts: Contract[] = [];
            // Try multiple possible selectors for the contracts grid
            const gridSelectors = [
                '#ctl00_ContentPlaceHolder1_TabContainer1_TabPanel1_ctrlContracts_GridView1',
                '#ContentPlaceHolder1_TabContainer1_TabPanel1_ctrlContracts_GridView1',
                '.Grid'
            ];

            let gridFound = false;
            for (const selector of gridSelectors) {
                const rows = $(`${selector} tr`).not('.GridHeader').not(':first-child');
                if (rows.length > 0) {
                    gridFound = true;
                    rows.each((_, el) => {
                        const cols = $(el).find('td');
                        if (cols.length >= 7) {
                            const type = $(cols[1]).text().trim();
                            const status = $(cols[2]).text().trim();
                            const pkg = $(cols[3]).text().trim();
                            const startDate = $(cols[4]).text().trim();
                            const endDate = $(cols[5]).text().trim();
                            const invoice = $(cols[6]).text().trim();

                            if (type) {
                                contracts.push({
                                    id: invoice || String(Math.random()).slice(2, 10),
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
                    break;
                }
            }

            // Check if we actually got results
            const hasResults = serialMatch || expiryMatch || contracts.length > 0;

            if (!hasResults) {
                // Maybe the serial was invalid, check for error messages
                const errorMsg = $('#ctl00_ContentPlaceHolder1_lblResult').text().trim()
                    || $('#ContentPlaceHolder1_lblResult').text().trim()
                    || $('#ctl00_ContentPlaceHolder1_lblCardMsg').text().trim();

                return {
                    success: false,
                    card: { serial, stb: '', valid: false, expiry: '', wallet_balance: '0', premium: false },
                    contracts: [],
                    error: errorMsg || 'No results found for this serial number.',
                    raw_html: postHtml.substring(0, 500)
                };
            }

            return {
                success: true,
                card: {
                    serial: serialMatch ? serialMatch[1] : serial,
                    stb: stbMatch ? stbMatch[1].trim() : "None",
                    valid: valid,
                    expiry: expiryMatch ? expiryMatch[1] : "Unknown",
                    wallet_balance: walletMatch ? walletMatch[1] : "0",
                    premium: premium
                },
                contracts
            };

        } catch (error) {
            console.error("SBS Check Error:", error);
            return {
                success: false,
                card: { serial, stb: '', valid: false, expiry: '', wallet_balance: '0', premium: false },
                contracts: [],
                error: `Failed to check card: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
