/**
* APIs.
*
* Goal is to consolidate all of the API calls inside the service.
*
* TODO: error handling of your choice for server errors (ex: bugsnag).
*/

const BASE_SWAPI_URL = 'https://swapi.dev/api';

export const getPeopleData = async () => {
  const url = `${BASE_SWAPI_URL}/people`;
  try {
    const apiResponse = await fetch(url)
      .then(response => response.json())
      .then(data => data);
    return apiResponse;

  } catch (error) {
    console.log(error);
  }
}