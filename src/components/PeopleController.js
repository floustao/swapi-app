import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

import { getPeopleData, getPlanetData, getAllPlanets } from '../services/api';
import MainTable from './MainTable';

export default function PeopleController () {
  const [inFlightRequests, setInFlightRequests] = useState([]);
  const [people, setPeople] = useState({ data: [] });
  const [starWars, setStarWars] = useState({ data: [] });
  const [isFetchingPeople, setIsFetchingPeople] = useState(false);
  const [isFetchingPlanet, setIsFetchingPlanet] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('http://swapi.dev/api/people/?page=1');

  /**
   * General idea:
   * - get it working without pagination first
   * - do it serialized, to pause and understand data structures
   * 
   * Step1 - get all characters:
   * - recursive method with setCurrentUrl is prone to errors and difficult bugs to debug.
   * - prefer do while loop instead.
   * 
   * Step 2 - get all planet data
   * - loop over people and call getPlanetData
   * - iterate over characters to build an array of planet endpoints/planetIds.
   * - use Promise.all to fetch planets in parallel
   * - optimize with caching to avoid duplicate planet calls.
   * 
   */
  
  useEffect(() => {
    const loadPeople = async () => {
      setIsFetchingPeople(true);
      const apiResponse = await getPeopleData({ url: currentUrl }).then(data => data);

      setCurrentUrl(apiResponse.next);
      const newPeople = cleanPeopleData({ people: apiResponse.results });
      setPeople(people => ({
        data: [...people.data, ...newPeople]
      }));
    };

    if (currentUrl) {
      loadPeople();
    }

    return () => setIsFetchingPeople(false);

  }, [currentUrl]);

  useEffect(() => {
    const loadPlanet = async ({ character }) => {
      const { planetId } = character;
      setInFlightRequests([...inFlightRequests, planetId]);
      console.log(inFlightRequests)
      if (!inFlightRequests.includes(planetId)) {
        const apiResponse = await getPlanetData({ planetId }).then(data => data);

        const charsWithCurrentPlanetId = people.data.filter(char => char.planetId === planetId );
        const updatedCharacters = charsWithCurrentPlanetId.map(char => {
          const planetName = apiResponse && apiResponse.name;
          const planetPopulation = apiResponse && apiResponse.residents && apiResponse.residents.length;
          return {
            ...char,
            planetName,
            planetPopulation
          }
        });

        const newPeople = [
          ...people.data,
          updatedCharacters
        ];

        setStarWars(starWars => ({
          data: [...newPeople]
        }));
      };
    };

    if (people && people.data && people.data.length && !isFetchingPeople) {
      people.data.forEach(character => loadPlanet({ character }));
    }
  }, [people, isFetchingPeople]);
  
  function getCharacterPlanetID ({ homeworld = '' }) {
    if (!homeworld) { return null };

    const planetId = homeworld
      .match(/\/(\d+)+[\/]?/g)[0]
      .replace(/\//g, "");

    return planetId;
  }

  /**
   * Extract data we need from people.
   */
  function cleanPeopleData ({ people = [] }) {
    if (!people.length) {
      return [];
    }

    const peopleData = people.map(character => {
      const { name, birth_year, homeworld } = character || {};
      const planetId = getCharacterPlanetID({ homeworld });
      
      return {
        name,
        birthYear: birth_year,
        planetId,
        homeworld
      };
    });

    return peopleData;
  }

  if (isFetchingPeople) {
    return (
      <SpinnerDotted />
    );
  }

  return (
    <MainTable
      people={starWars.data}
    />
  );
}
