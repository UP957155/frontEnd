
// define and export async function as fetch method
export const fetchEditQuestion = async (question, user) => {
    try {
        // set up request properties and catch response into the variable
        const response = await fetch('http://localhost:8080/editQuestion', {
            method: 'put',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ // define body with json data of request
                question: question
            })
        })

        const data = await response.json() // transform response data into the json format

        return data
        
    } catch (error) { // if error then return error message
        
        return {
            error: 'CONNECTION REFUSED',
            message: error.message
        }

    }
}