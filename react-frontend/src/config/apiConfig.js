let api_url = 'http://graphql-event-management.herokuapp.com/graphql' // production
if (process.env.NODE_ENV === 'development') {
    api_url = 'http://localhost:8080/graphql'; // developement
}
export const BASE_API_URL = api_url;
