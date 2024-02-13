import moment from 'moment'
import './App.css'
import { useEffect, useRef, useState } from 'react'
import MonthSection, { IItem } from './components/MonthSection';

function App() {
    const currentMonthRef = useRef<HTMLDivElement | null>(null)
    const monthsListRef = useRef<HTMLDivElement | null>(null)

    const [updateMonths, setUpdateMonths] = useState<boolean>()
    const [items, setItems] = useState<IItem[]>([])

    const penult = moment()
    const last = moment()
    const now = moment()
    const next = moment()

    penult.add(-2, 'years')
    last.add(-1, 'years')
    next.add(1, 'years')

    const years = [penult.year(), last.year(), now.year(), next.year()]

    const months: number[][] = []

    years.forEach(t => {
        for (let i = 1; i <= 12; i++) {
            months.push([t, i])
        }
    })

    useEffect(() => {
        if (currentMonthRef.current) {
            currentMonthRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center' })
        }

        setItems(JSON.parse(localStorage.getItem('items') ?? '[]'))
    }, [setItems])

    function updateItems(items: IItem[]) {
        setItems(items)
        localStorage.setItem('items', JSON.stringify(items))

        setUpdateMonths(!updateMonths)
    }

    function handleAddNewSectionButtonClick() {
        const description: string = window.prompt('Enter a description') ?? ''

        if (description == '' || description.length == 0)
            return

        const row: number = getAvailableRow()

        if (row == -1 || row > 10) {
            alert('There are no slots available')
            return
        }

        const item: IItem = {
            label: description,
            start: moment().unix(),
            end: null,
            color: getColor(),
            line: row
        }

        items.push(item)

        updateItems(items)
    }

    function handleScrollLeftClick() {
        if (monthsListRef.current) {
            monthsListRef.current.scrollBy({ left: -300, behavior: 'smooth' })
        }
    }

    function handleScrollRightClick() {
        if (monthsListRef.current) {
            if (monthsListRef.current) {
                monthsListRef.current.scrollBy({ left: 300, behavior: 'smooth' })
            }
        }
    }

    function getColor() {
        return "hsl(" + 360 * Math.random() + ',' +
            (25 + 70 * Math.random()) + '%,' +
            (85 + 10 * Math.random()) + '%)'
    }

    function getAvailableRow(): number {
        const last = items.reduce((acc: IItem, t: IItem) => t.line > acc.line ? t : acc)

        const availableItems = items.filter(t => t.end != null && moment.unix(t.end).isBefore(moment(), 'month'))

        for (let i = 0; i < availableItems.length; i++) {
            const current = availableItems[i]

            if (items.some((t: IItem) => t.line == current.line && t.end == null))
                continue

            return current.line
        }

        return last.line + 1
    }

    function renderMonths() {
        return months.map(([y, m]) => <MonthSection key={y + m + Math.random()} year={y} month={m} items={items} elRef={currentMonthRef} setItems={t => updateItems(t)}></MonthSection>)
    }

    return (
        <div className="h-screen flex flex-row bg-gray-100">
            <div ref={monthsListRef} className="flex overflow-x-scroll">
                <div
                    className='m-3 p-3 absolute self-center rounded-full shadow-lg cursor-pointer hover:bg-gray-400 active:shadow-sm text-gray-100 bg-gray-300 invisible md:visible'
                    onClick={() => handleScrollLeftClick()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                </div>
                <div
                    className='m-3 p-3 absolute self-center right-0 rounded-full shadow-lg cursor-pointer hover:bg-gray-400 active:shadow-sm text-gray-100 bg-gray-300 invisible md:visible'
                    onClick={() => handleScrollRightClick()}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-9 h-9">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </div>

                {updateMonths ? renderMonths() : renderMonths()}

                <div className='m-3 p-3 absolute right-6 bottom-6 md:right-12 md:bottom-12 rounded-full shadow-lg cursor-pointer hover:bg-blue-500 bg-blue-400 active:shadow-sm' onClick={() => handleAddNewSectionButtonClick()}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default App
