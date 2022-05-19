
// define and export async function as fetch method
export const fetchRegister = async (nickname, email, password) => {
    try {
        // set up request properties and catch response into the variable
        const response = await fetch('http://localhost:8080/register', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ // define body with json data of request
                nickname: nickname,
                email: email,
                password: password
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