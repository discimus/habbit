import moment from "moment"

const LIMIT_OF_ROWS = 10

interface IItem {
    label: string
    start: number
    end: number | null
    color: string
    line: number
}

export type { IItem }

interface IMonthSectionParams {
    year: number
    month: number
    items: IItem[]
    elRef: React.MutableRefObject<HTMLDivElement | null>
    setItems: React.Dispatch<IItem[]>
}

function MonthSection({ year, month, items, elRef, setItems }: IMonthSectionParams) {
    const now = new Date()
    const nowAsFormatedString = moment(now).format('MMM, YYYY')

    const currentMonth = moment(`${year}-${month}`, 'YYYY-MM')
    const text = currentMonth.format('MMM, YYYY')

    const isSameMonth = nowAsFormatedString === text

    function handleFinishItemClick(item: IItem) {
        item.end = moment().unix()
        items.splice(items.indexOf(item), 1)
        items.push(item)

        setItems(items)
    }

    function renderFinishButton(item: IItem) {
        return (
            <a href="#" className="text-sky-500 hover:text-sky-600 active:text-sky-700" onClick={() => handleFinishItemClick(item)}>
                <strong>Finish</strong>
            </a>
        )
    }

    function renderCompletedIcon() {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-green-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
        )
    }

    function renderMothSlot(item: IItem, showLabel: boolean = false) {
        const { label, color, end } = item

        const shouldRenderFinishButton = end == null && currentMonth.isSame(moment(), 'month')
        const shouldRenderCompletedButton = end != null && currentMonth.isSame(moment.unix(end), 'month')

        return (
            <div className="flex flex-row" style={{ backgroundColor: color }}>
                <div className='p-1 min-h-8 relative flex flex-row flex-grow gap-3 outline-1 whitespace-nowrap overflow-hidden hover:overflow-visible'>
                    {showLabel ? <span className="z-10">{label}</span> : <></>}
                </div>
                <div className="px-1 flex flex-row gap-1 items-center relative right-0">
                    {shouldRenderFinishButton ? renderFinishButton(item) : <></>}
                    {shouldRenderCompletedButton ? renderCompletedIcon() : <></>}
                </div>
            </div>
        )
    }

    function renderEmptyMothSlot() {
        return (
            <div className='p-1 min-h-8 relativeoutline-1'></div>
        )
    }

    function renderRow(row: number) {
        const now = Date.now()

        let shouldShowLabel = false

        const filteredItems = items.filter(t => {
            if (t.line == row && moment.unix(t.start).isSame(currentMonth, 'month'))
                shouldShowLabel = true

            return (
                t.line == row &&
                (moment.unix(t.start).isSame(currentMonth, 'month') || t.start < currentMonth.unix()) &&
                currentMonth.isSameOrBefore(now, 'month') &&
                (t.end == null || (t.end != null && currentMonth.isBefore(moment.unix(t.end))))
            )
        })

        const first = filteredItems[0] ?? null

        return (
            <div key={year + month + row}>
                {first != null ? renderMothSlot(first, shouldShowLabel) : renderEmptyMothSlot()}
            </div>
        )
    }

    return (
        <div
            ref={isSameMonth ? elRef : null}
            key={text}
            className={`min-w-48 flex flex-col border-r-2 border-gray-200 ${isSameMonth ? 'bg-gray-200' : ''}`}
        >
            <div className="text-center">
                <div className="p-1">
                    <strong>{text}</strong>
                </div>
                <div className="flex flex-col">
                    {Array.from(Array(LIMIT_OF_ROWS).keys()).map((t: number) => renderRow(t + 1))}
                </div>
            </div>
        </div>
    )
}

export default MonthSection