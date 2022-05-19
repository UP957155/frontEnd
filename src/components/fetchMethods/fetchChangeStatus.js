
// define and export async function as fetch method
export const fetchChangeStatus = async (id, status, difficulty, user) => {
    try {
        // set up request properties and catch response into the variable
        const response = await fetch('http://localhost:8080/changeStatus', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ // define body with json data of request
                id: id,
                status: status,
                difficulty: difficulty
            })
        })

        const data = await response.json() // transform response data into the json format 

        return data
        
    } catch (error) { // if error then return error message
        
        return {
            error: 'SERVER ERROR',
            message: error.message
        }

    }
}