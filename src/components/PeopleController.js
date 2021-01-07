import React, { useEffect, useState } from 'react';
import { SpinnerDotted } from 'spinners-react';

import { getPeopleData, getPlanetData, getAllPlanets } from '../services/api';
import MainTable from './MainTable';

export default function PeopleController () {
  const [people, setPeople] = useState({ data: [] });
  const [starWars, setStarWars] = useState({ data: [] });
  const [isFetchingPeople, setIsFetchingPeople] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('http://swapi.dev/api/people/?page=1');

  // Handle fetching of all characters
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
      const apiResponse = await getPlanetData({ planetId }).then(data => data);

      const charsWithCurrentPlanetId = people.data.filter(char => char.planetId === planetId );
      const updatedCharacters = charsWithCurrentPlanetId.map(char => {
        return {
          ...char,
          planetName: apiResponse && apiResponse.name,
          planetPopulation: apiResponse && apiResponse.residents && apiResponse.residents.length
        }
      })

      const newPeople = [
        ...people.data,
        ...updatedCharacters
      ];

      setStarWars(starWars => ({
        data: [...newPeople]
      }));
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
