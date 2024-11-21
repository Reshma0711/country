
// import React, { useEffect, useState } from 'react'
// // import countriesData from '../countriesData'
// import CountryCard from './CountryCard'
// import CountriesListShimmer from './CountriesListShimmer'

// export default function CountriesList({ query }) {
//   const [countriesData, setCountriesData] = useState([])
//   // const [currentPage,setCurrentPage]=useState(1);
//   // const[postperPage,setPostsPerPage]=useState(8);

//   // const [filteredData, setQuery] = useFilter(data, () => '')

//   useEffect(() => {
//     fetch('https://restcountries.com/v3.1/all')
//       .then((res) => res.json())
//       .then((data) => {
//         setCountriesData(data)
//       })
//   }, [])

//   if (!countriesData.length) {
//     return <CountriesListShimmer />
//   }
//   // const lastPostIndex = currentPage * postPerPage ;
//   // const firstPostIndex=lastPostIndex - postPerPage ;
//   // const currentPosts= CountriesData.slice(firstPostIndex,lastPostIndex)

//   return (
//     <>
//       <div className="countries-container">
//         {countriesData
//           .filter((country) =>
//             country.name.common.toLowerCase().includes(query) || country.region.toLowerCase().includes(query)
//           )
//           .map((country) => {
//             return (
//               <CountryCard
//                 key={country.name.common}
//                 name={country.name.common}
//                 flag={country.flags.svg}
//                 population={country.population}
//                 region={country.region}
//                 capital={country.capital?.[0]}
//                 data={country}
//               />
//             )
//           })}
//       </div>
//     </>
//   )
// }


import React, { useEffect, useState, useCallback } from 'react'
import CountryCard from './CountryCard'
import CountriesListShimmer from './CountriesListShimmer'

export default function CountriesList({ query }) {
  const [countriesData, setCountriesData] = useState([])  
  const [displayedCountries, setDisplayedCountries] = useState([]) 
  const [loading, setLoading] = useState(false) 
  const [hasMore, setHasMore] = useState(true) 

  useEffect(() => {
    fetch('https://restcountries.com/v3.1/all')
      .then((res) => res.json())
      .then((data) => {
        setCountriesData(data)
        setDisplayedCountries(data.slice(0, 8)) 
      })
  }, [])

  
  const loadMoreCountries = useCallback(() => {
    if (loading || !hasMore) return; 

    setLoading(true);
    const nextIndex = displayedCountries.length; 

    
    if (nextIndex < countriesData.length) {
      setDisplayedCountries((prev) => [
        ...prev,
        ...countriesData.slice(nextIndex, nextIndex + 8), 
      ]);
    } else {
      setHasMore(false); 
    }

    setLoading(false);
  }, [countriesData, displayedCountries, loading, hasMore]);

 
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        loadMoreCountries(); 
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll); 
    };
  }, [loadMoreCountries]);

 
  const filteredCountries = displayedCountries.filter(
    (country) =>
      country.name.common.toLowerCase().includes(query.toLowerCase()) ||
      country.region.toLowerCase().includes(query.toLowerCase())
  );

  if (!countriesData.length) {
    return <CountriesListShimmer />
  }

  return (
    <>
      <div className="countries-container">
        {filteredCountries.map((country) => (
          <div className="country-card-wrapper" key={country.name.common}>
            <CountryCard
              name={country.name.common}
              flag={country.flags.svg}
              population={country.population}
              region={country.region}
              capital={country.capital?.[0]}
              data={country}
            />
          </div>
        ))}
      </div>

      {loading && <CountriesListShimmer />} 
    </>
  );
}
