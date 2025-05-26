/* eslint-disable @typescript-eslint/no-explicit-any */
// export const baseUrl = "http://localhost:5002/api"
// export const baseUrl = "http://18.156.77.94:5002/api"
// export const baseUrl = "https://profilo-sportivo-4.onrender.com/api"
export const baseUrl = "https://forplayr.it/api"

export const postRequest = async(url: string, body: unknown) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if(!response.ok) { // Es status 400 or 500
        let message
        if(data.message) {
            message = data.message
        } else {
            message = data
        }
        return { error: true, message: message }
    }

    return data
}

export const getRequest = async(url: string) => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json()

    if(!response.ok) { 
        let message
        if(data.message) {
            message = data.message
        } else {
            message = data
        }
        return { error: true, message: message }
    }

    return data
}

export const putRequest = async (url: string, body: any) => {
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
        let message
        if (data.message) {
            message = data.message
        } else {
            message = data
        }
        return { error: true, message: message }
    }

    return data
}
