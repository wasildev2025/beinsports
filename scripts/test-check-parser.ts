import { parseCheckResponse } from '../lib/check-parser';

// Mock HTML provided by the user
const mockHtml = `
<!DOCTYPE html>
<html lang="en">
<!-- ... (truncated for brevity, including the relevant parts) ... -->
<body>
    <div id="ContentPlaceHolder1_MessagesArea">
        <div id="ContentPlaceHolder1_PremiumFlag">
            <span>Premium</span>&nbsp;<img src="https://sbs.beinsports.net/Dealers/images/star.png" alt="" align="absmiddle">
        </div>
        <div>
            <span id="ContentPlaceHolder1_lblSerial">Smart Card Serial: 751165462 ... Is paired to STB(s): 947242535445836</span>
        </div>
        <div>
            <span id="ContentPlaceHolder1_lblVodbalance">Available Wallet balance : $0</span>
        </div>
        <span id="ContentPlaceHolder1_lblCardMsg">This  still Valid and will be Expired on 02/03/2026</span>
    </div>
    <div id="ContentPlaceHolder1_TabContainer1_TabPanel1_ctrlContracts_GridView1">
        <table class="Grid">
            <tr class="GridHeader"><th>...</th></tr>
            <tr class="GridRow">
                <td>...</td>
                <td>Replacement</td>
                <td>Canceled</td>
                <td>Premium Monthly Installment 4 Parts</td>
                <td>17/02/2022</td>
                <td>31/03/2022</td>
                <td>38936846</td>
            </tr>
            <tr class="GridAlternatingRow">
                <td>...</td>
                <td>Package</td>
                <td>Active</td>
                <td>Basic Package</td>
                <td>03/03/2025</td>
                <td>02/03/2026</td>
                <td>48626334</td>
            </tr>
        </table>
    </div>
</body>
</html>
`;

async function testParser() {
    console.log("Testing Check Parser...");
    try {
        const result = parseCheckResponse(mockHtml);

        console.log("Parsed Result:", JSON.stringify(result, null, 2));

        // Assertions
        if (result.card.serial === "751165462" &&
            result.card.stb === "947242535445836" &&
            result.card.premium === true &&
            result.contracts.length === 2) {
            console.log("✅ Parser Test Passed!");
        } else {
            console.error("❌ Parser Test Failed!");
            console.error("Expected Serial: 751165462, Got:", result.card.serial);
            console.error("Expected STB: 947242535445836, Got:", result.card.stb);
            console.error("Expected Premium: true, Got:", result.card.premium);
            console.error("Expected Contracts: 2, Got:", result.contracts.length);
        }

    } catch (error) {
        console.error("Test Error:", error);
    }
}

testParser();
