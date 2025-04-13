function getTransformedPortfolioStocks(portfolio) {
    return portfolio.map((item) => {
        const currentPrice = item.candlesClose.at(-1);
        const avgPrice = parseFloat(item.avgPrice);
        const quantity = item.quantity;
        const currentValue = currentPrice * quantity;
        const invested = avgPrice * quantity;
        const profitLoss = currentValue - invested;

        return {
            stockId: item.stockId,
            stockSymbol: item.stockSymbol,
            companyName: item.stockName,
            candlesClose: item.candlesClose,
            currentPrice: currentPrice,
            low7DaysOrTotalHoldings: quantity,
            high7DaysOrCurrentProfitAndLoss: profitLoss.toFixed(2),
        };
    })
}

function getTransformedStocks(stocks) {
    if (!stocks) return [];

    return stocks.map((stock) => ({
        stockId: stock.id,
        stockSymbol: stock.symbol,
        companyName: stock.companyName,
        candlesClose: stock.candlesClose,
        currentPrice: stock.currentPrice,
        low7DaysOrTotalHoldings: stock.low7Day,
        high7DaysOrCurrentProfitAndLoss: stock.high7Day,
    }));
}


export { getTransformedPortfolioStocks, getTransformedStocks };