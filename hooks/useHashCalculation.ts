import { useState, useEffect } from 'react'
import md5 from 'md5'

function calcMd5Distance(s1: string, s2: string) {
  let distance = 0
  for (let i = 0; i < Math.min(s1.length, s2.length); i++) {
    if (s1[i] === s2[i]) {
      continue
    }
    distance += Math.abs(s1.charCodeAt(i) - s2.charCodeAt(i))
  }
  return distance
}

function makeSortedNameHashDistanceTuple(targetHash: string, names: string[]) {
  let nameHashDistanceTuple = names.map((name) => {
    let nameMd5 = md5(name)
    let distance = calcMd5Distance(targetHash, nameMd5)
    return [name, nameMd5, distance] as [string, string, number]
  })
  // sort by distance
  nameHashDistanceTuple.sort((a, b) => {
    return a[2] - b[2]
  })
  return nameHashDistanceTuple
}

export function useHashCalculation(salt: string, participants: string[], count: number) {
  const [sortedResults, setSortedResults] = useState<[string, string, number][]>([])
  const [saltHash, setSaltHash] = useState('')
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    if (salt && participants.length > 0) {
      setIsCalculating(true)
      const timer = setTimeout(() => {
        const newSaltHash = md5(salt)
        setSaltHash(newSaltHash)
        const newSortedResults = makeSortedNameHashDistanceTuple(newSaltHash, participants)
        setSortedResults(newSortedResults)
        setIsCalculating(false)
      }, 1000) // Simulate a delay for the calculation
      return () => clearTimeout(timer)
    } else {
      setSortedResults([])
      setSaltHash('')
      setIsCalculating(false)
    }
  }, [salt, participants])

  return { sortedResults, saltHash, isCalculating }
}

