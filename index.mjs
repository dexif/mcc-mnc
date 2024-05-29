import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import { writeFile } from 'fs/promises';

async function fetchTableData(url) {
    try {
        const response = await fetch(url);
        const html = await response.text();

        // Create JSDOM to parse HTML
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Find the table on the page
        const table = document.querySelector('table');

        if (!table) {
            throw new Error('Table not found on the page');
        }

        // Extract table headers
        const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.textContent.trim());

        // Extract table rows
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        // Create an array of objects
        const data = rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            const rowData = {};
            cells.forEach((cell, index) => {
                rowData[headers[index]] = cell.textContent.trim();
            });
            return rowData;
        });

        // Write data to a JSON file
        await writeFile('mmc-mnc.json', JSON.stringify(data, null, 2));
        console.log('Data has been written to mmc-mnc.json');
    } catch (error) {
        console.error('Error fetching table data:', error);
    }
}

fetchTableData('https://mcc-mnc.com/');
