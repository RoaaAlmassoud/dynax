export function getDay(date: Date){
    const dateObject = new Date(date)
    return {
        dayNumber: dateObject.getDate(),
        dayName: dateObject.toLocaleDateString('ja-JP', {weekday: 'short'}),
        month: dateObject.getMonth(),
        year: dateObject.getFullYear()
    }
}

export function previousDate(date: Date){
    const dateObject = new Date(date)
    let previousYear =  dateObject.getMonth()+1 === 1?dateObject.getFullYear()-1:dateObject.getFullYear()
    let previousMonth = dateObject.getMonth() +1 === 1? 12:dateObject.getMonth()
    return {
        previousYear: previousYear,
        previousMonth: previousMonth
    }
}

export function nextDate(date: Date){
    const dateObject = new Date(date)
    let nextYear =  dateObject.getMonth()+1 === 12?dateObject.getFullYear()+1:dateObject.getFullYear()
    let nextMonth = dateObject.getMonth() +1 === 12? 1:dateObject.getMonth()+1

    return {
        nextYear: nextYear,
        nextMonth: nextMonth
    }
}

export function unique () {
    return Math.random().toString().substring(2, 8);
}
export function getResponseData(response:any) {
    if (!response) return null;
    let result = {'data': {}};

    if (response.status === 200) {
        if(response.data){
            result['data'] = response.data.data? response.data.data: response;
        } else {
            result['data'] = response
        }

    }

    if (response.status !== 200) {
        result = response.data;

    }

    return result ? result : null;
};