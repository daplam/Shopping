import test, { expect } from 'playwright/test';

import ExcelJS, { CellValue, Worksheet } from 'exceljs';

interface CellPosition {
    rowNum: number
    colNum: number
}

async function writeExcel({ searchValue, replaceValue, excelFile, change }: { searchValue: CellValue, replaceValue: CellValue, excelFile: string, change?: CellPosition }): Promise<void> {

    const workbook = new ExcelJS.Workbook() // create object of class Exceljs
    await workbook.xlsx.readFile(excelFile)
    const workSheet = workbook.getWorksheet('Sheet1')
    if (!workSheet) throw new Error('Worksheet "Sheet1" not found');

    const cellValues = await readExcel({ worksheet: workSheet, toSearch: searchValue })

    if (cellValues.rowNum === -1 || cellValues.colNum === -1) {
        throw new Error(`Value "${searchValue}" not found in worksheet`)
    }

    let cell

    if (change) {
        cell = workSheet.getCell(cellValues.rowNum, cellValues.colNum + change.colNum) // need to pass the specific row and column
    }
    else {
        cell = workSheet.getCell(cellValues.rowNum, cellValues.colNum) // need to pass the specific row and column
    }
    cell.value = replaceValue // update value
    await workbook.xlsx.writeFile(excelFile) // save changes
}

async function readExcel({ worksheet, toSearch }: { worksheet: Worksheet, toSearch: CellValue }): Promise<CellPosition> {
    // let outputcell = { rowNum: -1, colNum: -1 }
    let outputcell: CellPosition = { rowNum: -1, colNum: -1 };

    worksheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, columnNumber) => {
            if (cell.value === toSearch) {
                outputcell.rowNum = rowNumber
                outputcell.colNum = columnNumber
                console.log('Located in: ' + rowNumber + '-' + columnNumber)
            }
        })
    })
    return outputcell
}


test('Upload download modify name', async ({ page }) => {
    const textSearch = 'Mango'
    const updateValue = 'test'
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html")
    await page.getByRole('button', { name: 'Download' }).isVisible()

    const [promiseDownload] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download' }).click()
    ]);

    const path = await promiseDownload.path(); // temporal path

    // save specific path
    await promiseDownload.saveAs('/Users/Daplam/Downloads/download.xlsx')
    await promiseDownload

    // verify file name
    await expect(promiseDownload.suggestedFilename()).toContain('download.xlsx')

    await writeExcel({ searchValue: textSearch, replaceValue: updateValue, excelFile: "/Users/Daplam/Downloads/download.xlsx" })

    await page.locator("#fileinput").setInputFiles("/Users/Daplam/Downloads/download.xlsx")
    await expect(page.getByRole('alert').filter({ hasText: 'Updated Excel Data Successfully.' })).toBeVisible()

    //verify updated value
    await expect(page.getByText(updateValue)).toBeVisible()
    await page.pause()
})


test('Upload download modify price', async ({ page }) => {
    const textSearch = 'Mango'
    const updateValue = '350'
    await page.goto("https://rahulshettyacademy.com/upload-download-test/index.html")

    await page.getByRole('button', { name: 'Download' }).isVisible()

    const [promiseDownload] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('button', { name: 'Download' }).click()
    ]);

    const path = await promiseDownload.path(); // temporal path

    // save specific path
    await promiseDownload.saveAs('/Users/Daplam/Downloads/download.xlsx')
    await promiseDownload

    // verify file name
    await expect(promiseDownload.suggestedFilename()).toContain('download.xlsx')

    await writeExcel({ searchValue: textSearch, replaceValue: updateValue, excelFile: "/Users/Daplam/Downloads/download.xlsx", change: { rowNum: 0, colNum: 2 } })
    await page.locator("#fileinput").setInputFiles("/Users/Daplam/Downloads/download.xlsx")
    await expect(page.getByRole('alert').filter({ hasText: 'Updated Excel Data Successfully.' })).toBeVisible()
    const textlocator = page.getByText(textSearch)
    const desiredRow = await page.getByRole('row').filter({ has: textlocator })
    await expect(desiredRow.locator("#cell-4-undefined")).toContainText(updateValue)
    await page.pause()
})