import { Sparklines, SparklinesLine } from 'react-sparklines';

export default function StockSmallChart({ candlesClose = [], width = 100, height = 30, strokeWidth = 1, color = "green", fill = "none" }) {
    return (
        <Sparklines Sparklines
            data={candlesClose}
            width={width}
            height={height}
        >
            <SparklinesLine
                color={color}
                style={{ strokeWidth, stroke: color, fill }}
            />
        </Sparklines >
    );
}