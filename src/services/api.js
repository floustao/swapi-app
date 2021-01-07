/**
* APIs.
*
* Goal is to consolidate all of the API calls inside the service.
*
* TODO: error handling of your choice for server errors (ex: bugsnag).
*/

import axios from 'axios';

const BASE_SWAPI_URL = 'https://swapi.dev/api';

export const getPeopleData = async ({ url = '' }) => {
  if (!url) {
    return;
  }

  try {
    const apiResponse = await axios.get(url);
    return apiResponse.data;
  } catch (error) {
    console.log(error);
  }
}

export const getPlanetData = async ({ planetId = '' }) => {
  const url = `${BASE_SWAPI_URL}/planets/${planetId}`;
  try {
    const apiResponse = await axios.get(url);
    return apiResponse.data;

  } catch (error) {
    console.log(error);
  }
}

export const getAllPlanets = async () => {
  const url = `${BASE_SWAPI_URL}/planets/`;

  try {
    const apiResponse = await axios.get(url);
    return apiResponse.data;

  } catch (error) {
    console.log(error);
  }
}