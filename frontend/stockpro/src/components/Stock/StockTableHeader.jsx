export default function StockHeader({
    heading1 = "Company",
    heading2 = "Chart",
    heading3 = "Price",
    isHome = true,
}) {
    return (
        <thead className="bg-gray-100 text-gray-700">
            <tr>
                <th className="py-3 text-left px-4">{heading1}</th>
                <th className="text-center">{heading2}</th>
                <th className="text-center">{heading3}</th>
                <th className="text-center">
                    {isHome ? "7 Day's Low" : "Total Holdings"}
                </th>
                <th className="text-center">
                    {isHome ? "7 Day's High" : "Total P & L"}
                </th>
            </tr>
        </thead>
    );
}
