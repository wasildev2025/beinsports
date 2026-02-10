import * as cheerio from 'cheerio';

const SBS_BASE_URL = "https://sbs.beinsports.net/Dealers/Pages";

interface SBSCookies {
    sessionId: string;
    authCookie: string;
    ticket: string;
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

            // Scrape Balance/Stats - *Selectors need to be adjusted based on real HTML inspection*
            // Assuming typical ID structures or text search
            const dealerName = $("#ctl00_lblDealerName").text().trim() || "Unknown Dealer";
            // Example selector - would need real inspection to be precise
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

    async checkCard(serial: string) {
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

            // 2. POST the check request
            const params = new URLSearchParams();
            params.append('__VIEWSTATE', viewState);
            params.append('__VIEWSTATEGENERATOR', viewStateGenerator);
            if (eventValidation) params.append('__EVENTVALIDATION', eventValidation);

            // From inspection, the input ID is likely ctl00$ContentPlaceHolder1$tbSerial
            // and the button is ctl00$ContentPlaceHolder1$btnCheck
            params.append('ctl00$ContentPlaceHolder1$tbSerial', serial);
            params.append('ctl00$ContentPlaceHolder1$btnCheck', 'Check'); // Or whatever the button value/name is

            const postRes = await fetch(`${SBS_BASE_URL}/frmCheck.aspx`, {
                method: "POST",
                headers: this.getHeaders(),
                body: params
            });

            const postHtml = await postRes.text();
            const $post = cheerio.load(postHtml);

            // Extract Result
            // Look for a result label or table
            const resultText = $post('#ctl00_ContentPlaceHolder1_lblResult').text().trim()
                || $post('.result-class').text().trim() // Fallback class
                || "No result found (Check selectors)";

            return {
                result: resultText,
                html_snippet: $post('#ctl00_ContentPlaceHolder1_pnlResult').html() // Return raw HTML of result panel if possible
            };

        } catch (error) {
            console.error("SBS Check Error:", error);
            throw error;
        }
    }
}
