
// define and export async function as fetch method
export const fetchLogout = async (email, password) => {
    try {
        // set up request properties and catch response into the variable
        const response = await fetch('http://localhost:8080/logout', {
            method: 'post',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json'
            }
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