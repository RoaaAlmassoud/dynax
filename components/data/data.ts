let years: { id: number, name: string, value: number}[] = [];
for(let i=0; i<= 10; i++){
    const currentDate = new Date();
    let year: number = i === 0? currentDate.getFullYear(): years[i-1].value +1
    years.push({
        id: i,
        name: `${year}年`,
        value: year
    })
}

let months: { id: number, name: string, value: number}[] = [];
for(let i=1; i<= 12; i++){
    months.push({
        id: i,
        name: `${i}月`,
        value: i
    })
}

export {years, months};