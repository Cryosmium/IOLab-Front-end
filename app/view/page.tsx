'use client'

import {FilterCheckbox, FilterViewOption} from "@/components/FilterViewOption";
import {ScientistCell} from "@/components/ScientistCell";
import {fetchGetOrganizationsFilter, OrganizationBody} from "@/lib/API";
import {useEffect, useMemo, useReducer, useState} from "react";
import {SearchOptions} from "@/components/SearchOptions";
import {FilterState} from "@/lib/FilterState";
import {getCookies, setCookie} from "cookies-next/client";

export default function ViewPage() {
    const [universities, setUniversities] = useState<OrganizationBody[] | null>(null)
    const [cathedras, setCathedras] = useState<OrganizationBody[] | null>(null)
    const [institutes, setInstitutes] = useState<OrganizationBody[] | null>(null)

    const filters = useMemo(() => {
        const state = new FilterState()
        state.readFromCookies(getCookies() ?? {})
        return state
    }, [])

    // i hate this, but it works
    const [, forceRender] = useReducer(x => {
        filters.getCookies().forEach((value, key) => {
            setCookie(key, value)
        })
        return x + 1
    }, 0)

    useEffect(() => {
        (async function () {
            const allOrganizations = await fetchGetOrganizationsFilter() ?? []

            const fetchedUniversities: OrganizationBody[] = []
            const fetchedCathedras: OrganizationBody[] = []
            const fetchedInstitutes: OrganizationBody[] = []

            for (const org of allOrganizations) {
                switch (org.type.toLowerCase()) {
                    case "cathedra":
                        fetchedCathedras.push(org)
                        break
                    case "university":
                        fetchedUniversities.push(org)
                        break
                    case "institute":
                        fetchedInstitutes.push(org)
                        break
                }
            }

            setUniversities(fetchedUniversities)
            setCathedras(fetchedCathedras)
            setInstitutes(fetchedInstitutes)
        })()
    }, [])

    return <div className={`w-full h-full flex`}>
        <div className={`h-full max-h-full w-[30rem] flex-shrink-0 flex flex-col`}>
            <FilterViewOption header="Uczelnia">
                {
                    universities?.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((uni) => {
                        return <FilterCheckbox
                            key={uni.id}
                            label={uni.name}
                            count={0}
                            isChecked={filters.universities.has(uni.id)}
                            onChoice={(isChecked: boolean) => {
                                if (isChecked) {
                                    filters.universities.add(uni.id)
                                    console.log(`Added university filter: ${uni.id}`)
                                } else {
                                    filters.universities.delete(uni.id)
                                    console.log(`Removed university filter: ${uni.id}`)
                                }

                                forceRender()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Instytut">
                {
                    institutes?.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((institute) => {
                        return <FilterCheckbox
                            key={institute.id}
                            label={institute.name}
                            count={0}
                            isChecked={filters.institutes.has(institute.id)}
                            onChoice={(isChecked: boolean) => {
                                if (isChecked) {
                                    filters.institutes.add(institute.id)
                                    console.log(`Added institute filter: ${institute.id}`)
                                } else {
                                    filters.institutes.delete(institute.id)
                                    console.log(`Removed institute filter: ${institute.id}`)
                                }

                                forceRender()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Katedra">
                {
                    cathedras?.sort((left, right) => {
                        return left.name.localeCompare(right.name)
                    }).map((cathedra, index) => {
                        return <FilterCheckbox
                            key={index}
                            label={cathedra.name}
                            count={0}
                            isChecked={filters.cathedras.has(cathedra.id)}
                            onChoice={(isChecked: boolean) => {
                                if (isChecked) {
                                    filters.cathedras.add(cathedra.id)
                                    console.log(`Added cathedra filter: ${cathedra.id}`)
                                } else {
                                    filters.cathedras.delete(cathedra.id)
                                    console.log(`Removed cathedra filter: ${cathedra.id}`)
                                }

                                forceRender()
                            }}
                        />
                    }) ?? []
                }
            </FilterViewOption>
            <FilterViewOption header="Stanowisko"/>
            <FilterViewOption header="Ilość Publikacji"/>
            <FilterViewOption header="Ilość Punktów Ministerialnych"/>
            <FilterViewOption header="Współczynnik IF"/>
            <FilterViewOption header="Wydawca"/>
            <FilterViewOption header="Lata Wydawania Publikacji"/>
            <FilterViewOption header="Rodzaj Publikacji"/>

            <div className={`bg-black/80 w-full flex-1`}></div>
        </div>
        <div className={`flex-1`}>
            <div className={`pl-8 pr-8 p-6 w-full content-center flex flex-col gap-4`}>
                <p className={`text-3xl font-[600]`}>Znaleziono 0 wyników wyszukiwania</p>
                <SearchOptions/>
            </div>
            <ScientistCell/>
            <ScientistCell/>
            <ScientistCell/>
            <ScientistCell/>
        </div>
    </div>
}